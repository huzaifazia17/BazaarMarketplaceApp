import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase app
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Auth with AsyncStorage persistence
let auth;
try {
  auth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} 
catch (error) {
  // If Firebase Auth is already initialized, use getAuth instead
  if (error.code === 'auth/already-initialized') {
    auth = getAuth(firebaseApp);
  } 
  else {
    throw error;
  }
}

export { auth };
