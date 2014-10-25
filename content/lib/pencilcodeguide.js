// pencilcodeguide.js

// This short script should be included on any web page
// that you want to use as a sidebar guide in Pencil Code.
// It knows how to communicate with the outer frame.

(function(global) {

  // Look at the current script to get the origin domain.
  var scripts = document.getElementsByTagName('script');
  var src = absoluteUrl(scripts.length && scripts[scripts.length - 1].src);
  var origin = src.replace(/^(https?:\/\/[^\/]*)(?:\/.*)?$/, "$1");

  // calculates an absolute URL
  function absoluteUrl(url) {
    if (!url) return null;
    var absoluteUrlAnchor = document.createElement('a');
    absoluteUrlAnchor.href = url;
    return {
      url: absoluteUrlAnchor.href,
      hostname: absoluteUrlAnchor.hostname
    }
  }

  var events = {};
  var queries = {};

  function trigger(name) {
    if (events.hasOwnProperty(name)) {
      var listeners = events[name];
      var args = Array.prototype.slice.call(arguments, 1);
      for (var j = 0; j < listeners.length; ++j) {
        listeners[j].apply(null, args);
      }
    }
  }

  var state = null;

  window.addEventListener('message', function(event) {
    var data = event.data;
    if (event.source != window.parent ||
        event.origin != origin ||
        !data || 'object' != typeof data || !data.type) {
      return;
    }
    if (data.type == 'response') {
      state = data.state;
      if (data.id != null) {
        if (queries.hasOwnProperty(data.id)) {
          var cb = queries[data.id];
          delete queries[data.id];
          if (cb) { cb(state); }
        }
      } else {
        trigger(data.type, state);
      }
    }
  });

  global.PencilCodeGuide = {
    newurl: function() {
      global.parent.postMessage({
        type: 'guideurl', url: window.location.href}, '*');
    },
    allow: function(url) {
      global.parent.postMessage({
        type: 'allow', url: absoluteUrl(url)}, '*');
    },
    login: function(options) {
      global.parent.postMessage({
        type: 'login', options: options}, '*');
    },
    query: function(callback) {
      var id = null;
      if (callback) {
        id = new Date % 86400000 + Math.random();
        queries[id] = callback;
      }
      global.parent(postMessage({type: 'query', id: id}, '*'));
    },
    state: function() {
      return state;
    },
    hide: function() {
      global.parent.postMessage({type: 'hide'}, '*');
    },
    show: function() {
      global.parent.postMessage({type: 'show'}, '*');
    },
    on: function(name, fn) {
      if (!events.hasOwnProperty(name)) {
        events[name] = [];
      }
      events[name].push(fn);
    }
  };

  global.PencilCodeGuide.newurl();

})(this);

