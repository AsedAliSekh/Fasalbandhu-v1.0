
import joblib

# Load the trained model
model = joblib.load("crop_recommendation_model.pkl")

print("\n========== MODEL INFORMATION ==========")

print("\nModel Type:")
print(type(model))

print("\nModel Parameters:")
print(model.get_params() if hasattr(model, "get_params") else "Not available")

print("\nFeature Names:")
print(
    model.feature_names_in_
    if hasattr(model, "feature_names_in_")
    else "Not available"
)

print("\nNumber of Features:")
print(
    model.n_features_in_
    if hasattr(model, "n_features_in_")
    else "Not available"
)

print("\nModel Classes:")
print(
    model.classes_
    if hasattr(model, "classes_")
    else "Not available"
)

print("\nSupports Probability Prediction:")
print(hasattr(model, "predict_proba"))

print("\n========== INSPECTION COMPLETE ==========")
