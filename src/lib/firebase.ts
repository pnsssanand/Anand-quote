
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBjJM3FqarG5AFSVemE_tzzJT49YPiGsnE",
  authDomain: "anand-quote-generator.firebaseapp.com",
  projectId: "anand-quote-generator",
  storageBucket: "anand-quote-generator.firebasestorage.app",
  messagingSenderId: "971311866834",
  appId: "1:971311866834:web:6872a0a8745d4a2d175e0b",
  measurementId: "G-MWX1VSW7QT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
