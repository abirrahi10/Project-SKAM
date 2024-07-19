// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_v2zLSjOUw4gvu9jUC68SCnt1qDUJoW0",
  authDomain: "skam-f6a92.firebaseapp.com",
  projectId: "skam-f6a92",
  storageBucket: "skam-f6a92.appspot.com",
  messagingSenderId: "210378295432",
  appId: "1:210378295432:web:9cd570b4b90c5a39b6f73d",
  measurementId: "G-FHSTJH4CWT"
};

// COMMENTED OUT AUTH CODE BECAUSE IT GAVE ERRORS AND COULDN'T OPEN APP

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const db = getFirestore(app)


// export { db, auth }

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestoreok
const db = getFirestore(app);

export { db, auth };