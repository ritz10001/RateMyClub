// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEwMFPsY9xPqTKnLUjX0_2pNaK_53HtbM",
  authDomain: "ratemycollegeclub-1747f.firebaseapp.com",
  projectId: "ratemycollegeclub-1747f",
  storageBucket: "ratemycollegeclub-1747f.firebasestorage.app",
  messagingSenderId: "840578680385",
  appId: "1:840578680385:web:bd5738c56b0f8e9cf4a8c0",
  measurementId: "G-ZMXXQFDELY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
export { app, auth };
