import { auth } from "./firebase.js";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();
const googleLoginBtn = document.getElementById("google-login");
const biometricLoginBtn = document.getElementById("biometric-login");

// Google Sign-In Function
googleLoginBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: result.user.email,
          name: result.user.displayName,
        })
      );
      window.location.href = "index.html"; // ✅ Redirect to homepage
    })
    .catch((error) => {
      console.error("Google Login Error:", error.message);
      alert("Google Login Failed. Try again.");
    });
});

// Biometric Authentication Function (Optional)
biometricLoginBtn.addEventListener("click", async () => {
  alert("Biometric Authentication is not yet implemented.");
});
