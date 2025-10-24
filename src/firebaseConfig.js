// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const database = getDatabase(app);
