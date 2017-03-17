importScripts('https://www.gstatic.com/firebasejs/3.7.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.7.2/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId': '448358493027'
});

firebase.messaging();


// Customize notification handler
messaging.setBackgroundMessageHandler(function(payload) {

    return self.registration.showNotification(payload.registration.title, payload.data);
});