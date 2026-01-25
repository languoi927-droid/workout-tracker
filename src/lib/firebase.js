// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measuremenworkoutService.jstId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8KlmbRaaRbQp0VikqjwnpaYiQfZMiPKs",
  authDomain: "test-19ebc.firebaseapp.com",
  databaseURL: "https://test-19ebc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test-19ebc",
  storageBucket: "test-19ebc.firebasestorage.app",
  messagingSenderId: "287361038928",
  appId: "1:287361038928:web:c7e337905a389955996f55",
  measurementId: "G-DTM7VVHTWV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);