import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDugwxnnGWkYTjfHwgGLfBG3pDQlx8-RmE",
    authDomain: "clones-3871f.firebaseapp.com",
    databaseURL: "https://clones-3871f.firebaseio.com",
    projectId: "clones-3871f",
    storageBucket: "clones-3871f.appspot.com",
    messagingSenderId: "130401264592",
    appId: "1:130401264592:web:fe2a1f09a4988d56118fd5",
    measurementId: "G-MYYW4PTHZQ"
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export { db, auth, storage };