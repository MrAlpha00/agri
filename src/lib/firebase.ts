// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCd0oMhxZNkmBFYdPHcMoHzoQXCjpNmjbw",
    authDomain: "agri-fd7e6.firebaseapp.com",
    projectId: "agri-fd7e6",
    storageBucket: "agri-fd7e6.firebasestorage.app",
    messagingSenderId: "172937703853",
    appId: "1:172937703853:web:a1a10faa3f780d9b01b124",
    measurementId: "G-1V4W6JQ2FF"
};

// Initialize Firebase (checking if it's already initialized to prevent Next.js hot-reload issues)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
