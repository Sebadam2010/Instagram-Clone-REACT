import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseApp = initializeApp({
  apiKey: "AIzaSyBU7LHwZ8LIjScejbmCynPhOQdNgIhCFc8",
  authDomain: "instagram-clone-c7372.firebaseapp.com",
  projectId: "instagram-clone-c7372",
  storageBucket: "instagram-clone-c7372.appspot.com",
  messagingSenderId: "242488914550",
  appId: "1:242488914550:web:49dc670dac12c22d88a557",
  measurementId: "G-HGQGY10STY",
});

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

export { db, auth, storage };
