import joblib
import numpy as np
import pandas as pd

# Load scalers/encoders once
scaler = joblib.load("ecs171_backend/models/scaler.pkl")
encoder = joblib.load("ecs171_backend/models/encoder.pkl")

# Column names
num_cols = ['age', 'capital-gain', 'capital-loss', 'hours-per-week', 'education-num']
cat_cols = ['workclass', 'marital-status', 'occupation', 'relationship', 'sex']


def preprocess_input(data: dict) -> np.ndarray:
    df = pd.DataFrame([{
        'age': data["age"],
        'capital-gain': data["capital_gain"],
        'capital-loss': data["capital_loss"],
        'hours-per-week': data["hours_per_week"],
        'education-num': data["education_num"],
        'workclass': data["workclass"],
        'marital-status': data["marital_status"],
        'occupation': data["occupation"],
        'relationship': data["relationship"],
        'sex': data["sex"]
    }])
    
    sample_num = scaler.transform(df[num_cols])
    sample_cat = encoder.transform(df[cat_cols])
    return np.hstack((sample_num, sample_cat))


def predict_rf(data: dict) -> str:
    model = joblib.load("ecs171_backend/models/rf_model.pkl")
    processed = preprocess_input(data)
    return model.predict(processed)[0]


def predict_log_reg(data: dict) -> str:
    model = joblib.load("ecs171_backend/models/log_reg_model.pkl")
    processed = preprocess_input(data)
    return model.predict(processed)[0]


def predict_nn(data: dict) -> str:
    model = joblib.load("ecs171_backend/models/nn_model.pkl")
    processed = preprocess_input(data)
    return model.predict(processed)[0]