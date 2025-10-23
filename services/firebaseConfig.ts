// FIX: Switched to Firebase v8-style/compat imports to resolve module errors.
// FIX: Use v8 compat imports to resolve errors with firebase.apps and firebase.app().
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';


// =================================================================
// !!! CRITICAL SECURITY WARNING !!!
// =================================================================
// DO NOT COMMIT YOUR REAL FIREBASE KEYS TO PUBLIC REPOSITORIES.
// Anyone with these keys can access your entire Firebase project.
//
// 1. Go to your Firebase project console.
// 2. Create a new Web App or use your existing one.
// 3. Find your project's configuration object.
// 4. Copy the values and paste them here.
// 5. For production apps, use environment variables to store these keys securely.
// =================================================================
const firebaseConfig = {
  apiKey: "AIzaSyBs0AqDFl4sofgE1IA0EG_14VUrqddWN88",
  authDomain: "bangladesh-1999.firebaseapp.com",
  projectId:"bangladesh-1999",
  storageBucket: "bangladesh-1999.firebasestorage.app",
  messagingSenderId: "1033154706771",
  appId: "1:1033154706771:web:5f83c53d4b19d6da9775a6",
  measurementId: "G-XS0DR2BRT5"
};

// Initialize Firebase
// FIX: Check if Firebase is already initialized to prevent errors in hot-reloading environments.
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

// Export Firebase services using v8-style syntax
export const auth = app.auth();
export const db = app.firestore();
export const storage = app.storage();
