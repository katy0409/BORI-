const CACHE_NAME = "bori-v1.3.1-production";
const ASSETS = ["./","./index.html","./styles.css","./config.js","./app.js","./manifest.webmanifest","./assets/favicon.png","./assets/icon-192.png","./assets/icon-512.png","./assets/splash-v2.png"];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== location.origin) return;
  event.respondWith(fetch(event.request).then(response => { const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)); return response; }).catch(() => caches.match(event.request)));
});
