const CACHE_NAME = 'expcalc-v3';
const urlsToCache = [
  './',
  './index.html',
  './views/details.html',
  './views/rte.html',
  './views/tara.html',
  './assets/index.css',
  './assets/details.css',
  './assets/rte.css',
  './assets/tar.css',
  './js/db.js',
  './js/index.js',
  './js/details.js',
  './js/rte.js',
  './js/tar.js',
  './base/rtes.json',
  './base/taras.json',
  './assets/img/bg1.avif',
  './assets/img/bg2.jpg',
  './assets/img/bg3.avif',
  './assets/img/Background-Animation-HTML-CSS.gif',
  './assets/img/tecidos-de-qualidade-capa.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200) {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});