import pandas as pd
import numpy as np
import pickle
import os

# -------------------------------
# Paths
# -------------------------------
script_dir = os.path.dirname(os.path.abspath(__file__))
# -------------------------------
# Load preprocessing objects
# -------------------------------
with open(os.path.join(script_dir, "models", "toi_preprocess.pkl"), "rb") as f:
    objs = pickle.load(f)

imputer = objs["imputer"]
scaler = objs["scaler"]
label_encoder = objs["label_encoder"]
feature_names = objs["feature_names"] 

# -------------------------------
# Load trained TESS model
# -------------------------------
with open(os.path.join(script_dir, "models", "toi.pkl"), "rb") as f:
    model = pickle.load(f)

def preprocess(df):
    # Check overlap with imputer features
    overlap = [c for c in df.columns if c in imputer.feature_names_in_]
    if len(overlap) < 10:  # Reduced threshold
        return f"Input data does not have enough valid TOI features (found only {len(overlap)}). Required features include: {list(imputer.feature_names_in_)[:10]}"

    # Drop admin columns if present
    admin_cols = ["toi", "tid", "rastr", "decstr", "rowupdate", "toi_created",
                  "tfopwg_disp", "tfopwg_d"]
    df = df.drop(columns=[c for c in admin_cols if c in df.columns], errors="ignore")

    # Numeric columns
    num_cols = df.select_dtypes(include=[np.number]).columns.tolist()

    # Feature engineering (SNR, ratios, absolute magnitude)
    error_pairs = [
        ('pl_orbper', 'pl_orbpererr1'), ('pl_tranmid', 'pl_tranmiderr1'),
        ('pl_trandur', 'pl_trandurerr1'), ('pl_trandep', 'pl_trandeperr1'),
        ('pl_rade', 'pl_radeerr1'), ('st_teff', 'st_tefferr1'),
        ('st_rad', 'st_raderr1'), ('st_logg', 'st_loggerr1')
    ]
    for val_col, err_col in error_pairs:
        if val_col in df.columns and err_col in df.columns:
            new_col = f'{val_col}_snr'
            df[new_col] = df[val_col] / (df[err_col] + 1e-10)
            if new_col not in num_cols:
                num_cols.append(new_col)

    if 'pl_rade' in df.columns and 'st_rad' in df.columns:
        df['planet_star_radius_ratio'] = df['pl_rade'] / (df['st_rad'] * 109.2)
        num_cols.append('planet_star_radius_ratio')

    if 'pl_trandep' in df.columns and 'st_tmag' in df.columns:
        df['depth_mag_ratio'] = df['pl_trandep'] * df['st_tmag']
        num_cols.append('depth_mag_ratio')

    if 'st_dist' in df.columns and 'st_tmag' in df.columns:
        df['absolute_mag'] = df['st_tmag'] - 5 * np.log10(df['st_dist'] / 10)
        num_cols.append('absolute_mag')

    # Outlier handling
    num_cols_present = [c for c in num_cols if c in df.columns]
    for col in num_cols_present:
        Q1, Q3 = df[col].quantile(0.01), df[col].quantile(0.99)
        IQR = Q3 - Q1
        df[col] = df[col].clip(lower=Q1 - 3*IQR, upper=Q3 + 3*IQR)

    # Impute missing values
    imputer_features = imputer.feature_names_in_.tolist()
    for col in imputer_features:
        if col not in df.columns:
            df[col] = np.nan
    df_for_imputation = df[imputer_features].replace({pd.NA: np.nan})
    df_imputed = pd.DataFrame(imputer.transform(df_for_imputation),
                              columns=imputer_features,
                              index=df.index)
    for col in imputer_features:
        df[col] = df_imputed[col]

    # Scale features
    scaler_features = scaler.feature_names_in_.tolist()
    for col in scaler_features:
        if col not in df.columns:
            df[col] = 0
    df_for_scaling = df[scaler_features]
    df_scaled = scaler.transform(df_for_scaling)

    # Select TOP-33
    top_33_indices = [scaler_features.index(feat) for feat in feature_names if feat in scaler_features]
    X_top33 = df_scaled[:, top_33_indices]

    return X_top33

def predict(df):
    """Make predictions using TOI model"""
    try:
        # Preprocess data
        processed_data = preprocess(df)
        
        # Check if preprocessing returned an error
        if isinstance(processed_data, str):
            return processed_data
        
        # Make predictions
        predictions = model.predict(processed_data)
        
        # Convert predictions to string labels
        pred_labels = label_encoder.inverse_transform(predictions.astype(int))
        
        return pred_labels
        
    except Exception as e:
        return f"TOI prediction failed: {str(e)}"