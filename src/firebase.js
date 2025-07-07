// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCfcimzRu5VUZPb2xYgJBvH0wQku7fQ8rM",
  authDomain: "final-auction-6a6b7.firebaseapp.com",
  projectId: "final-auction-6a6b7",
  storageBucket: "final-auction-6a6b7.firebasestorage.app",
  messagingSenderId: "952843603276",
  appId: "1:952843603276:web:d69d97c1a203f29c0bd3e9",
  measurementId: "G-MNGTK94P6J"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Export the db
export { db };