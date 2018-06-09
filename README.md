Test Firebase Cloud Messaging
-----------------------------

You can test usage on page: https://peter-gribanov.github.io/serviceworker/

<img src="ScreenRecord.gif" alt="" align="center">

> Firebase loses the `image` from the notification.
> You can fix the problem by specifying a `image` in `data`.


Send notification from HTTP client
----------------------------------

```
POST /fcm/send HTTP/1.1
Host: fcm.googleapis.com
Authorization: key=AAAAaGQ_q2M:APA91bGCEOduj8HM6gP24w2LEnesqM2zkL_qx2PJUSBjjeGSdJhCrDoJf_WbT7wpQZrynHlESAoZ1VHX9Nro6W_tqpJ3Aw-A292SVe_4Ho7tJQCQxSezDCoJsnqXjoaouMYIwr34vZTs
Content-Type: application/json

{
  "notification": {
    "title": "Bubble Nebula",
    "body": "It's found today at 21:00",
    "icon": "https://peter-gribanov.github.io/serviceworker/Bubble-Nebula.jpg",
    "click_action": "https://www.nasa.gov/feature/goddard/2016/hubble-sees-a-star-inflating-a-giant-bubble"
  },
  "data": {
    "image": "https://peter-gribanov.github.io/serviceworker/Bubble-Nebula_big.jpg",
  }
  "to": "YOUR-TOKEN-ID"
}
```

Send notification by cURL
-------------------------

```bash
curl -d '
{
  "notification": {
    "title": "Bubble Nebula",
    "body": "It`s found today at 21:00",
    "icon": "https://peter-gribanov.github.io/serviceworker/Bubble-Nebula.jpg",
    "click_action": "https://www.nasa.gov/feature/goddard/2016/hubble-sees-a-star-inflating-a-giant-bubble"
  },
  "data": {
    "image": "https://peter-gribanov.github.io/serviceworker/Bubble-Nebula_big.jpg",
  }
  "to": "c9w1LY6XeH8:APA91bEzZEgmVeYX6Fm0VKj79wL-mBnQUFq0dsZKAxowoXtnAa6FvKsnTv-_xq1o7KknYsDD-mZX44TB-nhq12jcbUNcDcA8ZHuXHCgXA9z0mw_Q078oHczHE1yPCYGyEIQfQKd08ky5"
}' \
    -H "Content-Type: application/json" \
    -H "Authorization: key=AAAAaGQ_q2M:APA91bGCEOduj8HM6gP24w2LEnesqM2zkL_qx2PJUSBjjeGSdJhCrDoJf_WbT7wpQZrynHlESAoZ1VHX9Nro6W_tqpJ3Aw-A292SVe_4Ho7tJQCQxSezDCoJsnqXjoaouMYIwr34vZTs" \
    -X POST "https://fcm.googleapis.com/fcm/send"
```
