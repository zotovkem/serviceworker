self.addEventListener('notificationclick', function(event) {
    // var target = event.notification.data.click_action || '/';
    var target = 'https://peter-gribanov.github.io/serviceworker/Bubble-Nebula.jpg';
    event.notification.close();
    event.waitUntil(self.clients.openWindow(target));

    // This looks to see if the current is already open and focuses if it is
    // event.waitUntil(clients.matchAll({
    //     type: 'window'
    // }).then(function(clientList) {
    //     // clientList always is empty?!
    //     for (var i = 0; i < clientList.length; i++) {
    //         var client = clientList[i];
    //         if (client.url == target && 'focus' in client) {
    //             return client.focus();
    //         }
    //     }
    //
    //     if (clients.openWindow) {
    //         return clients.openWindow(target);
    //     }
    // }));
});
