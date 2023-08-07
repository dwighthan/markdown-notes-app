// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeghH_rH6dftMIVXLNNnpiRZlu0HFJGk0",
  authDomain: "react-notes-f354a.firebaseapp.com",
  projectId: "react-notes-f354a",
  storageBucket: "react-notes-f354a.appspot.com",
  messagingSenderId: "215302870160",
  appId: "1:215302870160:web:f5b3aa4df023c2632e7415"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")