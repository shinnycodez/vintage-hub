// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';



const firebaseConfig = {
 apiKey: "AIzaSyDf7SgaE0xfSIkbl4-T8MDdmo0fStX5GOM",
  authDomain: "e-commerce-9f32f.firebaseapp.com",
  projectId: "e-commerce-9f32f",
  storageBucket: "e-commerce-9f32f.firebasestorage.app",
  messagingSenderId: "291874462803",
  appId: "1:291874462803:web:ef4477d95e7497e82ebaa6",
  measurementId: "G-0029KHGLF4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
export const storage = getStorage(app);

// ✅ Export the db
export { db };