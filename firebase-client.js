import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCeuizWkJRvp2_iOxD4UOFL12Os2k0KybQ",
  authDomain: "living-india-7f73b.firebaseapp.com",
  projectId: "living-india-7f73b",
  storageBucket: "living-india-7f73b.firebasestorage.app",
  messagingSenderId: "439601825953",
  appId: "1:439601825953:web:cc38c29d819b86de03c8e0",
  measurementId: "G-N76WYJXS7K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
