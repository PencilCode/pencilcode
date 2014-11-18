var internal_cache_name = 'internal';
var main_cache_name = 'main';
var user_cache_name = 'user';

// Some stats for this service worker session.
var cache_hits = 0;
var cache_misses = 0;
var cache_errors = 0;
var cache_activity = [];
var max_cache_activity = 30;
var CACHE_HIT = 'hit';
var CACHE_MISS = 'miss';
var CACHE_UPDATED = 'updated';
var CACHE_FALLBACK = 'fallback';
var CACHE_SKIPPED = 'skip';

function statAddRequest(url) {
  if (cache_activity.some(function(value) {
      if (value[0] === url) {
        return true;
      }
    })) {
    return;
  }
  if (cache_activity > max_cache_activity) {
    cache_activity.shift();
  }

  cache_activity.push([url]);
}

function statAddResult(url, result) {
  cache_activity.some(function(value) {
      if (value[0] === url) {
        value.push(result);
      }
    });
}

function getCachedResponse(request) {
  var my_cache = null;
  return self.caches.open(main_cache_name)
    .then(function(cache) {
        my_cache = cache;
        return cache.match(request);
      })
    .then(function(response) {
        if (response === undefined) {
          console.log('Cache miss for ' + request.url);
          ++cache_misses;
          return fetch(request)
            .then(function(response) {
                return my_cache.put(request, response)
                  .then(function() {
                      return response;
                    });
              });
        } else {
          ++cache_hits;
          statAddResult(request.url, CACHE_HIT);

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
}

function preloadInternalPages() {
  var internal_pages = ['worker-stats.html'];
  return Promise.all(internal_pages.map(function(page) {
      return fetch(page)
        .then(function(response) {
            return self.caches.open(internal_cache_name)
              .then(function(cache) {
                  return cache.put(page, response);
                });
          });
    }));
}

function handleStatsRequest(url) {
  if (url.pathname === '/stats/killcache') {
    return killCache();
  }
  if (url.pathname === '/stats/get') {
    return getStats();
  }
  return self.caches.open(internal_cache_name)
    .then(function(cache) {
        return cache.match('worker-stats.html');
      });
}

function getStats() {
  var main_cache_entries = null;
  var user_cache_entries = null;

  return self.caches.open(main_cache_name)
    .then(function(cache) {
        return cache.keys();
      })
    .then(function(keys) {
        main_cache_entries = keys.map(function(request) {
            return request.url;
          });
      })
    .then(function() {
        return self.caches.open(user_cache_name);
      })
    .then(function(cache) {
        return cache.keys();
      })
    .then(function(keys) {
        user_cache_entries = keys.map(function(request) {
            return request.url;
          });
      })
    .then(function() {
        var data = {
          worker_scope: self.scope,
          cache_hits: cache_hits,
          cache_misses: cache_misses,
          cache_errors: cache_errors,
          main_cache_keys: main_cache_entries,
          user_cache_keys: user_cache_entries,
          recent_requests: cache_activity
        };
        var blob = new Blob([JSON.stringify(data)], { type: 'text/javascript' });
        return new Response(blob);
      });
}

function killCache() {
  return Promise.all([
      self.caches.delete(main_cache_name),
      self.caches.delete(user_cache_name)
    ])
    .then(function() {
        return new Response('OK');
      });
}

function appendPath(base, name) {
  if (base === '') {
    return name;
  }
  return base + '/' + name;
}

function cachePath(filename) {
  return '/raw/' + filename;
}

function fetchUserFiles(path, list) {
  var p = Promise.all(list.map(function(entry) {
      var entry_path = appendPath(path, entry.name);
      if (entry.mode === 'drwx') {
        return fetchUserDirectory(entry_path);
      } else {
        return fetch('/load?file=' + entry_path)
          .then(function(response) {
              return self.caches.open(user_cache_name)
                .then(function(cache) {
                    console.log("Adding user file: " + entry_path);
                    return cache.put(cachePath(entry_path), response);
                  });
            });
      }
    }));
  return p;
}

function fetchUserDirectory(path) {
  path = path || '';
  // path must be a directory.
  var p = fetch('/load?file=' + path)
    .then(function(response) {
        return self.caches.open(user_cache_name)
          .then(function(cache) {
              console.log("Adding user directory : " + path);
              return cache.put(cachePath(path), response.clone());
            })
          .then(function() {
              // response should be json.
              return response.json();
            });
      })
    .then(function(data) {
        var list = data.list;
        return fetchUserFiles(path, list);
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
              statAddResult(request.url, CACHE_UPDATED);
              console.log('Updating cached entry: ' + filename);
              return cache.put(cachePath(filename), response.clone());
            })
          .then(function() {
              return response;
            });
      })
    .catch(function(e) {
        return self.caches.open(user_cache_name)
          .then(function(cache) {
              statAddResult(request.url, CACHE_FALLBACK);
              console.log('Serving from cache: ' + request.url);
              return cache.match(cachePath(filename));
            })
          .then(function(result) {
              if (result) {
                statAddResult(request.url, CACHE_HIT);
                return result;
              } else {
                statAddResult(request.url, CACHE_MISS);
                throw new NetworkError();
              }
            });
      });
}

function handleSaveRequest(request, pathname) {
  var params = getSearchParams(url.search);
  var data = params.data;
  var meta = params.meta;
  var mode = params.mode;
  var sourcefile = params.sourcefile;
  var conditional = params.conditional;
  var key = params.key;
  var sourcekey = params.sourcekey;

  console.log("Search params: " + params);

  // TODO: We currently don't get here because SW doesn't handle POST requests.
  return fetch(request);
}

function serveEditPage(request, filename) {
  var p = self.caches.open('main')
    .then(function(cache) {
      return cache.match('/editor.html');
    }).then(function(response) {
      if (response) {
        // Replace some of the text.
        statAddResult(request.url, CACHE_HIT);
        console.log('serving editor.html');
        return response.text().then(function(text) {
          var sub_text = text.replace('<!--#echo var="filepath"-->', filename);
          var b = new Blob([sub_text], {'type': 'text/html'});
          return new Response(b);
        });
      } else {
        statAddResult(request.url, CACHE_MISS);
        // Just go back to the origin server if possible.
        return fetch(request);
      }
   });
  return p;
}

function onInstall(event) {
  // Kick off an update, but don't wait for it.
  fetchUserDirectory();
  // TODO: Should also fetch on Sync.
  // TODO: Should validate exisiting cache entries while we are here.
}

function onActivate(event) {
  var p = preloadInternalPages()
    .then(function() {
        return lookupRequestOnCache('/editor.html');
      })
    .catch(function() {});
  event.waitUntil(p);
}

var blacklisted_prefixes = [
    '/log', '/raw'
    ];

function onFetch(event) {
  statAddRequest(event.request.url);
  var url = new URL(event.request.url);
  var scopeurl = new URL(self.scope);
  if (url.host === url.host) {
    if (url.pathname.indexOf('/stats') === 0) {
      event.respondWith(handleStatsRequest(url));
      return;
    }
    if (url.pathname.indexOf('/edit/') == 0) {
      event.respondWith(serveEditPage(event.request, url.pathname.substr('/edit'.length)));
      return;
    }
    if (url.pathname.indexOf('/load') === 0) {
      event.respondWith(handleLoadRequest(event.request, url.pathname.substr('/load'.length)));
      return;
    }
    if (url.pathname.indexOf('/save') === 0) {
      event.respondWith(handleSaveRequest(event.request, url.pathname.substr('/save'.length)));
      return;
    }
    if (blacklisted_prefixes.some(function(prefix) {
        return url.pathname.indexOf(prefix) == 0;
      })) {
      statAddResult(event.request.url, CACHE_SKIPPED);
      return;
    }
  }
  if (url.host === 'www.google-analytics.com') {
    return;
  }
  event.respondWith(getCachedResponse(event.request));
}

self.addEventListener('install', onInstall);
self.addEventListener('activate', onActivate);
self.addEventListener('fetch', onFetch);
