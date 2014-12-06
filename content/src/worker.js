importScripts('worker-stats.js');

// TODO: Cache names should be versioned.
var main_cache_name = 'main';
var user_cache_name = 'user';

function getCachedResponse(request) {
  return self.caches.open(main_cache_name)
    .then(function(cache) {
        return cache.match(request)
          .then(function(response) {
              if (response === undefined) {
                stats.addResult(request.url, CACHE_MISS);
                return fetch(request)
                  .then(function(response) {
                      cache.put(request, response.clone());
                      return response;
                    });
              } else {
                stats.addResult(request.url, CACHE_HIT);
                fetch(request)
                  .then(function(response) {
                      return response && cache.put(request, response);
                    });
                return response;
              }
            });
      });
}

function appendPath(base, name) {
  if (base === '') {
    return name;
  }
  return base + '/' + name;
}

function rawCacheEntryName(filename) {
  return '/raw/' + filename;
}

function prefetchUserFiles(path, list) {
  var p = Promise.all(list.map(function(entry) {
      var entry_path = appendPath(path, entry.name);
      if (entry.mode === 'drwx') {
        return prefetchUserDirectory(entry_path);
      } else {
        return fetch('/load?file=' + entry_path)
          .then(function(response) {
              return self.caches.open(user_cache_name)
                .then(function(cache) {
                    console.log("Adding user file: " + entry_path);
                    return cache.put(rawCacheEntryName(entry_path), response);
                  });
            });
      }
    }));
  return p;
}

function prefetchUserDirectory(path) {
  path = path || '';
  // path must be a directory.
  var p = fetch('/load?file=' + path)
    .then(function(response) {
        return self.caches.open(user_cache_name)
          .then(function(cache) {
              console.log("Adding user directory : " + path);
              return cache.put(rawCacheEntryName(path), response.clone());
            })
          .then(function() {
              // response should be json.
              return response.json();
            });
      })
    .then(function(data) {
        var list = data.list;
        return prefetchUserFiles(path, list);
      });
  return p;
}

function getSearchParams(search) {
  var params = {};
  if (search.length === 0 || search[0] !== '?') {
    return {};
  }
  search.substr(1).split('&').forEach(function(pair) {
    var kv = pair.split('=');
    if (kv.length === 2) {
      params[kv[0]] = decodeURIComponent(kv[1]);
    }
  });
  return params;
}

function handleLoadRequest(request, pathname) {
  var url = new URL(request.url);
  var params = getSearchParams(url.search);
  var filename = params.file || (pathname.length > 1 && pathname.substr(1)) || '';

  console.log('Load for ' + filename + ' with URL ' + request.url);

  return fetch(request)
    .then(function(response) {
        var response_clone = response.clone();
        return self.caches.open(user_cache_name)
          .then(function(cache) {
              stats.addResult(request.url, CACHE_UPDATED);
              console.log('Updating cached entry: ' + filename);
              return cache.put(rawCacheEntryName(filename), response.clone());
            })
          .then(function() {
              return response;
            });
      })
    .catch(function(e) {
        return self.caches.open(user_cache_name)
          .then(function(cache) {
              stats.addResult(request.url, CACHE_FALLBACK);
              console.log('Serving from cache: ' + request.url);
              return cache.match(rawCacheEntryName(filename));
            })
          .then(function(result) {
              if (result) {
                stats.addResult(request.url, CACHE_HIT);
                return result;
              } else {
                stats.addResult(request.url, CACHE_MISS);
                throw new NetworkError();
              }
            });
      });
}

function handleSaveRequest(request, pathname) {
  var url = new URL(request.url);
  var params = getSearchParams(url.search);
  var data = params.data;
  var meta = params.meta;
  var mode = params.mode;
  var sourcefile = params.sourcefile;
  var conditional = params.conditional;
  var key = params.key;
  var sourcekey = params.sourcekey;

  console.log("Search params: " + params);

  return fetch(request);
}

function serveEditPage(request, filename) {
  return self.caches.open(main_cache_name)
    .then(function(cache) {
        return cache.match('/editor.html');
      })
    .then(function(response) {
        if (response) {
          // Replace some of the text.
          stats.addResult(request.url, CACHE_HIT);
          console.log('serving editor.html');
          return response.text().then(function(text) {
              var sub_text = text.replace('<!--#echo var="filepath"-->', filename);
              var b = new Blob([sub_text], {'type': 'text/html'});
              return new Response(b);
            });
        } else {
          stats.addResult(request.url, CACHE_MISS);
          // Just go back to the origin server if possible.
          return fetch(request);
        }
      });
}

function onInstall(event) {
  console.log('onInstall');
  // TODO: Should validate exisiting cache entries here.
  // Kick off an update, but don't wait for it.
  prefetchUserDirectory();
  var p = Promise.all([
      stats.prefetch(),
      getCachedResponse(new Request('/editor.html'))
    ]);
  event.waitUntil(p);
  // TODO: Should also fetch on Sync.
}

function onActivate(event) {
  console.log('onActivate');
}

var blacklisted_prefixes = [
  '/log', '/raw'
];

var page_handlers = [
    // Note that it's important to begin and end the prefix string with /.
  { prefix: '/stats/', handler: stats.handlePageRequest },
  { prefix: '/edit/', handler: serveEditPage },
  { prefix: '/load/', handler: handleLoadRequest },
  { prefix: '/save/', handler: handleSaveRequest }
];

function onFetch(event) {
  var url = new URL(event.request.url);
  var scopeurl = new URL(self.scope);
  if (url.host === url.host) {
    if (page_handlers.some(function(h) {
        if (url.pathname.indexOf(h.prefix) === 0) {
          var remaining_path = url.pathname.substr(h.prefix.length - 1);
          event.respondWith(h.handler(event.request, remaining_path));
          return true;
        }
        return false;
      })) {
      return;
    }
    if (blacklisted_prefixes.some(function(prefix) {
        return url.pathname.indexOf(prefix) == 0;
      })) {
      stats.addResult(event.request.url, CACHE_SKIPPED);
      return;
    }
  }
  if (url.host === 'www.google-analytics.com') {
    stats.addResult(event.request.url, CACHE_SKIPPED);
    return;
  }
  event.respondWith(getCachedResponse(event.request));
}

self.addEventListener('install', onInstall);
self.addEventListener('activate', onActivate);
self.addEventListener('fetch', onFetch);
