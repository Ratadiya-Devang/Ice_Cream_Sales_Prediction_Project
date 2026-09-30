import { useState } from "react";
import "./App.css";

function App() {
  const [temperature, setTemperature] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTemperatureChange = (event) => {
    const value = event.target.value;

    // માત્ર number અને decimal allow
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setTemperature(value);
      setError("");
    } else {
      setError("Please enter numbers only.");
    }
  };

  const predictSales = async () => {
    setError("");
    setPrediction(null);

    if (temperature === "") {
      setError("Please enter temperature.");
      return;
    }

    const temperatureNumber = Number(temperature);

    if (Number.isNaN(temperatureNumber)) {
      setError("Please enter a valid number.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          temprature: temperatureNumber,
        }),
      });

      if (!response.ok) {
        throw new Error("Prediction request failed");
      }

      const data = await response.json();

      setPrediction(data.predict);
    } catch (error) {
      setError("Unable to connect with prediction server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <div className="icon">🍦</div>

        <h1>Ice Cream Sales Predictor</h1>

        <p className="subtitle">
          Predict ice cream sales using temperature
        </p>

        <div className="input-group">
          <label htmlFor="temperature">Temperature</label>

          <div className="input-wrapper">
            <input
              id="temperature"
              type="text"
              value={temperature}
              onChange={handleTemperatureChange}
              placeholder="Enter temperature"
            />

            <span>°C</span>
          </div>
        </div>

        {error && (
          <div className="error-box">
            ⚠️ {error}
          </div>
        )}

        <button onClick={predictSales} disabled={loading}>
          {loading ? "Predicting..." : "Predict Sales"}
        </button>

        {prediction !== null && (
          <div className="result-box">
            <p>Predicted Ice Cream Sales</p>

            <h2>{prediction.toFixed(2)}</h2>

            <span>units</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;