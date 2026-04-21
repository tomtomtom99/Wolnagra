const CACHE_NAME = 'wolnagra-v3';
const URLS_TO_CACHE = [
  '/wolnagra.html',
  '/wolnagra-auth.html',
  '/wolnagra-dziennik.html',
  '/wolnagra-zadania.html',
  '/wolnagra-kryzys.html',
  '/wolnagra-historie.html',
  '/wolnagra-meetings.html',
  '/wolnagra-nagrody.html',
  '/manifest.json'
];

// Install — cache all pages
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match('/wolnagra.html');
        }
      });
    })
  );
});
