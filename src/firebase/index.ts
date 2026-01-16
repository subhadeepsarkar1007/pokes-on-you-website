// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFPpuWwMsw3gzsBpxjpwmO7sscEv88xAw",
  authDomain: "pokes-on-you-website.firebaseapp.com",
  projectId: "pokes-on-you-website",
  storageBucket: "pokes-on-you-website.firebasestorage.app",
  messagingSenderId: "522172597703",
  appId: "1:522172597703:web:fdf3a3d0021270a88d45e2",
  measurementId: "G-Y2LQ22D5GQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
