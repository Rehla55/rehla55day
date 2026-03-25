importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

console.log('Firebase Messaging Service Worker loading...');

firebase.initializeApp({
  apiKey: "AIzaSyDsFEgVfoEVaf6AME5OV6nwTjMaHM63A5U",
  projectId: "rehla55day-e8bf2",
  storageBucket: "rehla55day-e8bf2.firebasestorage.app",
  messagingSenderId: "39933750061",
  appId: "1:39933750061:web:99a96c649dfcf58adfc1a4"
});

const messaging = firebase.messaging();

console.log('Firebase Messaging initialized');

messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);
  const notificationTitle = payload.notification ? payload.notification.title : 'إشعار جديد';
  const notificationOptions = {
    body: payload.notification ? payload.notification.body : '',
    icon: 'img/icon.jpeg'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

console.log('Background message handler registered');
