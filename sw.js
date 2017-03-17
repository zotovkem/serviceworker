self.addEventListener('notificationclick', function(event) {
    var target = event.notification.data || '/';
    event.notification.close();

    // This looks to see if the current is already open and focuses if it is
    event.waitUntil(clients.matchAll({
        type: 'window'
    }).then(function(clientList) {
        // clientList always is empty?!
        for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (client.url == target && 'focus' in client) {
                return client.focus();
            }
        }

        if (clients.openWindow) {
            return clients.openWindow(target);
        }
    }));
});
