import { auth, provider } from "./firebase.js"; // ✅ Make sure provider is imported
import { signInWithPopup } from "firebase/auth";

const googleLoginBtn = document.getElementById("google-login");

if (googleLoginBtn) {
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
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error("Google Login Error:", error.message);
        alert("Google Login Failed. Try again.");
      });
  });
} else {
  console.error("Google login button not found in the DOM");
}
