importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js');

var config = {
    apiKey: "AIzaSyDsgrxryBjQrS38vdxuDk_3RRJtuOGbU1c",
    authDomain: "test-f24b5.firebaseapp.com",
    databaseURL: "https://test-f24b5.firebaseio.com",
    storageBucket: "test-f24b5.appspot.com",
    messagingSenderId: "448358493027"
};
firebase.initializeApp(config);

firebase.messaging();
