firebase.initializeApp({
    messagingSenderId: '448358493027'
});


var bt_register = $('#register');
var bt_delete = $('#delete');
var token = $('#token');
var form = $('#notification');
var massage_id = $('#massage_id');
var massage_row = $('#massage_row');

var input_body = $('#body');
var timerId = setInterval(setNotificationDemoBody, 60000);

function setNotificationDemoBody() {
    if (input_body.val().search(/^It's found today at \d\d:\d\d$/i) !== -1) {
        var now = new Date();
        input_body.val('It\'s found today at ' + now.getHours() + ':' + (now.getMinutes() > 9 ? now.getMinutes() : '0' + now.getMinutes()));
    } else {
        clearInterval(timerId);
    }
}

setNotificationDemoBody();
resetUI();

if (window.location.protocol === 'https:' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'localStorage' in window &&
    'fetch' in window &&
    'postMessage' in window
) {
    var messaging = firebase.messaging();

    // already granted
    if (Notification.permission === 'granted') {
        getToken();
    }

    // get permission on subscribe only once
    bt_register.on('click', function() {
        getToken();
    });

    bt_delete.on('click', function() {
        // Delete Instance ID token.
        messaging.getToken()
            .then(function(currentToken) {
                messaging.deleteToken(currentToken)
                    .then(function() {
                        console.log('Token deleted.');
                        setTokenSentToServer(false);
                        // Once token is deleted update UI.
                        resetUI();
                    })
                    .catch(function(err) {
                        console.log('Unable to delete token. ', err);
                    });
            })
            .catch(function(err) {
                console.log('Error retrieving Instance ID token. ', err);
            });
    });

    form.on('submit', function(event) {
        event.preventDefault();

        var notification = {};
        form.find('input').each(function () {
            var input = $(this);
            notification[input.attr('name')] = input.val();
        });

        sendNotification(notification);
    });

    // handle catch the notification on current page
    messaging.onMessage(function(payload) {
        console.log('Message received. ', payload);

        new Notification(payload.notification.title, payload.notification);
        // var n = new Notification(payload.notification.title, {
        //     body: payload.notification.body,
        //     icon: payload.notification.icon
        //
        // });
        //
        // n.onclick = function(event) {
        //     event.preventDefault();
        //     window.open(payload.notification.click_action, '_blank');
        //     n.close();
        // }
    });
} else {
    if (window.location.protocol !== 'https:') {
        showError('Is not from HTTPS');
    } else if (!('Notification' in window)) {
        showError('Notification not supported');
    } else if (!('serviceWorker' in navigator)) {
        showError('ServiceWorker not supported');
    } else if (!('localStorage' in window)) {
        showError('LocalStorage not supported');
    } else if (!('fetch' in window)) {
        showError('fetch not supported');
    } else if (!('postMessage' in window)) {
        showError('postMessage not supported');
    }

    console.warn('This browser does not support desktop notification.');
    console.log('Is HTTPS', window.location.protocol === 'https:');
    console.log('Support Notification', 'Notification' in window);
    console.log('Support ServiceWorker', 'serviceWorker' in navigator);
    console.log('Support LocalStorage', 'localStorage' in window);
    console.log('Support fetch', 'fetch' in window);
    console.log('Support fetch', 'postMessage' in window);

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
                        showError('No Instance ID token available. Request permission to generate one.');
                        updateUIForPushPermissionRequired();
                        setTokenSentToServer(false);
                    }
                })
                .catch(function(err) {
                    showError('An error occurred while retrieving token.');
                    console.warn(err);
                    updateUIForPushPermissionRequired();
                    setTokenSentToServer(false);
                });
        })
        .catch(function(err) {
            showError('Unable to get permission to notify.');
            console.warn(err);
        });
}


function sendNotification(notification) {
    var key = 'AAAAaGQ_q2M:APA91bGCEOduj8HM6gP24w2LEnesqM2zkL_qx2PJUSBjjeGSdJhCrDoJf_WbT7wpQZrynHlESAoZ1VHX9Nro6W_tqpJ3Aw-A292SVe_4Ho7tJQCQxSezDCoJsnqXjoaouMYIwr34vZTs';

    console.log('Send notification', notification);

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
        return response.json();
    }).then(function(json) {
        console.log('Response', json);

        if (json.success == 1) {
            massage_row.show();
            massage_id.text(json.results[0].message_id);
        } else {
            massage_row.hide();
            massage_id.text(json.results[0].error);
        }
    }).catch(function(error) {
        showError(error);
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

function resetUI() {
    token.text('');
    bt_register.show();
    bt_delete.hide();
    form.hide();
    massage_row.hide();
}

function updateUIForPushPermissionRequired() {
    bt_register.attr('disabled', 'disabled');
    resetUI();
}

function showError(error) {
    console.error(error);
    $('#alert').show();
    $('#alert-message').html(error);
}