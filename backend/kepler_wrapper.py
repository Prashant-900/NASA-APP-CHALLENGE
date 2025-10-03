import pandas as pd
import numpy as np
import pickle
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
models_dir = os.path.join(script_dir, "models")

# Load preprocessing objects
with open(os.path.join(models_dir, "kepler_preprocess.pkl"), "rb") as f:
    preprocess_objs = pickle.load(f)

# Load trained model
with open(os.path.join(models_dir, "kepler.pkl"), "rb") as f:
    model = pickle.load(f)

def preprocess_data(df):
    """Preprocess input data for Kepler model"""
    # Get expected features from preprocessing objects
    if 'feature_names' in preprocess_objs:
        expected_features = preprocess_objs['feature_names']
    else:
        # Fallback to common Kepler features
        expected_features = [
            'koi_score', 'koi_fpflag_nt', 'koi_fpflag_ss', 'koi_fpflag_co', 'koi_fpflag_ec',
            'koi_period', 'koi_period_err1', 'koi_period_err2', 'koi_time0bk_err1', 'koi_time0bk_err2',
            'koi_impact', 'koi_impact_err1', 'koi_impact_err2', 'koi_duration', 'koi_duration_err1',
            'koi_duration_err2', 'koi_depth', 'koi_depth_err1', 'koi_depth_err2', 'koi_prad',
            'koi_prad_err1', 'koi_prad_err2', 'koi_teq', 'koi_insol', 'koi_insol_err1',
            'koi_insol_err2', 'koi_model_snr', 'koi_tce_plnt_num', 'koi_steff', 'koi_steff_err1',
            'koi_steff_err2', 'koi_slogg', 'koi_slogg_err1', 'koi_slogg_err2', 'koi_srad',
            'koi_srad_err1', 'koi_srad_err2', 'koi_kepmag'
        ]
    
    # Keep only overlapping columns
    overlap = [c for c in df.columns if c in expected_features]
    
    if len(overlap) < 5:
        raise ValueError(f"Input data does not have enough valid Kepler features (found only {len(overlap)}).")
    
    # Create DataFrame with expected features
    processed_df = pd.DataFrame()
    for feature in expected_features:
        if feature in df.columns:
            processed_df[feature] = df[feature]
        else:
            processed_df[feature] = np.nan
    
    # Apply preprocessing if available
    if 'imputer' in preprocess_objs:
        processed_df = pd.DataFrame(
            preprocess_objs['imputer'].transform(processed_df),
            columns=processed_df.columns
        )
    
    return processed_df

def predict(df):
    """Make predictions using Kepler model"""
    try:
        # Preprocess data
        processed_df = preprocess_data(df)
        
        # Make predictions
        predictions = model.predict(processed_df)
        
        # Convert predictions to string labels
        if 'label_encoder' in preprocess_objs:
            pred_labels = preprocess_objs['label_encoder'].inverse_transform(predictions.astype(int))
        else:
            # Default mapping for 3 classes
            label_map = {0: 'FALSE POSITIVE', 1: 'CANDIDATE', 2: 'CONFIRMED'}
            pred_labels = [label_map.get(int(p), 'UNKNOWN') for p in predictions]
        
        return pred_labels
        
    except Exception as e:
        raise ValueError(f"Kepler prediction failed: {str(e)}")
