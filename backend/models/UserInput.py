import pandas as pd
import numpy as np
import pickle
import xgboost as xgb
import os
import warnings
warnings.filterwarnings('ignore')
script_dir = os.path.dirname(os.path.abspath(__file__))
csv_input_path = os.path.join(script_dir, "K2_user_input.csv")
csv_output_path = os.path.join(script_dir, "k2_user_predictions.csv")
try:
    with open(os.path.join(script_dir, "k2_preprocess.pkl"), "rb") as f:
        preprocess_objs = pickle.load(f)
    
    imputer = preprocess_objs["imputer"]
    scaler = preprocess_objs["scaler"]
    label_encoder = preprocess_objs["label_encoder"]
    feature_names = preprocess_objs["feature_names"]
    print(feature_names)
    categorical_encoders = preprocess_objs.get("categorical_encoders", {})
    outlier_stats = preprocess_objs["outlier_stats"]
    
    # Preprocessing model loaded
    
except FileNotFoundError:
    raise FileNotFoundError("K2_Preprocessing_Model.pkl not found. Please run 'K2_preprocessing_model_creator.py' first")
try:
    with open(os.path.join(script_dir, "xgboost_classweight_model.pkl"), "rb") as f:
        model = pickle.load(f)
    # Model loaded successfully
except FileNotFoundError:
    raise FileNotFoundError("xgboost_classweight_model.pkl not found. Please run 'Train.py' first to train the model")
def load_csv_smart(filepath):
    """
    Smart CSV loader that handles:
    - Comma-separated files
    - Tab-separated files
    - Comments (lines starting with #)
    """
    with open(filepath, 'r') as f:
        first_line = f.readline()
        while first_line.startswith('#'):
            first_line = f.readline()
    comma_count = first_line.count(',')
    tab_count = first_line.count('\t')
    if tab_count > comma_count:
        sep = '\t'
    else:
        sep = ','
    df = pd.read_csv(filepath, sep=sep, comment="#", on_bad_lines="skip", engine="python")
    return df
def preprocess_user_csv(df_raw):
    """
    Preprocesses user input CSV following the same pipeline as training
    
    Steps:
    1. Check column overlap (minimum 10 features required)
    2. Keep only numeric features that match expected features
    3. Handle missing columns (fill with NaN)
    4. Apply categorical encoding (if applicable)
    5. Apply outlier clipping
    6. Impute missing values
    7. Ensure correct column order
    8. Scale features
    9. Return processed data ready for prediction
    """
    
    
    overlap_cols = [c for c in df_raw.columns if c in feature_names]
    if len(overlap_cols) > 0:
        pass

    if len(overlap_cols) < 10:
        raise ValueError(f"Need at least 10 overlapping features, found {len(overlap_cols)}")

    df = df_raw[overlap_cols].copy()

    for col in df.columns:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    missing_cols = [col for col in feature_names if col not in df.columns]
    if missing_cols:
        for col in missing_cols:
            df[col] = np.nan

    df = df[feature_names]

    missing_before = df.isna().sum().sum()

    df = df.replace({pd.NA: np.nan})

    for col, stats in outlier_stats.items():
        if col in df.columns:
            df[col] = df[col].clip(lower=stats['lower'], upper=stats['upper'])

    df_array = imputer.transform(df.values)
    df_imputed = pd.DataFrame(df_array, columns=feature_names, index=df.index)

    missing_after = df_imputed.isna().sum().sum()

    df_scaled_array = scaler.transform(df_imputed.values)

    return df_scaled_array

if not os.path.exists(csv_input_path):
    raise FileNotFoundError(f"Input file not found: {csv_input_path}")

df_input = load_csv_smart(csv_input_path)

df_processed = preprocess_user_csv(df_input)

try:
    pred_encoded = model.predict(df_processed)
    pred_proba = model.predict_proba(df_processed)

    pred_labels = label_encoder.inverse_transform(pred_encoded.astype(int))

    pred_confidence = np.max(pred_proba, axis=1)

    class_probabilities = {}
    for i, class_name in enumerate(label_encoder.classes_):
        class_probabilities[f'prob_{class_name}'] = pred_proba[:, i]

except Exception:
    import traceback
    traceback.print_exc()
    raise

df_output = df_input.copy()
df_output["predicted_class"] = pred_labels
df_output["confidence"] = pred_confidence

for class_name in label_encoder.classes_:
    df_output[f"prob_{class_name}"] = class_probabilities[f'prob_{class_name}']

try:
    df_output.to_csv(csv_output_path, index=False)
except Exception:
    raise