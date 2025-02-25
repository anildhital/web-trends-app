import { auth } from "./firebase.js";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();
const googleLoginBtn = document.getElementById("google-login");
const biometricLoginBtn = document.getElementById("biometric-login");
const errorMessage = document.getElementById("login-error");

// Register Service Worker (For PWA support)
const serviceWorkerUrl = new URL("service-worker.js", import.meta.url);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register(serviceWorkerUrl.href, { scope: "/" })
    .then(() => console.log("Service Worker Registered Successfully"))
    .catch((err) => console.error("Service Worker Registration Failed:", err));
}

// Google Sign-In Function
function signIn() {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      localStorage.setItem(
        "user",
        JSON.stringify({ email: user.email, name: user.displayName })
      );
      window.location.href = "main.html"; // Redirect to homepage
    })
    .catch((error) => {
      console.error("Google Login Error:", error.message);
      errorMessage.style.display = "block";
      errorMessage.innerText = "Google Login Failed. Try again.";
    });
}

// Biometric Authentication Function
async function biometricSignIn() {
  try {
    if (!window.PublicKeyCredential) {
      alert("Biometric authentication not supported in this browser.");
      return;
    }

    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: new Uint8Array(32),
        rp: { name: "Book Blog" },
        user: {
          id: new Uint8Array(32),
          name: "biometric_user",
          displayName: "Biometric User",
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        authenticatorSelection: { userVerification: "required" },
        timeout: 60000,
      },
    });

    if (credential) {
      console.log("Biometric Authentication Successful");
      localStorage.setItem("user", JSON.stringify({ name: "Biometric User" }));
      window.location.href = "main.html"; // Redirect to homepage
    }
  } catch (error) {
    console.error("Biometric Login Error:", error);
    errorMessage.style.display = "block";
    errorMessage.innerText = "Biometric Login Failed. Try again.";
  }
}

// Attach Event Listeners to Buttons
googleLoginBtn.addEventListener("click", signIn);
biometricLoginBtn.addEventListener("click", biometricSignIn);
