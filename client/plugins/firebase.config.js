// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyASSXx0p8WN8rttjd4VfDI7ClvaBRy8iKk",
    authDomain: "findeachother-8755a.firebaseapp.com",
    projectId: "findeachother-8755a",
    storageBucket: "findeachother-8755a.firebasestorage.app",
    messagingSenderId: "390266477936",
    appId: "1:390266477936:web:11c22b621afa849199c3b5",
    measurementId: "G-XKB0NYWQ3F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);