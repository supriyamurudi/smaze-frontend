/* Basic Service Worker for Smaze */
self.addEventListener("install", () => {
  console.log("Service Worker installed");
  self.skipWaiting(); // Activates the new SW immediately
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");
  event.waitUntil(self.clients.claim()); // Ensures the SW controls all pages
});

// Properly handle fetch requests (Crucial for installation)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    }),
  );
});
