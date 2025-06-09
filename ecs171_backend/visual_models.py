from fastapi import Response


import matplotlib
matplotlib.use('Agg')  # Use non-GUI backend

import matplotlib.pyplot as plt

from io import BytesIO
import pandas as pd
import numpy as np

# For the population averages
df_train = pd.read_csv("models/training_data.csv")  # Save this during training

def plot_individual_vs_average(data: dict) -> Response:
    individual = {
        "age": data["age"],
        "capital-gain": data["capital_gain"],
        "capital-loss": data["capital_loss"],
        "hours-per-week": data["hours_per_week"],
        "education-num": data["education_num"]
    }

    # Get population means for numeric columns
    population_avg = df_train[individual.keys()].mean().to_dict()

    labels = list(individual.keys())
    individual_values = [individual[k] for k in labels]
    average_values = [population_avg[k] for k in labels]

    x = np.arange(len(labels))
    width = 0.35

    plt.figure(figsize=(8, 5))
    plt.bar(x - width/2, average_values, width, label="Population Avg", color="gray")
    plt.bar(x + width/2, individual_values, width, label="Individual", color="skyblue")
    plt.xticks(x, labels, rotation=45)
    plt.ylabel("Value")
    plt.title("Individual vs Population Averages")
    plt.legend()
    plt.tight_layout()

    buf = BytesIO()
    plt.savefig(buf, format="png")
    plt.close()
    buf.seek(0)
    return Response(content=buf.read(), media_type="image/png")