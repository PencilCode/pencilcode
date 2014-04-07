// pencilcodeembed.js

// This script allows you to embed a pencil code editor and
// debugger into your web page. You can control appearance,
// execute actions and receive various events from the editor.
// This script uses postMessags() for cross-frame communications.
//
// To embed a pencil code editor into your web page:
//
// 1. Load this script either with a script tag
//    or using an AMD loader like require.js.
//    If loading using require.js, then the class
//    name will be packagename.PencilCodeEmbed.
// 2. Create a div on your page.
// 3. var pce = new PencilCodeEmbed(div);
//    pce.beginLoad();
// 4. onLoadComplete() will be called when loading completes.
// 5. pce.setCode('pen red\nfd 100');
//    pce.beginRun();
// 6. onRunComplete() will be called when execution completes.
// 7. onDirty() will be called every time editor content changes.
//
// Here is a complete example:
//
//  var smiley = [
//    'speed 5',
//    'dot yellow, 160',
//    'fd 20',
//    'rt 90',
//    'fd 25',
//    'dot black, 20',
//    'bk 50',
//    'dot black, 20',
//    'bk 5',
//    'rt 90',
//    'fd 40',
//    'pen black, 7',
//    'lt 30',
//    'lt 120, 35'
//  ];
//
//  var pce = new PencilCodeEmbed(document.getElementById('pencil'));
//  pce.onDirty = function(code) {
//    console.log('new code: ' + code);
//  };
//  pce.onLoadComplete = function() {
//    console.log('load complete');
//    pce.hideEditor();
//    pce.hideMiddleButton();
//    pce.setReadOnly();
//    pce.showNotification('Pay attention to the Turtle!');
//    setTimeout(function(){
//      pce.hideNotification();
//      pce.setCode(smiley.join('\n'));
//      pce.onRunComplete = function () {
//        console.log('run complete');
//        pce.showNotification('Turtle is smart! Let\'s make it smarter!');
//        setTimeout(function(){
//          pce.hideNotification();
//          pce.showEditor();
//          pce.showMiddleButton();
//          pce.setEditable();
//        }, 2000);
//      };
//      pce.beginRun();
//    }, 2000);
//  };
//  pce.beginLoad();
//
// Enjoy!

(function(global) {

  // makes secret for cross-frame communications
  function makeSecret() {
    var SECRET_LENGTH = 64;

    var secret = '';
    for (var i = 0; i < SECRET_LENGTH; i++) {
      secret += String.fromCharCode(65 + Math.floor(Math.random() * 26));
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

  // send messages to the remote iframe
  function invokeRemote(iframeParent, method, args) {
    var payload = {
        methodName: method,
        args: args,
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

          // check the event is from the child we know about
          if (event.source !== that.iframe.contentWindow) {
            return false;
          }

          // parse event data
          try {
            var data = JSON.parse(evt.data);
          } catch(error) {
            return false;
          }

          // invoke method
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
              break;
            default:
              return false;
          }

          return true;
       });

      this.div.innerHTML = '';
      this.iframe = document.createElement('iframe');
      this.iframe.style.width = '100%';
      this.iframe.style.height = '100%';
      this.div.appendChild(this.iframe);

      this.iframe.src =
        targetUrl +
        '#text=' + encodeURIComponent('') +
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
