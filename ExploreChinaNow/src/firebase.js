// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdMVGhgLrkSm1CeOPhmVXaGGsX-53pBSo",
  authDomain: "explore-china-now.firebaseapp.com",
  databaseURL: "https://explore-china-now-default-rtdb.firebaseio.com",
  projectId: "explore-china-now",
  storageBucket: "explore-china-now.appspot.com",
  messagingSenderId: "774952934410",
  appId: "1:774952934410:web:3c7e8e980fa699fe3893f3",
  measurementId: "G-9VPR86XYS8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export default app;
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);