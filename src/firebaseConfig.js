// src/lib/firebase.js or src/lib/firebase.ts

// Import the functions you need from the SDKs
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmjtgbh3p-HzTEGO8hWUoe1QLHmO-TMRk",
  authDomain: "pharmatrack-lite-mrggn.firebaseapp.com",
  databaseURL: "https://pharmatrack-lite-mrggn-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pharmatrack-lite-mrggn",
  storageBucket: "pharmatrack-lite-mrggn.appspot.com", // fixed .app to .appspot.com!
  messagingSenderId: "358127785398",
  appId: "1:358127785398:web:cfce2479d9db09e41a1d17"
};

// Initialize Firebase (only once)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export initialized services
export const auth = getAuth(app);
export const database = getDatabase(app);
export default app;
