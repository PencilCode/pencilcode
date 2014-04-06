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

  // makes new unique id not found in any other DOM element
  function generateNewRandomId() {
    while (true) {
      var ID_LENGTH = 12;
      var generatedId = '';
      for (var i = 0; i < ID_LENGTH; i++) {
        generatedId += String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
      if (!document.getElementById(generatedId)) {
        return generatedId;
      }
    }
  }

  // makes secret for cross-frame communications
  function makeSecret() {
    var alphanumericChars = (
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
    var SECRET_LENGTH = 64;

    // A random string used to verify messages sent from the iframed window.
    var secret = ''
    for (var i = 0; i < SECRET_LENGTH; i++) {
      secret += alphanumericChars.charAt(
          Math.floor(Math.random() * alphanumericChars.length));
    }

    return secret;
  }

  // For testing, add a .dev domain suffix when this script
  // is served from a .dev domain.
  var scripts = document.getElementsByTagName('script');
  var dev = (scripts.length && /^(?:(?:https?:)?\/\/)?[^\/]*\.dev\//.test(
        scripts[scripts.length - 1].src)) ? '.dev' : '';

  // The "frame" username is magic: it puts
  // Pencil Code into a frame-friendly mode.
  var targetDomain = 'http://frame.pencilcode.net' + dev;
  var targetUrl = targetDomain + '/edit/frame';
  var secret = makeSecret();
  var tagId = generateNewRandomId();

  // send messages to the remote iframe
  function invokeRemote(iframeParent, method, args) {
    var payload = {
        methodName: method,
        args: args,
        tagId: tagId,
        secret: secret};
    iframeParent.iframe.contentWindow.postMessage(
        JSON.stringify(payload), targetUrl);
  };

  var PencilCodeEmbed = (function() {
    function PencilCodeEmbed(div) {
      this.div = div;
    }

    var proto = PencilCodeEmbed.prototype;

    proto.beginLoad = function() {
       var that = this;

       window.addEventListener('message', function(evt) {
          // check origin
          if (event.origin != targetDomain) {
            return false;
          }

          // parse event data
          try {
            var data = JSON.parse(evt.data);
          } catch(error) {
            return;
          }

          // verify that the message comes with a secret
          if (!data.secret || data.secret !== secret) {
            return;
          }

          // verify that the message comes to the right destination
          if (!data.tagId || data.tagId !== tagId) {
            return;
          }

          switch (data.methodName) {
            case 'onLoadComplete':
              if (that.onLoadComplete) {
                that.onLoadComplete();
              }
              break;
            case 'onDirty':
              if (that.onDirty) {
                that.onDirty(data.args[0]);
              }
              break;
            case 'onRunComplete':
              if (that.onRunComplete) {
                that.onRunComplete();
              }
              break
            default:
              return false;
          }
       });

      this.div.innerHTML = '';
      this.iframe = document.createElement('iframe');
      this.iframe.setAttribute('id', this.tagId);
      this.iframe.style.width = '100%';
      this.iframe.style.height = '100%';
      this.div.appendChild(this.iframe);

      this.iframe.src =
        targetUrl +
        '#text=' + encodeURIComponent('') +
        '&tagId=' + tagId +
        '&secret=' + secret;
    };

    // gets code from the editor
    proto.setCode = function(code) {
      invokeRemote(this, 'setCode', [code]);
    };

    // starts running
    proto.beginRun = function() {
      invokeRemote(this, 'beginRun', []);
    };

    // makes editor editable
    proto.setEditable = function() {
      invokeRemote(this, 'setEditable', []);
    };

    // makes editor read only
    proto.setReadOnly = function() {
      invokeRemote(this, 'setReadOnly', []);
    };

    // hides editor
    proto.hideEditor = function() {
      invokeRemote(this, 'hideEditor', []);
    };

    // shows editor
    proto.showEditor = function() {
      invokeRemote(this, 'showEditor', []);
    };

    // hides middle button
    proto.hideMiddleButton = function() {
      invokeRemote(this, 'hideMiddleButton', []);
    };

    // shows middle button
    proto.showMiddleButton = function() {
      invokeRemote(this, 'showMiddleButton', []);
    };

    // show butter bar notification
    proto.showNotification = function(message) {
      invokeRemote(this, 'showNotification', [message]);
    };

    // hides butter bar notification
    proto.hideNotification = function() {
      invokeRemote(this, 'hideNotification', []);
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
