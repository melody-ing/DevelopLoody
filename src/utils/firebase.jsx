// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8yiMuX2g8mMWuKI1H4NaHOof5pO5YfYM",
  authDomain: "loody-ing.firebaseapp.com",
  databaseURL: "https://loody-ing-default-rtdb.firebaseio.com",
  projectId: "loody-ing",
  storageBucket: "loody-ing.appspot.com",
  messagingSenderId: "862682833648",
  appId: "1:862682833648:web:ac397e7c95af8640555835",
  measurementId: "G-41LSZ5MVZW",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const database = getDatabase();
