import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/style.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Import the functions you need from the SDKs you need 
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACIzCo5fb76Ngp3CekvDYh8Pbse_CFn4g",
  authDomain: "all-abroad-a981b.firebaseapp.com",
  projectId: "all-abroad-a981b",
  storageBucket: "all-abroad-a981b.firebasestorage.app",
  messagingSenderId: "575035162924",
  appId: "1:575035162924:web:9b8fc07657261f2929ec89",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);


