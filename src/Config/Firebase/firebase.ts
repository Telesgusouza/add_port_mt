import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCZR9-9lO3p8PHiLlh4TAiVDjtXGe9zs6U",
  authDomain: "portifolio-49f87.firebaseapp.com",
  projectId: "portifolio-49f87",
  storageBucket: "portifolio-49f87.appspot.com",
  messagingSenderId: "60356123650",
  appId: "1:60356123650:web:4b85a4844fefd447855b1b"
};

const firebase = initializeApp(firebaseConfig);
export const db = getFirestore(firebase);
export const storage = getStorage(firebase);