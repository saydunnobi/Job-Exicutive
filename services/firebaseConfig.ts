// FIX: Switched to Firebase v8-style/compat imports to resolve module errors.
// FIX: Use v8 compat imports to resolve errors with firebase.apps and firebase.app().
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';


// --- IMPORTANT ---
// Replace this with your web app's Firebase project configuration.
// You can find this in the Firebase console:
// Project settings > General > Your apps > Firebase SDK snippet > Config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
// FIX: Check if Firebase is already initialized to prevent errors in hot-reloading environments.
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

// Export Firebase services using v8-style syntax
export const auth = app.auth();
export const db = app.firestore();
export const storage = app.storage();
