import { auth, provider } from "./firebase.js";
import { signInWithPopup, signOut } from "firebase/auth";

// Google Login
document.getElementById("google-login").addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("User logged in:", result.user);
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Login failed:", error);
    });
});

// Logout Function
document.addEventListener("DOMContentLoaded", () => {
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
