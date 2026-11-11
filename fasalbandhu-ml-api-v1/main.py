import os
try:
    from dotenv import load_dotenv
except ImportError:
    def load_dotenv():
        return False

load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


import joblib
import pandas as pd
import shap
import numpy as np
from pathlib import Path


# ==========================================
# 1. APPLICATION CONFIGURATION
# ==========================================

app = FastAPI(
    title="FasalBandhu ML API",
    description="AI-powered crop recommendation system",
    version="1.0.0"
)


# ==========================================
# 2. CORS CONFIGURATION
# ==========================================

frontend_urls = os.getenv(
    "FRONTEND_URLS",
    "http://localhost:34242"
)

allowed_origins = [
    url.strip()
    for url in frontend_urls.split(",")
    if url.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# ==========================================
# 3. LOAD TRAINED ML MODEL
# ==========================================


# ==========================================
# LOAD TRAINED ML MODEL
# ==========================================

MODEL_PATH = Path(__file__).parent / "crop_recommendation_model.pkl"

try:
    model = joblib.load(MODEL_PATH)

    print("FasalBandhu ML Model Loaded Successfully!")

except Exception as error:
    raise RuntimeError(f"Failed to load ML model: {error}")


# ==========================================
# INITIALIZE SHAP EXPLAINER
# ==========================================

try:
    explainer = shap.TreeExplainer(model)

    print("FasalBandhu SHAP Explainer Initialized Successfully!")

except Exception as error:
    raise RuntimeError(f"Failed to initialize SHAP: {error}")

# ==========================================
# 4. DEFINE INPUT DATA SCHEMA
# ==========================================

class CropInput(BaseModel):

    N: float = Field(allow_inf_nan=False)
    P: float = Field(allow_inf_nan=False)
    K: float = Field(allow_inf_nan=False)

    temperature: float = Field(allow_inf_nan=False)
    humidity: float = Field(allow_inf_nan=False)

    ph: float = Field(allow_inf_nan=False)
    rainfall: float = Field(allow_inf_nan=False)



# ==========================================
# SHAP FEATURE EXPLANATION FUNCTION
# ==========================================

FEATURE_LABELS = {
    "N": "Nitrogen",
    "P": "Phosphorus",
    "K": "Potassium",
    "temperature": "Temperature",
    "humidity": "Humidity",
    "ph": "Soil pH",
    "rainfall": "Rainfall"
}


def generate_shap_explanation(input_data, predicted_crop):

    # Get the predicted crop's class index
    class_index = list(model.classes_).index(predicted_crop)

    # Calculate SHAP values
    shap_values = explainer.shap_values(input_data)

    # Convert output to NumPy array
    shap_values = np.asarray(shap_values)

    # Extract SHAP values for the predicted crop
    # Expected shape: (samples, features, classes)

    if shap_values.ndim == 3:

        crop_shap_values = shap_values[
            0, :, class_index
        ]

    elif shap_values.ndim == 2:

        crop_shap_values = shap_values[0, :]

    else:

        raise ValueError(
            f"Unexpected SHAP output shape: {shap_values.shape}"
        )

    positive_factors = []
    negative_factors = []

    # Process each feature
    for index, feature in enumerate(input_data.columns):

        shap_value = float(crop_shap_values[index])

        feature_data = {
            "feature": feature,
            "label": FEATURE_LABELS.get(feature, feature),
            "input_value": float(input_data.iloc[0][feature]),
            "shap_value": round(shap_value, 6),
            "impact": (
                "positive" if shap_value > 0
                else "negative" if shap_value < 0
                else "neutral"
            )
        }

        if shap_value > 0:
            positive_factors.append(feature_data)

        elif shap_value < 0:
            negative_factors.append(feature_data)

    # Sort factors by absolute SHAP contribution
    positive_factors.sort(
        key=lambda x: abs(x["shap_value"]),
        reverse=True
    )

    negative_factors.sort(
        key=lambda x: abs(x["shap_value"]),
        reverse=True
    )

    return {
        "method": "SHAP TreeExplainer",
        "explained_crop": predicted_crop,
        "positive_factors": positive_factors,
        "negative_factors": negative_factors
    }


# ==========================================
# 5. HOME ROUTE
# ==========================================

@app.get("/")
def home():

    return {
        "success": True,
        "message": "Welcome to FasalBandhu ML API",
        "status": "Running"
    }


# ==========================================
# 6. HEALTH CHECK ROUTE
# ==========================================

@app.get("/health")
def health_check():

    return {
        "success": True,
        "status": "Healthy",
        "model_loaded": model is not None,
        "model_name": "RandomForestClassifier",
        "number_of_features": model.n_features_in_,
        "number_of_classes": len(model.classes_)
    }




# ==========================================
# CROP PREDICTION + XAI API
# ==========================================

@app.post("/predict")
def predict_crop(data: CropInput):

    try:

        # 1. Prepare farmer input
        input_data = pd.DataFrame(
            [[
                data.N,
                data.P,
                data.K,
                data.temperature,
                data.humidity,
                data.ph,
                data.rainfall
            ]],
            columns=[
                "N",
                "P",
                "K",
                "temperature",
                "humidity",
                "ph",
                "rainfall"
            ]
        )

        # 2. Generate crop prediction
        prediction = model.predict(input_data)

        recommended_crop = str(prediction[0])

        # 3. Generate prediction probabilities
        probabilities = model.predict_proba(input_data)[0]

        top_indices = probabilities.argsort()[::-1][:3]

        top_recommendations = []

        for index in top_indices:

            top_recommendations.append({
                "crop": str(model.classes_[index]),
                "probability": round(
                    float(probabilities[index]) * 100,
                    2
                )
            })

        # 4. Generate SHAP explanation
        explanation = generate_shap_explanation(
            input_data,
            recommended_crop
        )

        # 5. Return complete response
        return {
            "success": True,

            "message": "Prediction and XAI analysis successful",

            "recommended_crop": recommended_crop,

            "top_recommendations": top_recommendations,

            "explanation": explanation,

            "input_features": data.model_dump()
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(error)}"
        )


# ==========================================
# GLOBAL FEATURE IMPORTANCE API
# ==========================================

@app.get("/feature-importance")
def get_feature_importance():

    try:

        # Get feature names from trained model
        feature_names = model.feature_names_in_

        # Get Random Forest feature importance
        importance_values = model.feature_importances_

        # Prepare feature importance data
        feature_importance = []

        for name, value in zip(
            feature_names,
            importance_values
        ):

            feature_importance.append({
                "feature": str(name),
                "importance": round(float(value), 6),
                "importance_percent": round(
                    float(value) * 100, 2
                )
            })

        # Sort by importance (highest first)
        feature_importance.sort(
            key=lambda x: x["importance"],
            reverse=True
        )

        return {
            "success": True,
            "method": "Random Forest Feature Importance",
            "feature_importance": feature_importance
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Feature importance calculation failed: {str(error)}"
        )
