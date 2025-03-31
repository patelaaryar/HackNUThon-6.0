import React, { useState } from "react";

function App() {
    const [transaction, setTransaction] = useState({
        amount: "",
        type: "",
        location: "",
    });
    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        setTransaction({ ...transaction, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transaction),
        });
        const data = await response.json();
        setResult(data.prediction);
    };

    return (
        <div>
            <h1>Fraud Detection System</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="amount" placeholder="Amount" onChange={handleChange} />
                <input type="text" name="type" placeholder="Transaction Type" onChange={handleChange} />
                <input type="text" name="location" placeholder="Location" onChange={handleChange} />
                <button onClick={handleSubmit}>Check Fraud</button> 
            </form>
            {result !== null && <h2>Prediction: {result ? "Fraudulent" : "Legit"}</h2>}
        </div>
    );
}

const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent page reload
    console.log("Check Fraud button clicked!");  // Check if function is triggered

    const transactionData = {
        amount,
        transactionType,
        location
    };

    console.log("Sending data to backend:", transactionData);  // Log data being sent

    try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transactionData),
        });

        console.log("Response received:", response);  // Log response

        const result = await response.json();
        alert(result.prediction);
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to check fraud. See console.");
    }
};

export default App;
