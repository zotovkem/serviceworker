firebase.initializeApp({
    messagingSenderId: '448358493027'
});


var bt_register = $('#register');
var bt_delete = $('#delete').hide();
var token = $('#token');
var form = $('#notification').hide();

if (window.location.protocol === 'https:' && 'Notification' in window && 'serviceWorker' in navigator && 'localStorage' in window && 'fetch' in window) {
    var messaging = firebase.messaging();

    // already granted
    if (Notification.permission === 'granted') {
        getToken();
    }

    // get permission on subscribe only once
    bt_register.on('click', function() {
        if (Notification.permission !== 'granted') {
            getToken();
        }
    });
    bt_delete.on('click', function() {
        setTokenSentToServer(false);
    });
    form.on('submit', function(event) {
        event.preventDefault();
        console.log($(this).serialize());
        sendNotification($(this).serialize());
    });

    // handle catch the notification on current page
    messaging.onMessage(function(payload) {
        console.log('Message received. ', payload);

        new Notification(payload.notification.title, payload.notification);
    });
} else {
    console.warn('This browser does not support desktop notification.');
    console.warn('Is HTTPS', window.location.protocol === 'https:');
    console.warn('Support Notification', 'Notification' in window);
    console.warn('Support ServiceWorker', 'serviceWorker' in navigator);
    console.warn('Support LocalStorage', 'localStorage' in window);
    console.warn('Support fetch', 'fetch' in window);
    updateUIForPushPermissionRequired();
}


function getToken() {
    messaging.requestPermission()
        .then(function() {
            // Get Instance ID token. Initially this makes a network call, once retrieved
            // subsequent calls to getToken will return from cache.
            messaging.getToken()
                .then(function(currentToken) {

                    if (currentToken) {
                        sendTokenToServer(currentToken);
                        updateUIForPushEnabled(currentToken);
                    } else {
                        console.warn('No Instance ID token available. Request permission to generate one.');
                        updateUIForPushPermissionRequired();
                        setTokenSentToServer(false);
                    }
                })
                .catch(function(err) {
                    console.warn('An error occurred while retrieving token. ', err);
                    updateUIForPushPermissionRequired();
                    setTokenSentToServer(false);
                });
        })
        .catch(function(err) {
            console.warn('Unable to get permission to notify.', err);
        });
}


function sendNotification(notification) {
    var key = 'AAAAaGQ_q2M:APA91bGCEOduj8HM6gP24w2LEnesqM2zkL_qx2PJUSBjjeGSdJhCrDoJf_WbT7wpQZrynHlESAoZ1VHX9Nro6W_tqpJ3Aw-A292SVe_4Ho7tJQCQxSezDCoJsnqXjoaouMYIwr34vZTs';

    fetch('https://fcm.googleapis.com/fcm/send', {
        'method': 'POST',
        'headers': {
            'Authorization': 'key=' + key,
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify({
            'notification': notification,
            'to': getCurrentToken()
        })
    }).then(function(response) {
        console.log(response);
    }).catch(function(error) {
        console.error(error);
    })
}

// Send the Instance ID token your application server, so that it can:
// - send messages back to this app
// - subscribe/unsubscribe the token from topics
function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer(currentToken)) {
        console.log('Sending token to server...');
        // send current token to server
        //$.post(url, {token: currentToken});
        setTokenSentToServer(currentToken);
    } else {
        console.log('Token already sent to server so won\'t send it again unless it changes');
    }
}

function isTokenSentToServer(currentToken) {
    return getCurrentToken() == currentToken;
}

function setTokenSentToServer(currentToken) {
    if (currentToken) {
        window.localStorage.setItem('sentFirebaseMessagingToken', currentToken);
    } else {
        window.localStorage.removeItem('sentFirebaseMessagingToken');
    }
}

function getCurrentToken() {
    return window.localStorage.getItem('sentFirebaseMessagingToken');
}

function updateUIForPushEnabled(currentToken) {
    console.log(currentToken);
    token.text(currentToken);
    bt_register.hide();
    bt_delete.show();
    form.show();
}

function updateUIForPushPermissionRequired() {
    bt_register.attr('disabled', 'disabled');
}
