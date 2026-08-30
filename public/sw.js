/* Basic Service Worker for Smaze */
self.addEventListener("install", () => {
  console.log("Service Worker installed");
});

self.addEventListener("activate", () => {
  console.log("Service Worker activated");
});

// ✅ Removed 'event' because it wasn't being used
self.addEventListener("fetch", () => {
  // Basic caching for static assets (you can expand this later)
  // If you want to use network caching later, you can add the event back.
});
