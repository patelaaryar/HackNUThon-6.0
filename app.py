from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps

app = Flask(__name__)

# Secret key for JWT authentication
app.config["SECRET_KEY"] = "your_secret_key"

# In-memory storage
users = {}  # Stores users as {username: hashed_password}
transactions = []  # Stores transaction details

# Middleware for authentication
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"message": "Token is missing!"}), 403
        try:
            data = jwt.decode(token.split(" ")[1], app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user = users.get(data["username"])
            if not current_user:
                return jsonify({"message": "User not found!"}), 403
        except:
            return jsonify({"message": "Token is invalid!"}), 403
        return f(data["username"], *args, **kwargs)
    return decorated

@app.route('/')
def home():
    return "Backend is running!"

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    if data["username"] in users:
        return jsonify({"message": "User already exists"}), 400
    hashed_password = generate_password_hash(data["password"], method="sha256")
    users[data["username"]] = hashed_password
    return jsonify({"message": "User registered successfully"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    hashed_password = users.get(data["username"])
    if not hashed_password or not check_password_hash(hashed_password, data["password"]):
        return jsonify({"message": "Invalid credentials"}), 401
    token = jwt.encode({"username": data["username"], "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
                       app.config["SECRET_KEY"], algorithm="HS256")
    return jsonify({"token": token})

@app.route("/predict", methods=["POST"])
@token_required
def predict_transaction(username):
    transaction_data = request.json
    transaction_data["username"] = username
    transaction_data["fraud"] = True if float(transaction_data["amount"]) > 1000 else False
    transactions.append(transaction_data)
    return jsonify({"fraud": transaction_data["fraud"]})

if __name__ == "__main__":
    app.run(debug=True, port=5001)
