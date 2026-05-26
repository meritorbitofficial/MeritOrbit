import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDRzxs1O35B-geNr2d0nkOulK-uZWQ16DU",
  authDomain: "meritlayer-572bc.firebaseapp.com",
  projectId: "meritlayer-572bc",
  storageBucket: "meritlayer-572bc.firebasestorage.app",
  messagingSenderId: "932486728506",
  appId: "1:932486728506:web:8ee7efb7be35b4fca41e03",
  measurementId: "G-5L9DPF3Z23"
};

const app = initializeApp(firebaseConfig);

// ✅ THIS WAS MISSING
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ THIS LINE MUST EXIST