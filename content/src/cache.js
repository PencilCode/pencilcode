///////////////////////////////////////////////////////////////////////////
// CACHE SUPPORT
///////////////////////////////////////////////////////////////////////////

var see = require('see');

eval(see.scope('cache'));

var cache = window.pencilcode.cacheObj = {};

var model = window.pencilcode.cache = {
  put: put,
  get: get,
  delete: deleteCache,
  clear: clearCache
};

/** Initialize the cache object to the given name only if it's not available already.
 * 
 * @param {string} name
 * @returns {undefined}
 */
function initializeCache(name) {
  if (!cache[name]) {
    cache[name] = {};
  }
}

/** Delete the cache object mapped with the given name
 * 
 * @param {string} name
 * @returns {undefined}
 */
function deleteCache(name) {
  delete cache[name];
}

/** Ceear the complete cache
 * @returns {undefined}
 */
function clearCache(){
  cache = window.pencilcode.cacheObj = {};
}

/** Return the cached value mapped with the given name and key
 * 
 * @param {string} cacheName
 * @param {string} key
 * @returns {unresolved}
 */
function get(cacheName, key) {
    if (cache[cacheName]) {
      return cache[cacheName][key];
    }
    return null;
}

/** Save the given value mapped with the given name and key
 * 
 * @param {type} cacheName
 * @param {type} key
 * @returns {undefined}
 */
function put(cacheName, key, value) {
    initializeCache(cacheName);
    cache[cacheName][key] = value;
}

module.exports = model;
