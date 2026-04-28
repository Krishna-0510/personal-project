import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBm7uyjl4F5T1m4J4gcw3oU4NcSDBX9L90",
  authDomain: "krishna-kirana-503fe.firebaseapp.com",
  projectId: "krishna-kirana-503fe",
  storageBucket: "krishna-kirana-503fe.firebasestorage.app",
  messagingSenderId: "893899473039",
  appId: "1:893899473039:web:23efaec88d81e9218730fa"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);