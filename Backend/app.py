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
from firebase_admin import credentials, firestore, auth, messaging
from datetime import datetime, timedelta, timezone
from twilio.rest import Client
import uuid

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

# Firebase Web API Key (Used for Sign-In with Password)
# You can find this in Firebase Console -> Project Settings -> General -> Web API Key
FIREBASE_WEB_API_KEY = 'AIzaSyD8xyi4veuUY9HWBU0ty1oCnvz7X9buYdc'

# --- ROUTES ---

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    phone = data.get('phone_number')
    full_name = data.get('full_name')
    password = data.get('password')

    # 1. Check if phone exists
    existing_user = db.collection('users').where('phone_number', '==', phone).limit(1).get()
    if len(existing_user) > 0:
        return jsonify({"message": f"You have already signed up with {phone}."}), 400

    # 2. Sign up to Firebase Auth via REST API to get idToken
    signup_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={FIREBASE_WEB_API_KEY}"
    req = requests.post(signup_url, json={"email": email, "password": password, "returnSecureToken": True})
    
    if req.status_code != 200:
        error_msg = req.json().get('error', {}).get('message', 'Signup failed')
        return jsonify({"error": error_msg}), 400
        
    resp_data = req.json()
    uid = resp_data['localId']
    id_token = resp_data['idToken']
    
    # 3. Trigger Firebase Email Verification
    verify_url = f"https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key={FIREBASE_WEB_API_KEY}"
    verify_req = requests.post(verify_url, json={"requestType": "VERIFY_EMAIL", "idToken": id_token})
    if verify_req.status_code != 200:
        return jsonify({"error": "Failed to send verification email"}), 500

    # 4. Create permanent user document in Firestore immediately
    db.collection('users').document(uid).set({
        "full_name": full_name,
        "email": email,
        "phone_number": phone,
        "preferences": {"mood": "Light", "language": "English"},
        "joined_at": firestore.SERVER_TIMESTAMP
    })
    
    return jsonify({"message": "Verification email sent. Please check your inbox before signing in."}), 200

@app.route('/api/posts', methods=['GET', 'POST'])
def manage_posts():
    if request.method == 'POST':
        try:
            # Handle post text, image, and form data
            uid = request.form.get('uid')
            post_text = request.form.get('postText', '')
            
            if not uid:
                return jsonify({"error": "User UID is required"}), 400

            # 1. Image upload handling
            image_url = None
            if 'image' in request.files:
                file = request.files['image']
                if file.filename != '':
                    filename = f"{uuid.uuid4().hex}_{file.filename}"
                    file.save(os.path.join(UPLOAD_FOLDER, filename))
                    image_url = f"{request.host_url}uploads/{filename}"
            # 2. Fetch User Details for Post
            user_doc = db.collection('users').document(uid).get()
            user_data = user_doc.to_dict() if user_doc.exists else {}
            
            user_name = user_data.get('full_name', 'Unknown User')
            user_handle = f"@{user_name.replace(' ', '').lower()}"
            user_img = user_data.get('profile_photo', 'https://i.pravatar.cc/150')

            # 3. Create Post Document
            post_ref = db.collection('posts').document()
            post_data = {
                "id": post_ref.id,
                "user_uid": uid,
                "userName": user_name,
                "userHandle": user_handle,
                "userImg": user_img,
                "postText": post_text,
                "postImg": image_url,
                "likes": 0,
                "comments": 0,
                "created_at": firestore.SERVER_TIMESTAMP,
                "isVerified": False
            }
            # Save to database (accepts the Sentinel)
            post_ref.set(post_data)

            # Make response serializable by temporarily removing or converting the Sentinel
            response_data = post_data.copy()
            response_data['created_at'] = datetime.now(timezone.utc).isoformat()
            
            return jsonify({"message": "Post created successfully", "post": response_data}), 201

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    elif request.method == 'GET':
        try:
            # Fetch the most recent 50 posts
            posts_query = db.collection('posts').order_by('created_at', direction=firestore.Query.DESCENDING).limit(50)
            posts = []
            for doc in posts_query.stream():
                data = doc.to_dict()
                
                # Format timestamps for JSON response
                if 'created_at' in data and data['created_at']:
                    # Firestore SERVER_TIMESTAMP is sometimes not evaluated to an object right away, wait,
                    # when we read it back it's a DatetimeWithNanoseconds
                    try:
                        data['created_at'] = data['created_at'].isoformat()
                    except AttributeError:
                        data['created_at'] = str(data['created_at'])
                else:
                    data['created_at'] = ""

                # Compute time ago roughly
                # For simplicity, we can pass the timestamp correctly to frontend and let fontend handle it 
                # or just hardcode passing ISO string, currently formatting it as ISO string.
                # However, the frontend currently expects `time: '2h'` etc. Let's just create a quick formatter.
                data['time'] = "Recently"
                if data.get('created_at'):
                    try:
                        dt = datetime.fromisoformat(data['created_at'])
                        now = datetime.now(timezone.utc)
                        diff = now - dt
                        if diff.days > 0:
                            data['time'] = f"{diff.days}d"
                        elif diff.seconds >= 3600:
                            data['time'] = f"{diff.seconds // 3600}h"
                        elif diff.seconds >= 60:
                            data['time'] = f"{diff.seconds // 60}m"
                        else:
                            data['time'] = "Just now"
                    except:
                        pass
                
                posts.append(data)
                
            return jsonify(posts), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500
                
