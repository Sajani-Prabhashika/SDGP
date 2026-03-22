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

# --- BACKGROUND REMINDER TASK ---
def check_and_send_reminders():
    # This thread wakes up every hour to see if any reminders are scheduled for today
    while True:
        try:
            today_str = datetime.now(timezone.utc).strftime('%Y-%m-%d')
            users_stream = db.collection('users').stream()
            
            for user_doc in users_stream:
                user_data = user_doc.to_dict()
                user_ref = user_doc.reference
                
                # Fetch only un-notified reminders for this user
                reminders_query = user_ref.collection('reminders').where('notified', '==', False).stream()
                
                for doc in reminders_query:
                    rem_data = doc.to_dict()
                    
                    if rem_data.get('date') == today_str:
                        fcm_token = user_data.get('fcm_token')
                        
                        if fcm_token:
                            try:
                                message = messaging.Message(
                                    notification=messaging.Notification(
                                        title=f"Reminder: {rem_data.get('name')}",
                                        body=rem_data.get('description', 'You have a scheduled task for today.')
                                    ),
                                    token=fcm_token,
                                )
                                messaging.send(message)
                            except Exception as e:
                                print(f"Firebase Messaging Error for {user_doc.id}: {e}")
                                
                        # Mark as notified whether they have a token or not, so we don't retry forever
                        doc.reference.update({"notified": True})
                        
        except Exception as e:
            print(f"Reminder background task error: {e}")
            
        # Run checks every 1 hour (3600 seconds)
        time.sleep(3600)

reminder_thread = threading.Thread(target=check_and_send_reminders, daemon=True)
reminder_thread.start()
