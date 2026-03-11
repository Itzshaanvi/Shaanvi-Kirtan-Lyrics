const CACHE_NAME = 'kirtan-lyrics-cache-v1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './style.css',
  './script.js',
  './icon-192.png',
  './icon-512.png'
];

// INSTALL
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ACTIVATE
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {

      if (cached) {
        return cached;
      }

      return fetch(event.request).then(networkResponse => {

        if (event.request.method === 'GET') {

          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });

        }

        return networkResponse;

      }).catch(() => caches.match('./'));

    })
  );
});

searchInput.addEventListener("keypress", (e) => {
    if(e.key === "Enter") e.preventDefault(); // prevents form submit
});



