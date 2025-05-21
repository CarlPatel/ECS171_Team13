from fastapi import FastAPI
from pydantic import BaseModel
from typing import Literal
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Your React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from predict_models import predict_rf, predict_log_reg, predict_nn

# Input schema
class IncomeInput(BaseModel):
    age: int
    capital_gain: int
    capital_loss: int
    hours_per_week: int
    education_num: int
    workclass: str
    marital_status: str
    occupation: str
    relationship: str
    sex: Literal["Male", "Female"]

@app.post("/predict/rf")
def predict_with_rf(input: IncomeInput):
    prediction = predict_rf(input.dict())
    return {"model": "Random Forest", "prediction": prediction}

@app.post("/predict/log-reg")
def predict_with_log_reg(input: IncomeInput):
    prediction = predict_log_reg(input.dict())
    return {"model": "Logistic Regression", "prediction": prediction}

@app.post("/predict/nn")
def predict_with_nn(input: IncomeInput):
    prediction = predict_nn(input.dict())
    return {"model": "Neural Network", "prediction": prediction}