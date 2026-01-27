// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHg0OMfE8jXXAyDyLWnbr2kOgXxCPzyJg",
  authDomain: "pokesonyou-88c9a.firebaseapp.com",
  projectId: "pokesonyou-88c9a",
  storageBucket: "pokesonyou-88c9a.firebasestorage.app",
  messagingSenderId: "368841700177",
  appId: "1:368841700177:web:ae6b3ce527d7d1c68b1970",
  measurementId: "G-0HE0RQBHMQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
