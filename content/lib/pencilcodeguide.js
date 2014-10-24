// pencilcodeguide.js

// This short script should be included on any web page
// that you want to use as a sidebar guide in Pencil Code.
// It knows how to communicate with the outer frame.

(function(global) {

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

  global.PencilCodeGuide = {
    newurl: function() {
      global.parent.postMessage({
        type: 'guideurl', url: window.location.href}, '*');
    },
    allow: function(url) {
      global.parent.postMessage({
        type: 'allow', url: absoluteUrl(url)}, '*');
    },
    hide: function() {
      global.parent.postMessage({type: 'hide'}, '*');
    },
    show: function() {
      global.parent.postMessage({type: 'show'}, '*');
    }
  };

  global.PencilCodeGuide.newurl();

})(this);

