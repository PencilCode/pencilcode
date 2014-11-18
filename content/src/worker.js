console.log('ServiceWorker is running!');

self.addEventListener('fetch', function(event) {
  console.log(event.request);
});
