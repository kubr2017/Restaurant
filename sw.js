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
//
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request).then(function(resp) {
//       // console.log(`resp=${resp.clone()}`);
//       return resp || fetch(event.request).then(function(response) {
//         console.log(`go to fetch event.req=${event.request}`);
//         if (!response.status===202) {
//           console.log(`resp.status !=202`);
//           let responseClone = response.clone();
//           caches.open('v1').then(function(cache) {
//             console.log(`v1 opened`);
//             cache.put(event.request, responseClone);
//             console.log(`put to cache ${event.request}`);
//           });
//         }
//         return response;
//       })
//     }).catch(function() {
//       console.log(`error hapened`);
//       return caches.match('/img/No-reception-signal.jpg');
//     })
//   );
// });


// Code from developer.google.com

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open('v1').then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          if (!event.request.status===202){
            cache.put(event.request, response.clone());
          }
          return response;
        });
      });
    })
  );
});











//
