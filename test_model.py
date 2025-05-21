import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import classification_report, accuracy_score

# Step 1: Load and clean data
from ucimlrepo import fetch_ucirepo
adult = fetch_ucirepo(id=2)
df = pd.concat([adult.data.features, adult.data.targets], axis=1)

df['income'] = df['income'].str.strip().str.replace('.', '', regex=False)
df.replace('?', np.nan, inplace=True)
df.dropna(inplace=True)

# Step 2: Split features and target
selected_features = [
    'age', 'capital-gain', 'capital-loss', 'hours-per-week', 'education-num',
    'workclass', 'marital-status', 'occupation', 'relationship', 'sex'
]
X = df[selected_features]
y = df['income']

# Step 3: Separate numeric and categorical columns
num_cols = X.select_dtypes(include=['int64', 'float64']).columns.tolist()
cat_cols = X.select_dtypes(include=['object']).columns.tolist()

# Step 4: Preprocess numeric columns
scaler = StandardScaler()
X_num = scaler.fit_transform(X[num_cols])

# Step 5: Preprocess categorical columns
encoder = OneHotEncoder(drop='first', handle_unknown='ignore', sparse_output=False)
X_cat = encoder.fit_transform(X[cat_cols])

# Step 6: Combine numeric and categorical data
X_processed = np.hstack((X_num, X_cat))

# Step 7: Train-test split
X_train, X_test, y_train, y_test = train_test_split(X_processed, y, test_size=0.2, stratify=y, random_state=42)

# Step 8: Train neural network (multi-layer perceptron)
mlp = MLPClassifier(hidden_layer_sizes=(64, 32),  # two hidden layers
                    activation='relu',
                    solver='adam',
                    max_iter=300,
                    random_state=42)

mlp.fit(X_train, y_train)

# Step 9: Evaluate
y_pred = mlp.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))