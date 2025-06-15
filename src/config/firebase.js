// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXPgik5xv81cqzaN2JxLRe8Cw0ZcFnNy8",
  authDomain: "library-management-syste-d71c5.firebaseapp.com",
  projectId: "library-management-syste-d71c5",
  storageBucket: "library-management-syste-d71c5.firebasestorage.app",
  messagingSenderId: "956710199282",
  appId: "1:956710199282:web:11448c7e549dbf1e7a956b",
  measurementId: "G-Q0LXWFD16M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);
