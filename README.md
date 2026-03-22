# 🌱 Project Teera
AI-powered Cinnamon Disease Identification & Spreading Location Prediction Application

## 📖 Description
Project Teera is a mobile application designed to help cinnamon farmers detect plant diseases using AI. The system uses a Convolutional Neural Network (CNN) to analyze uploaded images and provide accurate disease identification along with treatment recommendations.
It also includes a geospatial alert system to notify nearby farmers about disease outbreaks.

## 🛠️ Tech Stack

### 👨‍💻 Frontend(Mobile App)
- React Native
- Typescript
- Expo

### ⚙️ Backend

#### 🧩 Core Framework
- Flask (Python)
- Flask-CORS

#### 🤖 Machine Learning
- TensorFlow (CNN model)
- NumPy (data processing)
- Pillow (PIL) (image handling)

#### ☁️ Database & Authentication
- Firebase Admin SDK
- Firestore (NoSQL database)
- Firebase Authentication
  
#### 📡 API & Communication
- Postman (API)
- Requests
  
#### 📍 Utilities & System
- OS
- Datetime (time handling)
- Treading (backend tasks)
  
#### 🤖 Notification /  Alerts
- Firebase (SMS / communication services)

## 💻 Installation

### Clone this repository:
   
```bash
git clone https://github.com/your-username/your-repo-name.git
```

### 📱 Setting Up React Native Environment
Follow these steps to set up React Native on your system.

#### 🔧 Prerequisites
Make sure you have installed:

- Node.js (LTS version)
- npm or yarn
- Git

#### ⚙️ Install Expo CLI

```bash
npm install -g expo-cli
```

# Teera Backend

This is the Flask-based backend for the Teera application, providing APIs for user authentication, community posts, plant disease analysis, and notifications.

## 🚀 Features

- **User Authentication**: Secure signup and signin using Firebase Auth.
- **Disease Analysis**: ML-powered plant disease detection using TensorFlow/MobileNetV2.
- **Community Feed**: Post management with image uploads and Firestore integration.
- **Real-time Notifications**: Disease alerts and task reminders via Firebase Cloud Messaging (FCM).
- **Chatbot**: Intelligent plant care assistance.

---

## 🛠️ Setup & Installation

### 1. Prerequisites

- **Python 3.8+** installed on your system.
- **Firebase Project**:
  - `firebase_config.json`: Download your service account key from Firebase Console and place it in this directory.
  - **Web API Key**: Ensure the `FIREBASE_WEB_API_KEY` in `app.py` matches your project's Web API Key.
- **ML Model**: Ensure the model weights are located at `cinnamon_disease_model.keras/model.weights.h5`.

