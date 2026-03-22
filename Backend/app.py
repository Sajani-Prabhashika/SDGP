import time
import threading
import random
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import io
import os
import numpy as np
from PIL import Image
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2' # Suppress TF warnings
import tensorflow as tf
import firebase_admin
from firebase_admin import credentials, firestore, auth
from datetime import datetime, timedelta, timezone
from twilio.rest import Client

#--

# --- INITIALIZATION ---
# Make sure "firebase_config.json" is in your backend folder!
cred = credentials.Certificate("firebase_config.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)
CORS(app) 



# --- ML MODEL INITIALIZATION ---
WEIGHTS_PATH = "cinnamon_disease_model.keras/model.weights.h5"
if os.path.exists(WEIGHTS_PATH):
    print("Building ML model architecture & loading weights...")
    try:
        base_model = tf.keras.applications.MobileNetV2(input_shape=(224, 224, 3), include_top=False, weights=None)
        base_model._name = 'mobilenetv2_1.00_224'
        inputs = tf.keras.Input(shape=(224, 224, 3), name='input_layer_1')
        x = base_model(inputs)
        x = tf.keras.layers.GlobalAveragePooling2D(name='global_average_pooling2d')(x)
        x = tf.keras.layers.Dense(128, activation='relu', name='dense')(x)
        x = tf.keras.layers.Dropout(0.2, name='dropout')(x)
        predictions = tf.keras.layers.Dense(2, activation='softmax', name='dense_1')(x)
        disease_model = tf.keras.Model(inputs=inputs, outputs=predictions)
        disease_model.load_weights(WEIGHTS_PATH)
        print("ML model loaded successfully.")
    except Exception as e:
        print(f"FAILED to build/load model: {e}")
        disease_model = None
else:
    print(f"WARNING: Model weights file {WEIGHTS_PATH} not found!")
    disease_model = None

