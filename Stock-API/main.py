# main.py
# Fully optimized FastAPI application for high-performance stock trading signal prediction.

# --- Import Necessary Libraries ---
import logging
import os
import pickle
from typing import Dict, Any

import pandas as pd
import uvicorn
from fastapi import FastAPI, HTTPException, Depends
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel, Field

# --- Logging Configuration ---
# Use Python's logging module for production-grade, configurable logging.
# This is superior to print() statements.
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


# --- Application Setup ---
# Initialize the FastAPI app with enhanced metadata for API documentation.
app = FastAPI(
    title="High-Performance Stock Trading Signal API",
    description="A production-ready API to predict stock trading signals (Buy/Sell/Hold) using various machine learning models with non-blocking, asynchronous processing.",
    version="3.0.0",
)


# --- Constants & Configuration ---
# Centralizing configuration makes the application cleaner and easier to manage.
# In a real-world scenario, consider loading these from environment variables.
MODEL_DIR = "models"
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")
MODEL_PATHS = {
    "rf": os.path.join(MODEL_DIR, "random_forest_model.pkl"),
    "lr": os.path.join(MODEL_DIR, "logistic_regression_model.pkl"),
    "knn": os.path.join(MODEL_DIR, "knearest_neighbor_model.pkl"),
    "dt": os.path.join(MODEL_DIR, "decision_tree_model.pkl"),
    "nb": os.path.join(MODEL_DIR, "naive_bayes_model.pkl"),
}
SIGNAL_MAP = {-1: "Sell", 0: "Hold", 1: "Buy"}
FEATURE_ORDER = ['rsi', 'Close', 'macd', 'macd_signal', 'sma_20', 'ema_20']


# --- Global Storage for Models & Scaler ---
# A dictionary to hold the loaded models and a variable for the scaler.
# These are populated at startup to avoid file I/O on every request.
models: Dict[str, Any] = {}
scaler: Any = None


# --- Pydantic Models for Data Validation ---
# Defines strict data schemas for both requests and responses.
# This improves API clarity, provides great editor support, and powers automatic documentation.

class StockData(BaseModel):
    rsi: float = Field(..., description="Relative Strength Index.")
    close: float = Field(..., description="Closing price of the stock.", alias="Close")
    macd: float = Field(..., description="Moving Average Convergence Divergence.")
    macd_signal: float = Field(..., description="MACD signal line.")
    sma_20: float = Field(..., description="20-day Simple Moving Average.")
    ema_20: float = Field(..., description="20-day Exponential Moving Average.")

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "Close": 150.75, "rsi": 55.2, "macd": 1.25,
                "macd_signal": 1.10, "sma_20": 148.50, "ema_20": 149.00,
            }
        }

class PredictionResponse(BaseModel):
    model_used: str = Field(..., description="The key of the model used for the prediction.")
    prediction_numeric: int = Field(..., description="The raw numeric prediction (-1, 0, or 1).")
    prediction_label: str = Field(..., description="The human-readable trading signal (Sell, Hold, Buy).")


# --- Application Startup Logic ---
@app.on_event("startup")
def load_resources():
    """
    Loads the scaler and all ML models into memory when the application starts.
    This is an efficient pattern that makes prediction requests much faster.
    """
    global models, scaler
    logger.info("Application startup: Loading machine learning resources...")

    if not os.path.isdir(MODEL_DIR):
        error_msg = f"Model directory '{MODEL_DIR}' not found. Shutting down."
        logger.critical(error_msg)
        raise RuntimeError(error_msg)

    try:
        with open(SCALER_PATH, "rb") as f:
            scaler = pickle.load(f)
        logger.info(f"✅ Scaler loaded successfully from {SCALER_PATH}")
    except FileNotFoundError:
        logger.error(f"⚠️ Scaler not found at {SCALER_PATH}. Prediction endpoints will be unavailable.")
    except Exception as e:
        logger.error(f"❌ Failed to load scaler: {e}")

    for key, path in MODEL_PATHS.items():
        try:
            with open(path, "rb") as f:
                models[key] = pickle.load(f)
            logger.info(f"✅ Model '{key}' loaded successfully from {path}")
        except FileNotFoundError:
            logger.warning(f"⚠️ Model '{key}' not found at {path}. It will not be available.")
        except Exception as e:
            logger.error(f"❌ Failed to load model '{key}': {e}")
    logger.info("✅ All resources loaded. Application is ready.")


# --- Dependency for Model Retrieval ---
# Using FastAPI's dependency injection system to get the requested model.
# This makes the endpoint logic cleaner and more focused.
def get_model(model_key: str):
    """Dependency to retrieve a loaded model by its key."""
    if scaler is None:
        raise HTTPException(status_code=503, detail="Scaler is not available. Service is not ready.")
    
    model = models.get(model_key)
    if model is None:
        raise HTTPException(status_code=404, detail=f"Model '{model_key}' not found or failed to load.")
    return model


# --- API Endpoints ---
# Endpoints are now fully asynchronous.

@app.get("/", summary="Root Endpoint", tags=["General"])
async def read_root():
    """Returns a welcome message and a link to the API documentation."""
    return {"message": "Welcome! See the API documentation at /docs"}


@app.get("/models", summary="List Available Models", tags=["Models"])
async def get_available_models():
    """Returns a list of all successfully loaded models ready for prediction."""
    return {"available_models": sorted(list(models.keys()))}


@app.post("/predict/{model_key}", response_model=PredictionResponse, summary="Get Trading Signal", tags=["Predictions"])
async def predict_signal(
    *,
    model_key: str,
    data: StockData,
    model: Any = Depends(get_model)
):
    """
    Main prediction endpoint. It accepts stock data and returns a trading signal.

    This endpoint is fully asynchronous. The CPU-bound machine learning operations
    are run in a separate thread pool, preventing them from blocking the server
    and allowing for high concurrency.
    """
    try:
        input_df = pd.DataFrame([data.dict(by_alias=True)], columns=FEATURE_ORDER)

        # OPTIMIZATION: Run blocking, CPU-bound code in a thread pool.
        # This keeps the main async event loop free to handle other requests.
        input_scaled = await run_in_threadpool(scaler.transform, input_df)
        prediction_numeric = await run_in_threadpool(model.predict, input_scaled)
        
        prediction_int = int(prediction_numeric[0])
        prediction_label = SIGNAL_MAP.get(prediction_int, "Unknown")

        return PredictionResponse(
            model_used=model_key,
            prediction_numeric=prediction_int,
            prediction_label=prediction_label,
        )
    except Exception as e:
        logger.error(f"Prediction failed for model '{model_key}': {e}")
        raise HTTPException(status_code=500, detail=f"An internal error occurred during prediction.")


# --- Main Entry Point for Running the Server ---
if __name__ == "__main__":
    # This allows running the server directly with `python main.py`.
    # For production, it's recommended to use a process manager like Gunicorn.
    # Example: gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
    logger.info("Starting Uvicorn server in development mode...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True, # Set reload=False in production
        log_level="info",
    )
