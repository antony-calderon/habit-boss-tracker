/* Service worker manual — CAPA 3.
 * Estrategia: precache del app shell básico + cache dinámica en runtime
 * (cache-first con relleno). Garantiza el funcionamiento offline del shell
 * tras la primera carga. Los datos viven en localStorage.
 */

const CACHE = "hbt-v1";

// Shell mínimo conocido en tiempo de instalación. Los assets con hash de Vite
// (JS/CSS) se cachean al vuelo en el handler de fetch.
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Solo GET y mismo origen.
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navegaciones (SPA): servir index.html desde caché, fallback a red.
  if (request.mode === "navigate") {
    event.respondWith(
      caches
        .match("/index.html")
        .then((cached) => cached || fetch(request))
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  // Assets: cache-first con relleno dinámico.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          // Cachea solo respuestas básicas y correctas.
          if (response && response.status === 200 && response.type === "basic") {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
