from flask import Flask, jsonify
from flask_cors import CORS
from routes.prediction import prediction_bp

#Setup the Flask app (Backend)


# 1. Initialize Firebase with 'firebase_config.json' files
cred = credentials.Certificate("firebase_config.json")

try:
    firebase_admin.initialize_app(cred, {
        'storageBucket': 'terrasdgp.firebasestorage.app' # Your Project ID
    })
    db = firestore.client()
    bucket = storage.bucket()
    print("--- Firebase Firestore & Storage Connected Successfully ---")
except Exception as e:
    print(f"--- Firebase Connection Warning: {e} ---")
    db = firestore.client()
    bucket = None