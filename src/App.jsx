import { useState } from "react";
import "./App.css";

function App() {
  const [temperature, setTemperature] = useState("");
  const [sales, setSales] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL =
    "https://ice-cream-sales-api.onrender.com/predict";

  const handlePredict = async (e) => {
    e.preventDefault();

    setError("");
    setSales(null);

    if (temperature === "") {
      setError("Please enter a temperature.");
      return;
    }

    const temperatureValue = Number(temperature);

    if (Number.isNaN(temperatureValue)) {
      setError("Please enter a valid number.");
      return;
    }

    if (temperatureValue < 0) {
      setSales(0);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          temperature: temperatureValue,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail || "Prediction request failed."
        );
      }

      setSales(result.sales);
    } catch (error) {
      console.error("Prediction Error:", error);

      setError(
        error.message ||
          "Unable to connect to the prediction server."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTemperature("");
    setSales(null);
    setError("");
  };

  return (
    <div className="app">

      <div className="background-circle circle-one"></div>
      <div className="background-circle circle-two"></div>

      <main className="container">

        <section className="card">

          <div className="header">

            <div className="icon">
              🍦
            </div>

            <div>
              <p className="small-title">
                MACHINE LEARNING
              </p>

              <h1>
                Ice Cream Sales Predictor
              </h1>
            </div>

          </div>

          <p className="description">
            Enter the temperature and our machine learning
            model will predict the expected ice cream sales.
          </p>

          <form onSubmit={handlePredict}>

            <label htmlFor="temperature">
              Temperature
            </label>

            <div className="input-wrapper">

              <input
                id="temperature"
                type="number"
                step="any"
                placeholder="Example: 33"
                value={temperature}
                onChange={(e) =>
                  setTemperature(e.target.value)
                }
              />

              <span>°C</span>

            </div>

            {error && (
              <p className="error">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Predicting..."
                : "Predict Sales"}
            </button>

          </form>

          {sales !== null && (

            <div className="result">

              <p className="result-label">
                PREDICTED ICE CREAM SALES
              </p>

              <div className="result-number">
                {sales}
              </div>

              <p className="result-text">
                Estimated units sold
              </p>

              <div className="result-temperature">
                Temperature:
                <strong>
                  {" "}
                  {temperature}°C
                </strong>
              </div>

            </div>

          )}

          {(sales !== null ||
            temperature !== "") &&
            !loading && (

              <button
                className="reset-button"
                type="button"
                onClick={handleReset}
              >
                Reset Prediction
              </button>

          )}

          <footer>
            Powered by React + FastAPI + Machine Learning
          </footer>

        </section>

      </main>

    </div>
  );
}

export default App;