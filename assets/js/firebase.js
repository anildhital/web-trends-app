import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpAjzrbDn4GuAoGwAZsSoxOJHGVen6TtM",
  authDomain: "web-trends-2d408.firebaseapp.com",
  projectId: "web-trends-2d408",
  storageBucket: "web-trends-2d408.firebasestorage.app",
  messagingSenderId: "164881251778",
  appId: "1:164881251778:web:e914a7f7fb88b44dbb6a5b",
  measurementId: "G-92VND4XB35",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); // ✅ Ensure app is passed to getAuth()
export const provider = new GoogleAuthProvider(); // ✅ Add and export provider
