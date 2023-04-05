import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"; // Añade esta línea

// Your web app's Firebase configuration
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
const storage = getStorage(app); // Añade esta línea

export { app, storage }; // Exporta 'app' y 'storage'
