// pencilcodeembed.js

// To embed a pencil code editor:
// 1. Load this script either with a script tag
//    or using an AMD loader like require.js.
//    If loading using require.js, then the class
//    name will be packagename.PencilCodeEmbed.
// 2. Create a div on your page.
// 3. var pce = new PencilCodeEmbed(div);
// 4. pce.setCode('pen red\nfd 100');
//
// This script does not yet support capturing
// events from the editor.  That will come
// in a future version.
(function(global) {
  // For testing, add a .dev domain suffix when this script
  // is served from a .dev domain.
  var scripts = document.getElementsByTagName('script');
  var dev = (scripts.length && /^(?:(?:https?:)?\/\/)?[^\/]*\.dev\//.test(
        scripts[scripts.length - 1].src)) ? '.dev' : '';
  var PencilCodeEmbed = (function() {
    function PencilCodeEmbed(div) {
      this.div = div;
    }
    var proto = PencilCodeEmbed.prototype;
    proto.setCode = function(code) {
      this.div.innerHTML = '';
      this.iframe = document.createElement('iframe');
      this.iframe.style.width = '100%';
      this.iframe.style.height = '100%';
      this.div.appendChild(this.iframe);
      // The "frame" username is magic: it puts
      // Pencil Code into a frame-friendly mode.
      this.iframe.src =
        'http://frame.pencilcode.net' + dev +
        '/edit/frame#text=' +
        encodeURIComponent(code);
    };
    return PencilCodeEmbed;
  })();
  if (global.define && global.define.amd) {
    // Support AMD-style loading, if present.
    define(function() {
      return {
        PencilCodeEmbed: PencilCodeEmbed
      };
    });
  } else {
    // Otherwise, just set the global symbol.
    global.PencilCodeEmbed = PencilCodeEmbed
  }
})(this);
