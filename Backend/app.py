import json
import requests
import os
import firebase_admin
from firebase_admin import credentials, firestore, auth
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timezone

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # suppress TensorFlow logs

# --- FIREBASE INITIALIZATION ---
cred = credentials.Certificate("firebase_config.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)
CORS(app)

# --- REGISTER ML BLUEPRINT (safe: won't crash server if TF fails) ---
try:
    from routes.prediction import prediction_bp
    app.register_blueprint(prediction_bp, url_prefix="/api/analyze")
    print("Prediction blueprint registered at /api/analyze")
except Exception as e:
    print(f"WARNING: Could not register prediction blueprint: {e}")


# ===========================================================
# HEALTH CHECK — test this first: GET http://<ip>:5000/api/health
# ===========================================================

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "Teera backend is running!"}), 200


# ===========================================================
# AUTH ROUTES
# ===========================================================

@app.route('/api/signup', methods=['POST'])
def signup():
    """Create a new user in Firebase Auth and store profile in Firestore."""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('full_name', '')
        phone_number = data.get('phone_number', '')

        if not email or not password:
            return jsonify({"error": "Email and password are required."}), 400

        # Create user in Firebase Auth
        user = auth.create_user(
            email=email,
            password=password,
            display_name=full_name
        )

        # Store additional profile info in Firestore
        db.collection('users').document(user.uid).set({
            'uid': user.uid,
            'email': email,
            'full_name': full_name,
            'phone_number': phone_number,
            'created_at': datetime.now(timezone.utc).isoformat()
        })

        return jsonify({"message": "User created successfully.", "uid": user.uid}), 201

    except auth.EmailAlreadyExistsError:
        return jsonify({"error": "An account with this email already exists."}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/signin', methods=['POST'])
def signin():
    """
    Sign in a user by verifying their credentials via Firebase REST API.
    Returns the user's UID on success.
    """
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Email and password are required."}), 400

        # Use Firebase Auth REST API to verify password
        api_key = get_firebase_api_key()
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={api_key}"
        payload = {"email": email, "password": password, "returnSecureToken": True}
        res = requests.post(url, json=payload)
        res_data = res.json()

        if res.status_code != 200:
            error_msg = res_data.get("error", {}).get("message", "Invalid credentials.")
            return jsonify({"error": error_msg}), 401

        uid = res_data.get("localId")
        return jsonify({"message": "Sign in successful.", "uid": uid}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_firebase_api_key():
    """Read the Firebase API key from firebase_config.json."""
    import json
    with open("firebase_config.json", "r") as f:
        config = json.load(f)
    # The web API key is usually stored separately; fall back to env var
    return os.environ.get("FIREBASE_WEB_API_KEY", config.get("web_api_key", ""))


# ===========================================================
# PROFILE ROUTES
# ===========================================================

@app.route('/api/profile/<uid>', methods=['GET'])
def get_profile(uid):
    """Fetch a user's profile from Firestore."""
    try:
        doc = db.collection('users').document(uid).get()
        if doc.exists:
            return jsonify(doc.to_dict()), 200
        else:
            return jsonify({"error": "User not found."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/profile/<uid>', methods=['POST'])
def update_profile(uid):
    """Update a user's profile fields in Firestore."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided."}), 400

        # Only allow updating safe fields
        allowed = {'full_name', 'phone_number', 'email', 'language', 'mood', 'profile_photo'}
        update_data = {k: v for k, v in data.items() if k in allowed}

        if not update_data:
            return jsonify({"error": "No valid fields to update."}), 400

        db.collection('users').document(uid).set(update_data, merge=True)
        return jsonify({"message": "Profile updated successfully."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ===========================================================
# NOTIFICATIONS ROUTE
# ===========================================================

@app.route('/api/notifications/<uid>', methods=['GET'])
def get_notifications(uid):
    """Fetch notifications for a user from Firestore."""
    try:
        notifs_ref = db.collection('notifications') \
                       .where('uid', '==', uid) \
                       .order_by('created_at', direction=firestore.Query.DESCENDING) \
                       .limit(50)
        docs = notifs_ref.stream()
        result = []
        for doc in docs:
            d = doc.to_dict()
            d['id'] = doc.id
            result.append(d)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ===========================================================
# REMINDERS ROUTES
# ===========================================================

@app.route('/api/reminders', methods=['POST'])
def add_reminder():
    """Save a new reminder to Firestore."""
    try:
        data = request.get_json()
        uid = data.get('uid')
        reminder_name = data.get('reminder_name', '').strip()
        description = data.get('description', '').strip()
        date = data.get('date', '').strip()

        if not uid or not reminder_name or not date:
            return jsonify({"error": "uid, reminder_name, and date are required."}), 400

        doc_ref = db.collection('reminders').document()
        doc_ref.set({
            'uid': uid,
            'name': reminder_name,
            'description': description,
            'date': date,
            'created_at': datetime.now(timezone.utc).isoformat()
        })

        return jsonify({"message": "Reminder saved.", "id": doc_ref.id}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/get-reminders/<uid>', methods=['GET'])
def get_reminders(uid):
    """Fetch all reminders for a user from Firestore."""
    try:
        docs = db.collection('reminders') \
                 .where('uid', '==', uid) \
                 .order_by('date') \
                 .stream()
        result = []
        for doc in docs:
            d = doc.to_dict()
            d['id'] = doc.id
            result.append(d)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ===========================================================
# CHAT / AI ROUTE
# ===========================================================

@app.route('/api/chat', methods=['POST'])
def chat():
    """
    AI chat endpoint. Tries to use Gemini API if configured,
    otherwise returns a helpful fallback response about plants.
    """
    try:
        data = request.get_json()
        message = data.get('message', '').strip()

        if not message:
            return jsonify({"error": "Message is required."}), 400

        gemini_key = os.environ.get("GEMINI_API_KEY", "")
        if gemini_key:
            # Use Google Gemini API
            gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={gemini_key}"
            payload = {
                "contents": [{
                    "parts": [{
                        "text": f"You are Teera, a plant care assistant specializing in cinnamon plants and Sri Lankan agriculture. Answer helpfully and concisely.\n\nUser: {message}"
                    }]
                }]
            }
            res = requests.post(gemini_url, json=payload, timeout=15)
            if res.status_code == 200:
                res_data = res.json()
                reply = res_data['candidates'][0]['content']['parts'][0]['text']
                return jsonify({"reply": reply}), 200

        # Fallback: simple rule-based plant care responses
        reply = get_fallback_reply(message)
        return jsonify({"reply": reply}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_fallback_reply(message: str) -> str:
    """Simple keyword-based fallback plant care replies."""
    msg = message.lower()
    if any(w in msg for w in ['water', 'watering', 'irrigat']):
        return "Cinnamon plants need moderate watering. Water when the top inch of soil is dry. Avoid waterlogging as it can cause root rot."
    elif any(w in msg for w in ['disease', 'sick', 'leaf', 'spot', 'yellow']):
        return "Common cinnamon diseases include Rough Bark and Strip Canker. Use the Scan feature to identify the disease from a photo for more accurate advice."
    elif any(w in msg for w in ['fertiliz', 'nutrient', 'feed']):
        return "Apply a balanced NPK fertilizer (10-10-10) every 3 months during the growing season. Organic compost is also highly recommended."
    elif any(w in msg for w in ['prune', 'trim', 'cut']):
        return "Prune cinnamon plants at the start of the growing season to encourage bushy growth. Remove dead or diseased branches promptly."
    elif any(w in msg for w in ['harvest', 'bark', 'peel']):
        return "Cinnamon bark is harvested from stems that are 2-3 years old. Harvest during the rainy season when the bark peels more easily."
    elif any(w in msg for w in ['hello', 'hi', 'ayubowan', 'help']):
        return "Ayubowan! I'm Teera, your plant care assistant 🌿 Ask me anything about cinnamon plants — watering, diseases, fertilizing, or harvesting!"
    else:
        return "That's a great question! For the best advice on your cinnamon plants, please describe the issue in more detail or use the Scan feature to analyze a photo of your plant."


# ===========================================================
# MAIN
# ===========================================================

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
