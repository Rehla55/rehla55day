const CACHE_NAME = 'rehla55-v4';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './img/icon.jpeg',
  './img/SiteImage.png',
  './script.js?v=2.9'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// --- Firebase Messaging ---
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDsFEgVfoEVaf6AME5OV6nwTjMaHM63A5U",
  projectId: "rehla55day-e8bf2",
  storageBucket: "rehla55day-e8bf2.firebasestorage.app",
  messagingSenderId: "39933750061",
  appId: "1:39933750061:web:99a96c649dfcf58adfc1a4"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification ? payload.notification.title : 'إشعار جديد';
  const notificationOptions = {
    body: payload.notification ? payload.notification.body : '',
    icon: 'img/icon.jpeg'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
