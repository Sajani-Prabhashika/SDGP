from flask import Blueprint, request, jsonify
from services.model_service import predict_disease

prediction_bp = Blueprint("prediction", __name__)

#Get the scanned image and giving an output
@prediction_bp.route("/", methods=["POST"])
def predict():
    try:
        if "image" not in request.files:
            return jsonify({"Error" : "No image uploaded."})
        
        image_file = request.files["image"]

        result = predict_disease(image_file)

        return jsonify(result)
    
    except Exception as error:
        return jsonify({"Error" : str(error)})