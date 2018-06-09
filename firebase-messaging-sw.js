importScripts('https://www.gstatic.com/firebasejs/3.7.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.7.2/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId': '448358493027'
});

const messaging = firebase.messaging();

// Customize notification handler
messaging.setBackgroundMessageHandler(function(payload) {
  // FIXME Firebase does not send image yet
  if (typeof payload.data.image !== 'undefined') {
    payload.notification.image = payload.data.image;
  }

  return self.registration.showNotification(payload.notification.title, payload.notification);
});

self.addEventListener('notificationclick', function(event) {
    const target = event.notification.data.click_action || '/';
    event.notification.close();

    // This looks to see if the current is already open and focuses if it is
    event.waitUntil(clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then(function(clientList) {
        // clientList always is empty?!
        for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (client.url === target && 'focus' in client) {
                return client.focus();
            }
        }
    
        return clients.openWindow(target);
    }));
});
