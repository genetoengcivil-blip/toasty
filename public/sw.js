const CACHE_NAME = "toasty-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  if (request.destination === "document") {
    event.respondWith(
      fetch(request)
        .then((r) => {
          const clone = r.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          return r;
        })
        .catch(() => caches.match(request))
    );
  } else if (request.destination === "image" || request.destination === "font" || request.destination === "style") {
    event.respondWith(
      caches.match(request).then((c) => c || fetch(request).then((r) => {
        const clone = r.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return r;
      }))
    );
  } else {
    event.respondWith(
      caches.match(request).then((c) => c || fetch(request))
    );
  }
});