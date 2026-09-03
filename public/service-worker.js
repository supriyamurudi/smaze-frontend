const CACHE_NAME = "smaze-v2";

// Install: Immediately activate the new service worker
self.addEventListener("install", () => {
  self.skipWaiting();
});

// Activate: Delete old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// Fetch: Network First (Always try server, fallback to cache)
self.addEventListener("fetch", (event) => {
  // ✅ CRITICAL: IGNORE ALL API CALLS - Never cache auth requests!
  if (event.request.url.includes("/api/")) return;

  // Only handle GET requests for static assets
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, copy);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          return cached || caches.match("/index.html");
        });
      }),
  );
});
