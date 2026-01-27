// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWhr-s1oftsLoqgv3tytCFJZEnWhI5Yy4",
  authDomain: "pokes-on-you-website-36e50.firebaseapp.com",
  projectId: "pokes-on-you-website-36e50",
  storageBucket: "pokes-on-you-website-36e50.firebasestorage.app",
  messagingSenderId: "322362363466",
  appId: "1:322362363466:web:bafd4918482e83273ee0b3",
  measurementId: "G-06K44T5Y4Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
