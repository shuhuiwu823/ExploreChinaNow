// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "explorechinanow-4b024.firebaseapp.com",
  projectId: "explorechinanow-4b024",
  storageBucket: "explorechinanow-4b024.firebasestorage.app",
  messagingSenderId: "520817361107",
  appId: "1:520817361107:web:4e7085aa686f5c2c5dd426"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();