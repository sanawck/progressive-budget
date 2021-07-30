const FILES_TO_CACHE = [
  "/",
  "/index.js",
  "/indexdb.js",
  "/manifest.json",
  "/styles.css",
  "/icon-192x192.png",
  "/icon-512-521.png",
];

const PRECACHE = "precache-v1";
const RUNTIME = "runtime";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
// self.addEventListener("activate", (event) => {
//   const currentCaches = [PRECACHE, RUNTIME];
//   event.waitUntil(
//     caches
//       .keys()
//       .then((cacheNames) => {
//         return cacheNames.filter(
//           (cacheName) => !currentCaches.includes(cacheName)
//         );
//       })
//       .then((cachesToDelete) => {
//         return Promise.all(
//           cachesToDelete.map((cacheToDelete) => {
//             return caches.delete(cacheToDelete);
//           })
//         );
//       })
//       .then(() => self.clients.claim())
//   );
// });

self.addEventListener("fetch", (event) => {
  if (event.request.url.startsWith("/api/")) {
    event.respondWith(
      // caches.match(event.request).then((cachedResponse) => {
      //   if (cachedResponse) {
      //     return cachedResponse;
      //   }

      //return
      caches
        .open(RUNTIME)
        .then((cache) => {
          return fetch(event.request)
            .then((response) => {
              if (response.status === 200) {
                cache.put(event.request.url, response.clone());
              }

              return response;
            })
            .catch((err) => {
              return cache.match(event.request);
            });
        })
        .catch((err = console.log("err")))
    );
    return;
  }
  event.responWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request).then(function (response) {
        if (response) {
          return response;
        } else if (event.request.headers.get("accept").includes("text/html")) {
          return caches.match("/");
        }
      });
    })
  );
});
