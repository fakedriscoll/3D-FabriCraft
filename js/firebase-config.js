// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAm6FeFATB0DvTRTlC_Whn6dQos8rgdQAw",
  authDomain: "d-fabricraft.firebaseapp.com",
  projectId: "d-fabricraft",
  storageBucket: "d-fabricraft.firebasestorage.app",
  messagingSenderId: "87846643724",
  appId: "1:87846643724:web:0d5dc369e0a4f3d3a92629"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Export auth instance to be used in other scripts
export { auth };

