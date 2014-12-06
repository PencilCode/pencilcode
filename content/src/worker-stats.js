// Some stats for this service worker session.

var CACHE_HIT = 'hit';
var CACHE_MISS = 'miss';
var CACHE_ERROR = 'error';
var CACHE_UPDATED = 'updated';
var CACHE_FALLBACK = 'fallback';
var CACHE_SKIPPED = 'skip';

(function() {
  var cache_hits = 0;
  var cache_misses = 0;
  var cache_errors = 0;
  var cache_activity = {};
  var max_cache_activity = 30;
  var result_handler = {
    hit: function() { ++cache_hits; },
    miss: function() { ++cache_misses; },
    error: function() { ++cache_errors; }
  };

  var stats_page = '/worker-stats.html';

  function addResult(url, result) {
    if (!(url in cache_activity))
      cache_activity[url] = [];
    cache_activity[url].push(result);
    if (result in result_handler)
      (result_handler[result])();
  }

  function handlePageRequest(request, path) {
    if (path === '/killcache') {
      return killCache();
    }
    if (path === '/get') {
      return getStats();
    }
    return getStatsPage();
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
            recent_requests: Object.keys(cache_activity).map(function(key) {
              return [key].concat(cache_activity[key]);
            })
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
          return getStatsPage();
        })
      .then(function() {
          return new Response('OK');
        });
  }

  function getStatsPage() {
    return getCachedResponse(new Request(stats_page));
  }

  self.stats = {
    addResult: addResult,
    handlePageRequest: handlePageRequest,
    prefetch: getStatsPage,
  };
})();

