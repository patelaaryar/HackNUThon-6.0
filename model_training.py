import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Load dataset
data = pd.read_csv("bank_transactions_data_2 - Copy.csv")

# Assuming the last column is the target (fraud or not)
X = data.iloc[:, :-1]  # Features
y = data.iloc[:, -1]    # Target

# Convert target to binary if continuous
y = (y >= 0.5).astype(int)  # Assuming fraud scores range from 0 to 1

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate model
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"Model Accuracy: {accuracy * 100:.2f}%")

# Save model
joblib.dump(model, "../backend/fraud_model.pkl")
print("Model saved as fraud_model.pkl")
