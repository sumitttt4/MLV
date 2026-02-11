// ═══════════════════════════════════════════════════════════════
// Hotel MLV Grand — Service Worker (offline-first PWA)
// ═══════════════════════════════════════════════════════════════

const CACHE_NAME = "mlv-grand-v1";

// Shell assets to pre-cache on install
const PRECACHE_URLS = [
  "/",
  "/menu",
  "/manifest.json",
];

// ── Install: pre-cache shell ──
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  // Activate immediately
  self.skipWaiting();
});

// ── Activate: clean old caches ──
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  // Take control of all open tabs
  self.clients.claim();
});

// ── Fetch: network-first for navigations, cache-first for assets ──
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET and Chrome extension requests
  if (request.method !== "GET") return;
  if (request.url.startsWith("chrome-extension://")) return;

  // Navigation requests (pages) — network first, fallback to cache
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache a copy of the response
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/")))
    );
    return;
  }

  // Static assets (JS, CSS, images, fonts) — stale-while-revalidate
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image" ||
    request.destination === "font"
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return response;
          })
          .catch(() => cached);

        return cached || fetchPromise;
      })
    );
    return;
  }

  // API calls — network only (don't cache dynamic data)
  if (request.url.includes("/api/")) {
    event.respondWith(fetch(request));
    return;
  }

  // Default: network first
  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      })
      .catch(() => caches.match(request))
  );
});
