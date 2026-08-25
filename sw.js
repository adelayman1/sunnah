const CACHE_NAME = "sunan-pwa-v3";
const APP_SHELL = [
  "./",
  "./index.html",
  "./details-alt.html",
  "./azkar.html",
  "./azkar-detail.html",
  "./styles.css",
  "./app.js",
  "./detail-alt.js",
  "./azkar-data.js",
  "./azkar.js",
  "./azkar-detail.js",
  "./theme.js",
  "./pwa.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./fonts/ThmanyahSans-Light.woff2",
  "./fonts/ThmanyahSans-Regular.woff2",
  "./fonts/ThmanyahSans-Medium.woff2",
  "./fonts/ThmanyahSans-Bold.woff2",
  "./fonts/ThmanyahSans-Black.woff2"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match("./details-alt.html", { ignoreSearch: true }).then((response) =>
          response || caches.match("./index.html")
        )
      )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          const clonedResponse = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return networkResponse;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
