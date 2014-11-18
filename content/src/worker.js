console.log('ServiceWorker is running!');

var cache_hits = 0;
var cache_misses = 0;
var cache_errors = 0;

function onactivate(event) {
  console.log("Activated");
  var p = self.caches.open('main')
      .then(function(cache) {
        console.log("Inital cache open succeeded");
      });
  event.waitUntil(p);
}

function lookupRequestOnCache(request) {
  var my_cache = null;
  var p = self.caches.open('main')
    .then(function(cache) {
        my_cache = cache;
        return cache.match(request);
      })
    .then(function(response) {
        if (response === undefined) {
          return fetch(request)
            .then(function(response) {
                console.log('Fetch succeeded for ' + request.url);
                ++cache_misses;
                return my_cache.put(request, response)
                  .then(function() {
                      return response;
                    });
              });
        } else {
          ++cache_hits;
          console.log('Cache hit for ' + request.url);
          return response;
        }
      })
    .catch(function(e) {
        ++cache_errors;
        console.log('Caught ' + e + ' for ' + request.url);
        throw e;
      });
  return p;
}

function returnStatsPage() {
  var p = self.caches.open('main')
    .then(function(cache) {
        return cache.keys();
      })
    .then(function(keys) {
        var body = 'Cache hits = ' + cache_hits + '\n';
        body += 'Cache misses = ' + cache_misses + '\n';
        body += 'Cache errors = ' + cache_errors + '\n';
        body += 'Keys:\n' + keys.map(function(response) {
          return response.url;
        }).sort().join('\n');
        return new Response(body, {
            headers: { 'Content-Type': 'text/plain' }
          });
      });
  return p;
}

function serveEditPage(request, filename) {
  var p = self.caches.open('main')
    .then(function(cache) {
      return cache.match('/editor.html');
    }).then(function(response) {
      if (response) {
        // Replace some of the text.
        console.log('serving editor.html');
        return response.text().then(function(text) {
          var sub_text = text.replace('<!--#echo var="filepath"-->', filename);
          var b = new Blob([sub_text], {'type': 'text/html'});
          return new Response(b);
        });
      } else {
        // Just go back to the origin server if possible.
        return fetch(request);
      }
   });
  return p;
}

function onfetch(event) {
  var myurl = new URL(event.request.url);
  if (myurl.pathname === '/stats') {
    event.respondWith(returnStatsPage());
  } else if (myurl.pathname.indexOf('/edit/') == 0) {
    event.respondWith(serveEditPage(event.request, myurl.pathname.substr('/edit'.length)));
  } else {
    event.respondWith(lookupRequestOnCache(event.request));
  }
}

function oninstall(event) {
  console.log('oninstall');
  event.waitUntil(lookupRequestOnCache('/editor.html'));
}

self.addEventListener('install', oninstall);

self.addEventListener('activate', onactivate);

self.addEventListener('fetch', onfetch);
