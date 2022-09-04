import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDKxi5ZoyoEGE-3LTyYkaj2kFGLx3rWAho",
  authDomain: "survey-8da9b.firebaseapp.com",
  projectId: "survey-8da9b",
  storageBucket: "survey-8da9b.appspot.com",
  messagingSenderId: "468978684857",
  appId: "1:468978684857:web:6e95a2e27b0d539e8d5c68",
  measurementId: "G-ZW4K6YBRX1",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
