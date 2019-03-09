importScripts('https://www.gstatic.com/firebasejs/5.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.8.1/firebase-messaging.js');
firebase.initializeApp({
  messagingSenderId: '673849500972'
});
const messaging = firebase.messaging();

//这里开始是应用进入后台的处理
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  let content = null;
  if (payload.notification) {
    content = payload.notification
  }else {
    content = payload.data;
  }

  var notificationOptions = {
    body: content.body,
    icon: '/static/logo.png'
  };

  return self.registration.showNotification(content.title,
    notificationOptions);
});
