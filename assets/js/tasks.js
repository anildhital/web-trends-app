import { db, auth } from "./firebase.js";
import {
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const aiButton = document.getElementById("send-btn");
const aiInput = document.getElementById("chat-input");
const chatHistory = document.getElementById("chat-history");

const signOutBttn = document.getElementById("signOutBttn");

var apiKey = "AIzaSyDTqMj9LCMTFxTazXiXZBQHL-ns2z-ohX0";
var genAI = new GoogleGenerativeAI(apiKey);
var model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Ensure user is authenticated before loading tasks
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    renderTasks(user.email);
  }
});

async function askChatBot(request) {
  try {
    let result = await model.generateContent(request);
    appendMessage(result.response.text());
  } catch (error) {
    console.error("Chatbot Error:", error);
    appendMessage(
      "AI Chatbot is currently unavailable. Please try again later."
    );
  }
}

async function addTask(task) {
  let taskId = await addTaskToFirestore(task);
  taskInput.value = "";
  createLiTask(taskId, task);
}

async function removeTask(taskId) {
  await updateDoc(doc(db, "todos", taskId), {
    completed: true,
  });
}

function removeVisualTask(id) {
  document.getElementById(id).remove();
}

async function renderTasks(userEmail) {
  var tasks = await getTasksFromFirestore(userEmail);
  taskList.innerHTML = "";

  let taskArr = [];

  tasks.forEach((task) => {
    taskArr.push({
      id: task.id,
      text: task.data().text,
      completed: task.data().completed,
    });
  });

  taskArr.sort((a, b) => new Date(b.timeCreated) - new Date(a.timeCreated));

  taskArr.forEach((task) => {
    if (!task.completed) {
      createLiTask(task.id, task.text);
    }
  });
}

async function getTasksFromFirestore(userEmail) {
  let q = query(collection(db, "todos"), where("email", "==", userEmail));
  return await getDocs(q);
}

signOutBttn.addEventListener("click", function (event) {
  signOut(auth)
    .then(() => {
      console.log("User logged out");
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Logout failed:", error);
    });
});
