import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "timepass-ce62c.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "timepass-ce62c",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "timepass-ce62c.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "606659498062",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:606659498062:web:603c81357fe784f619b31f",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-E53KBM5LXL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
