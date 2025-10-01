import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import KNNImputer, IterativeImputer
import catboost
req_col = ["pl_orbper","pl_rade","st_teff","st_rad","st_mass","st_logg","sy_dist","sy_vmag","sy_kmag","sy_gaiamag"]

try:
    model = catboost.CatBoostClassifier().load_model("C:/MYSPACE/CODE/NASA/backend/models/k2.bin")
except FileNotFoundError:
    raise FileNotFoundError("K2 model file not found. Please ensure models/k2.bin exists.")
except Exception as e:
    raise RuntimeError(f"Failed to load K2 model: {str(e)}")

def preprocess(X):
    # 1. Log transform skewed columns
    skewed_cols = ["pl_orbper", "pl_orbsmax", "pl_bmasse", "pl_insol", "pl_rade"]  
    for col in skewed_cols:
        if col in X.columns:
            X[col] = np.log1p(X[col])

    # 2. Median imputation for selected columns (excluding st_mass)
    median_cols = ["pl_orbper", "pl_orbsmax", "pl_bmasse", "pl_insol"]
    for col in median_cols:
        if col in X.columns:
            median_val = X[col].median()
            X[col] = X[col].fillna(median_val)

    # 3. Impute st_mass using IterativeImputer with st_rad and st_teff as predictors
    if "st_mass" in X.columns and "st_rad" in X.columns and "st_teff" in X.columns:
        imputer_mass = IterativeImputer(random_state=42, max_iter=10, initial_strategy="median")
        mass_features = ["st_mass", "st_rad", "st_teff"]
        X[mass_features] = imputer_mass.fit_transform(X[mass_features])

    # 4. KNN imputation for remaining numeric columns
    knn_cols = [col for col in X.columns if col not in median_cols + ["st_mass"]]
    if knn_cols:
        knn_imputer = KNNImputer(n_neighbors=5)
        X[knn_cols] = knn_imputer.fit_transform(X[knn_cols])

    # 5. Standard scaling
    scaler = StandardScaler()
    X = pd.DataFrame(scaler.fit_transform(X), 
                           columns=X.columns, index=X.index)

    return X

def predict(data):
    if not isinstance(data, pd.DataFrame):
        return "Invalid data: Input must be a pandas DataFrame"
    
    try:
        # Check if all required columns are present
        missing_cols = [col for col in req_col if col not in data.columns]
        if missing_cols:
            return f"Invalid data: Missing required columns: {missing_cols}"
        
        if data[req_col].values.shape[1] != len(req_col):
            return "Invalid data: Column count mismatch"
        
        data = preprocess(data[req_col])
        return model.predict(data)
    except KeyError as e:
        return f"Invalid data: Column access error: {str(e)}"
    except Exception as e:
        return f"Prediction error: {str(e)}"