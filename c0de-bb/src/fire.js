// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCG-IkdGOIjvkGuFhEYM_wSBo1jQQ3Vdlo",
  authDomain: "c0de-bb-react.firebaseapp.com",
  projectId: "c0de-bb-react",
  storageBucket: "c0de-bb-react.appspot.com",
  messagingSenderId: "980052621593",
  appId: "1:980052621593:web:41711a607fbb7904f4ad88"
};

// Initialize Firebase
if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig)
}