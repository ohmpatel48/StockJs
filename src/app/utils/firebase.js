// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";  // Import getAuth
import { getFirestore } from "firebase/firestore";  // Import getFirestore

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBA3KJe4HJtZlieM9DVd829HdUupdjHpPU",
  authDomain: "scoketjs.firebaseapp.com",
  projectId: "scoketjs",
  storageBucket: "scoketjs.appspot.com",
  messagingSenderId: "492396241843",
  appId: "1:492396241843:web:a823e8c713d3a147c9a1c6",
  measurementId: "G-S9477Z3Y1Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
