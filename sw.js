//install cache
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/'
      ]);
    })
  );
});

//Fetch to requests

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request).then(function(resp) {
//       // console.log(`resp=${resp.clone()}`);
//       return resp || fetch(event.request).then(function(response) {
//         console.log(`go to fetch event.req=${event.request}`);
//         let responseClone = response.clone();
//         caches.open('v1').then(function(cache) {
//           console.log(`v1 opened`);
//           cache.put(event.request, responseClone);
//         });
//         return response;
//       });
//     }).catch(function() {
//       console.log(`error hapened`);
//       return caches.match('/img/No-reception-signal.jpg');
//     })
//   );
// });

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open('v1').then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});











//
