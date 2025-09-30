import numpy as np
import pandas as pd

def predict(data):
    """
    Placeholder prediction function for CUM model
    Returns random predictions for demonstration
    """
    if not isinstance(data, pd.DataFrame):
        return "Invalid data"
    
    # Generate random predictions (0 or 1) for each row
    predictions = np.random.choice([0, 1], size=len(data), p=[0.8, 0.2])
    return predictions