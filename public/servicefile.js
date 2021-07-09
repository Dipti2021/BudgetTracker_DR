const files_needed= ["/", "/index.html", "/styles.css", "/manifest.webmanifest", "/index.js", "/db.js"]; 
  const static_cache = "static-dr";
  const data_cache = "data-dr"; 
  self.addEventListener("install", function (evt) {
    evt.waitUntil(
      caches.open(static_cache).then(cache => {
        console.log("Your files were pre-cached successfully!");
        return cache.addAll(files_needed);
      })
    );
    self.skipWaiting();
  });
  self.addEventListener("activate", function (evt) {
    evt.waitUntil(
      caches.keys().then(keyList => {
        return Promise.all(
          keyList.map(key => {
            if (key !== static_cache && key !== data_cache) {
              console.log("Removing old cache data", key);
              return caches.delete(key);
            }
          })
        );
      })
    );
    self.clients.claim();
  });
  self.addEventListener("fetch", function (evt) {
    if (evt.request.url.includes("/api/")) {
      evt.respondWith(
        caches.open(data_cache).then(cache => {
          return fetch(evt.request)
            .then(response => {
              if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
              }
              return response;
            })
            .catch(err => {
            
              return cache.match(evt.request);
            });
        }).catch(err => console.log(err))
      );
      return;
    }
    evt.respondWith(
      caches.open(static_cache).then(cache => {
        return cache.match(evt.request).then(response => {
          return response || fetch(evt.request);
        });
      })
    );
  });