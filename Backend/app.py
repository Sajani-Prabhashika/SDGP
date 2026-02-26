from flask import Flask, jsonify
from flask_cors import CORS
from routes.prediction import prediction_bp

#Setup the Flask app (Backend)
def init_app():
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(prediction_bp, url_pregix = "/api/prediction")

    @app.route("/", methods=['GET'])
    def backend_check():
        return jsonify({
            "Teera Backend is running."
        })
    
    return app

if __name__ == "__main__":
    app = init_app()
    app.run(debug=True) 