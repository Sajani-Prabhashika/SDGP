import numpy as np
from PIL import Image
import tensorflow as tf

# --- Lazy model loading ---
# The model is only loaded on the FIRST call to predict_disease().
# This prevents the entire Flask server from crashing if the model
# file is missing or TensorFlow has an error at startup.
_model = None

class_names = ['RoughBark', 'StripCanker']


def _get_model():
    """Load the model on first use (lazy loading)."""
    global _model
    if _model is None:
        try:
            _model = tf.keras.models.load_model("model/cinnamon_disease_model.keras")
            print("ML model loaded successfully.")
        except Exception as e:
            print(f"WARNING: Could not load ML model: {e}")
            _model = None
    return _model


def predict_disease(image_file):
    """
    Preprocess an uploaded image file and run inference.

    Args:
        image_file: A file-like object from Flask's request.files.

    Returns:
        dict with 'Disease' (str) and 'Confidence' (float), or 'Error' (str).
    """
    model = _get_model()
    if model is None:
        return {"Error": "ML model is not available on this server."}

    try:
        # Open and convert to RGB (handles RGBA, grayscale, etc.)
        img = Image.open(image_file).convert("RGB")

        # Resize to model input size
        img = img.resize((224, 224))

        # Normalize pixel values to [0, 1]
        image_array = np.array(img) / 255.0

        # Add batch dimension: shape (1, 224, 224, 3)
        image_array = np.expand_dims(image_array, axis=0)

        # Run prediction on the preprocessed numpy array
        prediction = model.predict(image_array)

        predicted_index = int(np.argmax(prediction))
        confidence_score = float(np.max(prediction))

        disease = class_names[predicted_index]

        return {
            "Disease": disease,
            "Confidence": round(confidence_score, 2)
        }

    except Exception as error:
        return {"Error": str(error)}