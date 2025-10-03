import pandas as pd
import numpy as np
import pickle
import xgboost as xgb
import os

# -------------------------------
# Relative paths
# -------------------------------
script_dir = os.path.dirname(os.path.abspath(__file__))  # folder of this script
# csv_input_path = os.path.join(script_dir, "user_input.csv")
# csv_output_path = os.path.join(script_dir, "user_upload_with_predictions.csv")

# -------------------------------
# Load preprocessing objects
# -------------------------------
with open(os.path.join(script_dir, "kepler_preprocess.pkl"), "rb") as f:
    objs = pickle.load(f)

imputer = objs["imputer"]
feature_names = objs["feature_names"]  # final 38 features
print(feature_names)
label_encoder = objs["label_encoder"]

# -------------------------------
# Load trained XGBoost model
# -------------------------------
with open(os.path.join(script_dir, "cum.pkl"), "rb") as f:
    model = pickle.load(f)

# -------------------------------
# Preprocess CSV function
# -------------------------------
def preprocess_csv(df):
    # Keep only overlapping columns
    overlap = [c for c in df.columns if c in feature_names]

    if len(overlap) < 10:
        raise ValueError(
            f"Input CSV does not have enough valid Kepler features (found only {len(overlap)})."
        )

    df = df[overlap]

    # Add missing columns as np.nan
    for col in feature_names:
        if col not in df.columns:
            df[col] = np.nan

    # Reorder columns
    df = df[feature_names]

    # Replace pd.NA with np.nan
    df = df.replace({pd.NA: np.nan})

    # Impute missing values
    df[df.columns] = imputer.transform(df[df.columns])

    return df

# -------------------------------
# Main prediction
# -------------------------------
if not os.path.exists(csv_input_path):
    raise FileNotFoundError(f"CSV file not found: {csv_input_path}")

df_input = pd.read_csv(csv_input_path)
df_processed = preprocess_csv(df_input)

# Predict
pred_encoded = model.predict(df_processed)
pred_labels = label_encoder.inverse_transform(pred_encoded.astype(int))

# Add prediction column
df_input["predicted_class"] = pred_labels

# Save output CSV
df_input.to_csv(csv_output_path, index=False)
print(f"Predictions saved to: {csv_output_path}")
print(df_input.head())
