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

# Twilio Credentials (Use your actual SID and Token)
TWILIO_ACCOUNT_SID = 'your_account_sid'
TWILIO_AUTH_TOKEN = 'your_auth_token'
TWILIO_NUMBER = '+1234567890'
client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
