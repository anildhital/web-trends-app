import { auth, provider } from "./firebase.js"; // ✅ Make sure provider is exported
import { signInWithPopup, signOut } from "firebase/auth";

// Ensure document is fully loaded before running
document.addEventListener("DOMContentLoaded", () => {
  const googleLoginBtn = document.getElementById("google-login");
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", () => {
      signInWithPopup(auth, provider)
        .then((result) => {
          console.log("User logged in:", result.user);
          window.location.href = "index.html"; // Redirect to homepage
        })
        .catch((error) => {
          console.error("Login failed:", error);
        });
    });
  }

  const logoutBtn = document.getElementById("signOutBttn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      signOut(auth)
        .then(() => {
          console.log("User logged out");
          window.location.href = "login.html";
        })
        .catch((error) => {
          console.error("Logout failed:", error);
        });
    });
  }
});
