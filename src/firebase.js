// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlJjzwOJH1ULQz7iEv8GfqvqDkrIzvOlY",
  authDomain: "messenger-test-b2e3b.firebaseapp.com",
  databaseURL: "https://messenger-test-b2e3b.firebaseio.com",
  projectId: "messenger-test-b2e3b",
  storageBucket: "messenger-test-b2e3b.appspot.com",
  messagingSenderId: "751350603663",
  appId: "1:751350603663:web:14b8b76aea033e277bb5fa",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
