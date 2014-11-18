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

	  // Return the cached response but update the cache with the online
	  // version in the background.
	  fetch(request).then(function(response) {
	      if (response)
		  my_cache.put(request, response);
	  });

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
  var scopeurl = new URL(self.scope);
  if (myurl.host === myurl.host) {
    if (myurl.pathname === '/stats') {
      event.respondWith(returnStatsPage());
      return;
    }
    if (myurl.pathname.indexOf('/edit/') == 0) {
      event.respondWith(serveEditPage(event.request, myurl.pathname.substr('/edit'.length)));
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
}

function oninstall(event) {
  console.log('oninstall');
  event.waitUntil(lookupRequestOnCache('/editor.html'));
}

self.addEventListener('install', oninstall);

self.addEventListener('activate', onactivate);

self.addEventListener('fetch', onfetch);
