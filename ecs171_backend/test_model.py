import joblib
import numpy as np
from predict_models import predict_rf, predict_log_reg, predict_nn
from itertools import product

def test_model(model_name, predict_func, test_input):
    try:
        result = predict_func(test_input)
        print(f"\n{model_name} Test Results:")
        print(f"Input: {test_input}")
        print(f"Predicted income chance: {result}")
        return True
    except Exception as e:
        print(f"\n{model_name} Test Failed:")
        print(f"Error: {str(e)}")
        return False

# Define all possible categorical values
workclass_options = [
    "Federal-gov",
    "Local-gov",
    "Private",
    "Self-emp-inc",
    "Self-emp-not-inc",
    "State-gov",
    "Without-pay"
]

marital_status_options = [
    "Divorced",
    "Married-AF-spouse",
    "Married-civ-spouse",
    "Married-spouse-absent",
    "Never-married",
    "Separated",
    "Widowed"
]

occupation_options = [
    "Adm-clerical",
    "Armed-Forces",
    "Craft-repair",
    "Exec-managerial",
    "Farming-fishing",
    "Handlers-cleaners",
    "Machine-op-inspct",
    "Other-service",
    "Priv-house-serv",
    "Prof-specialty",
    "Protective-serv",
    "Sales",
    "Tech-support",
    "Transport-moving"
]

relationship_options = [
    "Husband",
    "Not-in-family",
    "Other-relative",
    "Own-child",
    "Unmarried",
    "Wife"
]

sex_options = ["Female", "Male"]

# Define numeric ranges to test
age_range = [18, 30, 45, 60, 75]
capital_gain_range = [0, 1000, 5000, 10000, 50000]
capital_loss_range = [0, 1000, 2000]
hours_per_week_range = [20, 30, 40, 50, 60]
education_num_range = [1, 6, 9, 12, 14, 16]

def run_comprehensive_tests():
    print("Running comprehensive tests for all models...")
    
    # Test 1: Edge cases for numeric values
    print("\n=== Test 1: Edge Cases for Numeric Values ===")
    edge_cases = [
        {
            "age": age,
            "capital_gain": gain,
            "capital_loss": loss,
            "hours_per_week": hours,
            "education_num": edu,
            "workclass": "Private",
            "marital_status": "Married-civ-spouse",
            "occupation": "Exec-managerial",
            "relationship": "Husband",
            "sex": "Male"
        }
        for age in age_range
        for gain in capital_gain_range
        for loss in capital_loss_range
        for hours in hours_per_week_range
        for edu in education_num_range
    ]
    
    # Test first 5 edge cases to avoid too much output
    for i, test_case in enumerate(edge_cases[:5]):
        print(f"\nEdge Case {i+1}:")
        test_model("Random Forest", predict_rf, test_case)
        test_model("Logistic Regression", predict_log_reg, test_case)
        test_model("Neural Network", predict_nn, test_case)

    # Test 2: All categorical combinations
    print("\n=== Test 2: Categorical Combinations ===")
    # Create a sample of categorical combinations to test
    categorical_combinations = list(product(
        workclass_options[:2],  # Test first 2 workclasses
        marital_status_options[:2],  # Test first 2 marital statuses
        occupation_options[:2],  # Test first 2 occupations
        relationship_options[:2],  # Test first 2 relationships
        sex_options
    ))
    
    # Test first 5 categorical combinations
    for i, (workclass, marital_status, occupation, relationship, sex) in enumerate(categorical_combinations[:5]):
        test_case = {
            "age": 45,
            "capital_gain": 5000,
            "capital_loss": 0,
            "hours_per_week": 40,
            "education_num": 12,
            "workclass": workclass,
            "marital_status": marital_status,
            "occupation": occupation,
            "relationship": relationship,
            "sex": sex
        }
        print(f"\nCategorical Combination {i+1}:")
        test_model("Random Forest", predict_rf, test_case)
        test_model("Logistic Regression", predict_log_reg, test_case)
        test_model("Neural Network", predict_nn, test_case)

    # Test 3: Real-world scenarios
    print("\n=== Test 3: Real-world Scenarios ===")
    real_world_cases = [
        {
            "name": "Young Professional",
            "data": {
                "age": 28,
                "capital_gain": 5000,
                "capital_loss": 0,
                "hours_per_week": 45,
                "education_num": 16,
                "workclass": "Private",
                "marital_status": "Never-married",
                "occupation": "Prof-specialty",
                "relationship": "Not-in-family",
                "sex": "Male"
            }
        },
        {
            "name": "Senior Executive",
            "data": {
                "age": 55,
                "capital_gain": 50000,
                "capital_loss": 2000,
                "hours_per_week": 50,
                "education_num": 16,
                "workclass": "Private",
                "marital_status": "Married-civ-spouse",
                "occupation": "Exec-managerial",
                "relationship": "Husband",
                "sex": "Male"
            }
        },
        {
            "name": "Part-time Worker",
            "data": {
                "age": 35,
                "capital_gain": 0,
                "capital_loss": 0,
                "hours_per_week": 20,
                "education_num": 9,
                "workclass": "Private",
                "marital_status": "Divorced",
                "occupation": "Other-service",
                "relationship": "Not-in-family",
                "sex": "Female"
            }
        }
    ]

    for case in real_world_cases:
        print(f"\n{case['name']}:")
        test_model("Random Forest", predict_rf, case['data'])
        test_model("Logistic Regression", predict_log_reg, case['data'])
        test_model("Neural Network", predict_nn, case['data'])

if __name__ == "__main__":
    run_comprehensive_tests() 