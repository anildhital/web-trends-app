import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // ✅ Import GoogleAuthProvider

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
const db = getFirestore(app);
const auth = getAuth(app); // ✅ Pass `app` to `getAuth`
const provider = new GoogleAuthProvider(); // ✅ Add GoogleAuthProvider

export { db, auth, provider }; // ✅ Export `provider`
