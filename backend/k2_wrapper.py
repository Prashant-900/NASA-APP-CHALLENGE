import pandas as pd
import numpy as np
import pickle
import xgboost as xgb
import os
import warnings

warnings.filterwarnings('ignore')

# -------------------------------
# Paths
# -------------------------------
script_dir = os.path.dirname(os.path.abspath(__file__))

# -------------------------------
# Load preprocessing objects
# -------------------------------
try:
    with open(os.path.join(script_dir, "models", "k2_preprocess.pkl"), "rb") as f:
        preprocess_objs = pickle.load(f)

    imputer = preprocess_objs["imputer"]
    scaler = preprocess_objs["scaler"]
    label_encoder = preprocess_objs["label_encoder"]
    feature_names = preprocess_objs["feature_names"]
    categorical_encoders = preprocess_objs.get("categorical_encoders", {})
    outlier_stats = preprocess_objs["outlier_stats"]

except FileNotFoundError:
    raise FileNotFoundError("K2_Preprocessing_Model.pkl not found. Please run 'K2_preprocessing_model_creator.py' first")

# -------------------------------
# Load trained K2 model
# -------------------------------
try:
    with open(os.path.join(script_dir, "models", "k2.pkl"), "rb") as f:
        model = pickle.load(f)
except FileNotFoundError:
    raise FileNotFoundError("k2.pkl not found. Please run 'Train.py' first to train the model")

# -------------------------------
# Preprocessing Function
# -------------------------------
def preprocess(df_raw):
    """
    Preprocesses user input DataFrame following the same pipeline as training
    """

    # 1. Check column overlap
    overlap_cols = [c for c in df_raw.columns if c in feature_names]
    if len(overlap_cols) < 10:
        return f"Need at least 10 overlapping features, found {len(overlap_cols)}"

    # 2. Keep only overlapping features
    df = df_raw[overlap_cols].copy()

    # 3. Convert to numeric
    for col in df.columns:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    # 4. Handle missing columns
    missing_cols = [col for col in feature_names if col not in df.columns]
    for col in missing_cols:
        df[col] = np.nan

    # Ensure feature order
    df = df[feature_names]

    # 5. Outlier clipping
    for col, stats in outlier_stats.items():
        if col in df.columns:
            df[col] = df[col].clip(lower=stats['lower'], upper=stats['upper'])

    # 6. Impute missing values
    df_imputed = pd.DataFrame(
        imputer.transform(df.values),
        columns=feature_names,
        index=df.index
    )

    # 7. Scale features
    df_scaled_array = scaler.transform(df_imputed.values)

    return df_scaled_array

# -------------------------------
# Prediction Function
# -------------------------------
def predict(df_raw):
    """Make predictions using K2 model"""
    try:
        processed_data = preprocess(df_raw)

        if isinstance(processed_data, str):
            return processed_data  # return error message if preprocessing failed

        # Predictions
        pred_encoded = model.predict(processed_data)
        pred_proba = model.predict_proba(processed_data)

        pred_labels = label_encoder.inverse_transform(pred_encoded.astype(int))
        pred_confidence = np.max(pred_proba, axis=1)

        # Attach results to DataFrame
        df_output = df_raw.copy()
        df_output["predicted_class"] = pred_labels
        df_output["confidence"] = pred_confidence

        # Add class probabilities
        for i, class_name in enumerate(label_encoder.classes_):
            df_output[f"prob_{class_name}"] = pred_proba[:, i]

        return df_output

    except Exception as e:
        return f"K2 prediction failed: {str(e)}"
