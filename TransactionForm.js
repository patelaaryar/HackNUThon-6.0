import React, { useState } from "react";
import axios from "axios";

function TransactionForm() {
  const [transaction, setTransaction] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://127.0.0.1:5000/predict", transaction, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResult(response.data.fraud ? "Fraudulent Transaction" : "Legitimate Transaction");
    } catch (err) {
      setError("Error processing transaction");
    }
  };

  return (
    <div>
      <h2>Enter Transaction Details</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && <p style={{ color: result === "Fraudulent Transaction" ? "red" : "green" }}>{result}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="amount" placeholder="Amount" onChange={handleChange} required />
        <input type="text" name="merchant" placeholder="Merchant" onChange={handleChange} required />
        <input type="text" name="category" placeholder="Category" onChange={handleChange} required />
        <button type="submit">Check Transaction</button>
      </form>
    </div>
  );
}

export default TransactionForm;