@app.route('/api/profile/<uid>', methods=['GET', 'POST'])
def handle_profile(uid):
    user_ref = db.collection('users').document(uid)
    if request.method == 'GET':
        doc = user_ref.get()
        return jsonify(doc.to_dict()) if doc.exists else (jsonify({"error": "User not found"}), 404)

    if request.method == 'POST':
        data = request.json
        update_fields = {}
        
        # 1. Update Name
        if 'full_name' in data:
            update_fields['full_name'] = data['full_name']
            
        # 2. Update Phone Number
        if 'phone_number' in data:
            update_fields['phone_number'] = data['phone_number']
            
        # 3. Update Profile Photo (stores as URL or Base64 string)
        if 'profile_photo' in data:
            update_fields['profile_photo'] = data['profile_photo']
        
        # 4. Profile Preferences
        if 'mood' in data:
            update_fields['preferences.mood'] = data['mood']
        if 'language' in data:
            update_fields['preferences.language'] = data['language']
            
        # 5. Location Name (e.g. "Kandy", "Colombo")
        if 'location_name' in data:
            update_fields['location_name'] = data['location_name']
            
        # 6. FCM Token for Push Notifications
        if 'fcm_token' in data:
            update_fields['fcm_token'] = data['fcm_token']
            
        # 6. Update Email Address (Requires Auth Update)
        if 'email' in data:
            new_email = data['email']
            try:
                # Update Firebase Authentication email
                auth.update_user(uid, email=new_email)
                update_fields['email'] = new_email
            except Exception as e:
                return jsonify({"error": f"Failed to update Auth email: {str(e)}"}), 400

        if not update_fields:
            return jsonify({"error": "No fields to update"}), 400
            
        try:
            user_ref.update(update_fields)
            return jsonify({"message": "Profile updated successfully"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

@app.route('/api/signin', methods=['POST'])
def signin():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Call Firebase Identity Toolkit REST API to verify password
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_WEB_API_KEY}"
    payload = {
        "email": email,
        "password": password,
        "returnSecureToken": True
    }
    
    try:
        req = requests.post(url, json=payload)
        resp_data = req.json()
        
        if req.status_code == 200:
            uid = resp_data.get('localId')
            
            # Check if email is verified
            user_record = auth.get_user(uid)
            if not user_record.email_verified:
                return jsonify({"error": "Please verify your email before signing in."}), 403
                
            id_token = resp_data.get('idToken')
            return jsonify({
                "message": "Signed in successfully",
                "uid": uid,
                "idToken": id_token
            }), 200
        else:
            error_message = resp_data.get('error', {}).get('message', 'Unknown Error')
            return jsonify({"error": error_message}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/analyze', methods=['POST'])
def analyze_leaf():
    if not disease_model:
        return jsonify({"error": "ML model is not loaded on the server."}), 500

    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # 1. Read the image
        img_bytes = file.read()
        img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
        
        # 2. Resize to 224x224 (required by MobileNetV2)
        img = img.resize((224, 224))
        
        # 3. Convert to numpy array and preprocess
        img_array = np.array(img)
        # MobileNetV2 uses preprocess_input which maps 0-255 to -1 to 1
        img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
        
        # Add batch dimension
        img_batch = np.expand_dims(img_array, axis=0)
        
        # 4. Predict
        predictions = disease_model.predict(img_batch, verbose=0)
        
        # The output is [1, 2] probability array
        confidence_scores = predictions[0]
        predicted_class_idx = int(np.argmax(confidence_scores))
        confidence_percentage = float(np.max(confidence_scores)) * 100
        
        # 5. Map to UI format
        # Index 0 = Healthy, Index 1 = Rough Bark Disease
        if predicted_class_idx == 0:
            result = {
                "diagnosis": "Healthy",
                "confidence": f"{int(confidence_percentage)}%",
                "severity": "None",
                "description": "The leaf appears healthy with no visible signs of disease."
            }
        else:
            result = {
                "diagnosis": "Rough Bark Disease",
                "confidence": f"{int(confidence_percentage)}%",
                "severity": "Medium",
                "description": "Early symptoms of bark cracking or infection observed. Recommended to isolate the plant and treat accordingly."
            }
            
            # Extract location and uploader info from form data
            loc_name = request.form.get('location_name')
            uploader_uid = request.form.get('uid')
            
            # If we have a location name, trigger alerts to others in the same area
            if loc_name:
                loc_name_lower = loc_name.strip().lower()
                
                users_ref = db.collection('users')
                all_users = users_ref.stream()
                
                batch = db.batch()
                notifications_created = 0
                
                for user_doc in all_users:
                    if user_doc.id == uploader_uid:
                        continue # Don't alert the person who just uploaded it
                        
                    user_data = user_doc.to_dict()
                    user_loc = user_data.get('location_name')
                    
                    if user_loc and user_loc.strip().lower() == loc_name_lower:
                        # Create a notification in Firestore
                        notif_ref = db.collection('notifications').document()
                        batch.set(notif_ref, {
                            "user_uid": user_doc.id,
                            "type": "disease_alert",
                            "title": "Disease Alert in Your Area",
                            "message": f"Rough Bark Disease was detected in {user_loc}. Please check your plants.",
                            "location_name": user_loc,
                            "created_at": firestore.SERVER_TIMESTAMP,
                            "read": False
                        })
                        
                        # Trigger FCM Push Notification
                        fcm_token = user_data.get('fcm_token')
                        if fcm_token:
                            try:
                                message = messaging.Message(
                                    notification=messaging.Notification(
                                        title="Disease Alert in Your Area",
                                        body=f"Rough Bark Disease was detected in {user_loc}. Please check your plants."
                                    ),
                                    token=fcm_token,
                                )
                                messaging.send(message)
                            except Exception as e:
                                print(f"Failed to send FCM to {user_doc.id}: {e}")
                                
                        notifications_created += 1
                
                if notifications_created > 0:
                    batch.commit()

            
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
