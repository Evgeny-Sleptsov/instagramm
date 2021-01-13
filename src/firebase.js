import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBGVTdHnAKditjRgwGD9uq7mFZuLwHRY9g",
    authDomain: "insta-fc13b.firebaseapp.com",
    databaseURL: "https://insta-fc13b-default-rtdb.firebaseio.com",
    projectId: "insta-fc13b",
    storageBucket: "insta-fc13b.appspot.com",
    messagingSenderId: "627063125979",
    appId: "1:627063125979:web:f47dbceff33c78532659fe",
    measurementId: "G-XDLP4T5YQ8"
})

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();


export {db, auth, storage};