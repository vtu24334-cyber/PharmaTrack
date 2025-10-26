// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmjtgbh3p-HzTEGO8hWUoe1QLHmO-TMRk",
  authDomain: "pharmatrack-lite-mrggn.firebaseapp.com",
  databaseURL: "https://pharmatrack-lite-mrggn-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pharmatrack-lite-mrggn",
  storageBucket: "pharmatrack-lite-mrggn.firebasestorage.app",
  messagingSenderId: "358127785398",
  appId: "1:358127785398:web:cfce2479d9db09e41a1d17"
};

// Initialize Firebase (prevent re-initialization)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps();

// Initialize Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);
