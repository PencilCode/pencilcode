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
        var key_list = keys.map(function(response) {
            return response.url;
          }).sort().join('<br>');
        var body = '<html>\
          <script>\
          function killcache() {\
            var r = new XMLHttpRequest();\
            r.open("GET", "/killcache");\
            r.addEventListener("readystatechange", function() {\
              if (r.readyState == 4) { document.location.reload(); };\
            });\
            r.send();\
          }\
          </script>\
          <body>\
          <p> Cache hits = ' + cache_hits + ' </p>\
          <p> Cache misses = ' + cache_misses + ' </p>\
          <p> Cache errors = ' + cache_errors + ' </p>\
          <p><input type="button" onclick="killcache()" value="Kill cache"></input></p>\
          <p> Keys :</p>\
          <p>' + key_list + '\
          </p>\
          </body>\
          </html>\
          ';
        return new Response(body, {
            headers: { 'Content-Type': 'text/html' }
          });
      });
  return p;
}

function killCache() {
  var p = self.caches.delete('main')
    .then(function() {
        return new Response('OK');
      });
  return p;
}

var blacklisted_prefixes = [
    '/load', '/save', '/log'
    ];

function onfetch(event) {
  console.log(event.request.url);
  var myurl = new URL(event.request.url);
  var scopeurl = new URL(self.scope);
  if (myurl.host === myurl.host) {
    if (myurl.pathname === '/stats') {
      event.respondWith(returnStatsPage());
      return;
    }
    if (myurl.pathname === '/killcache') {
      event.respondWith(killCache());
      return;
    }
    if (blacklisted_prefixes.some(function(prefix) {
        return myurl.pathname.indexOf(prefix) == 0;
      })) {
      event.default();
      return;
    }
  }
  if (myurl.host === 'www.google-analytics.com') {
    event.default();
    return;
  }
  event.respondWith(lookupRequestOnCache(event.request));
}

self.addEventListener('activate', onactivate);

self.addEventListener('fetch', onfetch);
