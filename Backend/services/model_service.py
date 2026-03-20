import numpy as np
from PIL import Image
import tensorflow as tf

#Load the model
model = tf.keras.models.load_model("model/cinnamon_disease_model.keras")

class_names = ['RoughBark','StripCanker']

def predict_disease(image):
    try:
        image = Image.open(image).convert("RGB")

        image.resize((224,224))

        image_array = np.array(image) / 255.0

        image_array = np.expand_dims(image_array, axis=0)

        prediction = model.predict(image)

        predicted_index = int(np.argmax(prediction))
        confidence_score = float(np.max(prediction))

        disease = class_names[predicted_index]

        return {
            "Disease": disease,
            "Confidence": round(confidence_score, 2)
        }
    
    except Exception as error:
        return {
            "Error": str(error)
        }