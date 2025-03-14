// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "metaguard-1d987.firebaseapp.com",
  projectId: "metaguard-1d987",
  storageBucket: "metaguard-1d987.firebasestorage.app",
  messagingSenderId: "630910415457",
  appId: "1:630910415457:web:5c2c3a42f5a61ec3c63020"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);