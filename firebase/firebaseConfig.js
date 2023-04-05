// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSv48dkcN6Qv1GKabw6qE5tv8jM2HYFEc",
  authDomain: "geniai.firebaseapp.com",
  projectId: "geniai",
  storageBucket: "geniai.appspot.com",
  messagingSenderId: "1082223040039",
  appId: "1:1082223040039:web:20098c5ad81fffe5a42002",
  measurementId: "G-SZTXS2WHEZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);