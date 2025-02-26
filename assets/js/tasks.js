import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { GoogleGenerativeAI } from "@google/generative-ai"; // 🔹 Import AI

// References to HTML elements
const bookForm = document.getElementById("book-form");
const bookList = document.getElementById("books");
const signOutButton = document.getElementById("signOutBttn");

// AI Chatbot Elements
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-btn");
const chatHistory = document.getElementById("chat-history");

// ✅ AI API Setup
const API_KEY = "AIzaSyAMP1E9AObYzGRx4OK3n_NgkEEoCqEsK0M"; // 🔹 Replace with your Gemini AI API Key
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Ensure user is authenticated
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html"; // Redirect if not logged in
  }
});

// Function to Render Books from Firestore
async function renderBooks() {
  bookList.innerHTML = ""; // Clear existing books

  const querySnapshot = await getDocs(collection(db, "books"));
  querySnapshot.forEach((doc) => {
    let bookData = doc.data();
    createBookElement(doc.id, bookData.title, bookData.author, bookData.genre);
  });
}

// Function to Create Book Element in the List
function createBookElement(id, title, author, genre) {
  let li = document.createElement("li");
  li.dataset.id = id;

  // Book details container
  let bookDetails = document.createElement("div");
  bookDetails.classList.add("book-details");

  // Title
  let titleElement = document.createElement("p");
  titleElement.textContent = `📖 ${title}`;
  titleElement.classList.add("book-title");

  // Author
  let authorElement = document.createElement("p");
  authorElement.textContent = `✍️ ${author}`;

  // Genre
  let genreElement = document.createElement("p");
  genreElement.textContent = `📚 ${genre}`;

  // Edit Button
  let editButton = document.createElement("button");
  editButton.textContent = "✏️ Edit";
  editButton.classList.add("edit");
  editButton.addEventListener("click", () =>
    editBook(li, id, title, author, genre)
  );

  // Delete Button
  let deleteButton = document.createElement("button");
  deleteButton.textContent = "🗑 Delete";
  deleteButton.classList.add("delete");
  deleteButton.addEventListener("click", () => deleteBook(id));

  // Append elements
  bookDetails.appendChild(titleElement);
  bookDetails.appendChild(authorElement);
  bookDetails.appendChild(genreElement);
  li.appendChild(bookDetails);
  li.appendChild(editButton);
  li.appendChild(deleteButton);
  bookList.appendChild(li);
}

// Function to Add a New Book
bookForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let title = document.getElementById("title").value;
  let author = document.getElementById("author").value;
  let genre = document.getElementById("genre").value;

  let docRef = await addDoc(collection(db, "books"), {
    title,
    author,
    genre,
  });

  createBookElement(docRef.id, title, author, genre);

  bookForm.reset(); // Clear form after submission
});

// Function to Delete a Book
async function deleteBook(id) {
  await deleteDoc(doc(db, "books", id));
  document.querySelector(`[data-id='${id}']`).remove();
}

// Function to Edit a Book
function editBook(li, id, oldTitle, oldAuthor, oldGenre) {
  li.innerHTML = `
        <input type="text" class="edit-title" value="${oldTitle}">
        <input type="text" class="edit-author" value="${oldAuthor}">
        <input type="text" class="edit-genre" value="${oldGenre}">
        <button class="save">💾 Save</button>
        <button class="cancel">❌ Cancel</button>
    `;

  // Get new input fields
  let newTitleInput = li.querySelector(".edit-title");
  let newAuthorInput = li.querySelector(".edit-author");
  let newGenreInput = li.querySelector(".edit-genre");

  // Save Button Functionality
  li.querySelector(".save").addEventListener("click", async () => {
    let newTitle = newTitleInput.value;
    let newAuthor = newAuthorInput.value;
    let newGenre = newGenreInput.value;

    await updateDoc(doc(db, "books", id), {
      title: newTitle,
      author: newAuthor,
      genre: newGenre,
    });

    createBookElement(id, newTitle, newAuthor, newGenre);
    li.remove();
  });

  // Cancel Button Functionality
  li.querySelector(".cancel").addEventListener("click", () => {
    createBookElement(id, oldTitle, oldAuthor, oldGenre);
    li.remove();
  });
}

// ✅ AI Chatbot Functionality
async function askChatBot(prompt) {
  if (!prompt) {
    appendMessage("Please enter a question.");
    return;
  }

  appendMessage(`🧑‍💻 You: ${prompt}`, "user");

  try {
    let result = await model.generateContent(prompt);
    let responseText = result.response.text();

    appendMessage(`🤖 AI: ${responseText}`, "bot");
  } catch (error) {
    console.error("AI Chatbot Error:", error);
    appendMessage("❌ Error: Unable to get a response. Try again.");
  }

  chatInput.value = ""; // Clear input
}

// ✅ Append AI Responses to Chat History
function appendMessage(message, sender = "bot") {
  let msgDiv = document.createElement("div");
  msgDiv.textContent = message;
  msgDiv.className = sender === "user" ? "user-message" : "bot-message";
  chatHistory.appendChild(msgDiv);
  chatHistory.scrollTop = chatHistory.scrollHeight; // Auto-scroll
}

// ✅ Event Listeners for AI Chatbot
sendButton.addEventListener("click", () => {
  let prompt = chatInput.value.trim();
  askChatBot(prompt);
});

// Allow Enter Key to Send Message
chatInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    sendButton.click();
  }
});

// ✅ Sign Out Function
signOutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      localStorage.removeItem("user");
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Sign Out Error", error);
    });
});

// ✅ Load books when the page loads
window.addEventListener("DOMContentLoaded", renderBooks);
