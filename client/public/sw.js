/**
 * OSIRIS Service Worker
 * Offline asset caching for production
 */

const CACHE_NAME = 'osiris-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/music/TRACK-01.mp3',
  '/generated-assets/characters/',
];

// Install - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip API requests
  if (request.url.includes('/api/')) return;
  
  // Audio files - cache first, network fallback
  if (request.url.includes('/music/') || request.url.includes('/audio/')) {
    event.respondWith(cacheFirst(request));
    return;
  }
  
  // Images - stale while revalidate
  if (request.destination === 'image') {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
  
  // Everything else - network first
  event.respondWith(networkFirst(request));
});

// Cache strategies
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  
  const response = await fetch(request);
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, response.clone());
  return response;
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw error;
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  
  const fetchPromise = fetch(request).then((response) => {
    const cache = caches.open(CACHE_NAME);
    cache.then((c) => c.put(request, response.clone()));
    return response;
  });
  
  return cached || fetchPromise;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  }
});

async function syncProgress() {
  // Sync user progress when back online
  // Implementation would sync localStorage data to server
}

// Push notifications (future feature)
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'OSIRIS', {
      body: data.body || 'New content available',
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
    })
  );
});
