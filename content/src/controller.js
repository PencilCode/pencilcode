///////////////////////////////////////////////////////////////////////////
// MODEL, CONTROLLER SUPPORT
///////////////////////////////////////////////////////////////////////////

var $                = require('jquery'),
    view             = require('view'),
    storage          = require('storage'),
    thumbnail        = require('thumbnail'),
    debug            = require('debug'),
    filetype         = require('filetype'),
    guide            = require('guide'),
    seedrandom       = require('seedrandom'),
    see              = require('see'),
    pencilTracer     = require('pencil-tracer'),
    icedCoffeeScript = require('iced-coffee-script'),
    drawProtractor   = require('draw-protractor'),
    cache          = require('cache');


eval(see.scope('controller'));

var model = window.pencilcode.model = {
  // Owner name of this file or directory.
  ownername: null,
  // True if /edit/ url.
  editmode: false,
  // Used by framers: an array of extra script for the preview pane, to
  // scaffold instructional examples.  See filetype.js wrapTurtle and
  // PencilCodeEmbed.setupScript to see how extra scripts are passed through.
  setupScript: null,
  // Url used for starting the guide.
  guideUrl: null,
  // Contents of the three panes.
  tempThumbnail: null,
  pane: {
    alpha: {
      filename: null,
      isdir: false,
      data: null,
      bydate: false,
      loading: 0
    },
    bravo: {
      filename: null,
      isdir: false,
      data: null,
      bydate: false,
      loading: 0
    },
    charlie: {
      filename: null,
      isdir: false,
      data: null,
      bydate: false,
      loading: 0
    }
  },
  // Logged in username, or null if not logged in.
  username: null,
  // Three digit passkey, hashed from password.
  passkey: null,
  // secrets passed in from the embedding frame via
  // window.location.hash
  crossFrameContext: getCrossFrameContext()
};

function logEvent(name, data) {
  $.get('/log/' + name, data);
}

// Log events interesting for academic study: how often code is
// run, which code it is, and which mode the editor is in.
function logCodeEvent(action, filename, code, mode, lang) {
  var c = encodeURIComponent(code.substring(0, 1024)).
          replace(/%20/g, '+').replace(/%0A/g, '|').replace(/%2C/g, ','),
      m = mode ? 'b' : 't', l = lang ? lang : 'n';
  if (l == 'javascript') {
    l = 'js';
  } else if (l == 'coffeescript') {
    l = 'cs';
  }
  $.get('/log/' + filename + '?' +
      action + '&mode=' + m + '&lang=' + l + '&code=' + c);
}

//
// Retrieve model.pane object given position.  It will be one of
// the alpha, bravo or charlie objects from above.
//
// Parameters:
//    pos: Position is one of 'left', 'back' or 'right', which maps
//         to a class name of the element in the html
//
function modelatpos(pos) {
  return model.pane[paneatpos(pos)];
}

//
// Retrieve pane ID corresponding to given position.
//
// Parameters:
//    pos: Position is one of 'left', 'back' or 'right', which maps
//         to a class name of the element in the html
//
function paneatpos(pos) {
  return view.paneid(pos);
}

function posofpane(pane) {
  return view.panepos(pane);
}

//
// Special owner is defined as one of:
//   Nobody is the owner of this file/directory OR
//   it's the guide who's the owner OR
//   it's the event who's the owner
//
function specialowner() {
  return (!model.ownername || model.ownername === 'guide' ||
          model.ownername === 'gymstage' ||
          model.ownername === 'share' ||
          model.ownername === 'example' ||
          model.ownername === 'frame' ||
          model.ownername === 'event');
}

//
// A no-save owner is an owner that does not participate in saving
// or loading at all.  This is the case for framed usage.
//
function nosaveowner() {
  return model.ownername === 'frame';
}

function cansave() {
  return specialowner() || !model.username || model.tempThumbnail ||
      view.isPaneEditorDirty(paneatpos('left'));
}

function updateTopControls(addHistory) {
  var m = modelatpos('left');
  // Update visible URL and main title name.
  view.setNameText(m.filename);
  var slashed = m.filename;
  if (m.isdir && slashed.length) { slashed += '/'; }
  updateVisibleUrl('/edit/' + slashed, model.guideUrl, addHistory)
  // Update top buttons.
  var buttons = [];

  //
  // If we're not in edit-mode, then push button to enter edit mode
  //

  if (!model.editmode) {
    buttons.push({id: 'editmode', label: 'Edit'});
  } else {
    //
    // Otherwise check if we have a data file
    //

    if (m.data && m.data.file) {
      //
      // If so, then insert save button
      //
      buttons.push(
        {
          id: 'save',
          title: 'Save program (Ctrl+S)',
          label: 'Save',
          menu: [
            { id: 'save2', label: 'Save' },
            { id: 'saveas', label: 'Copy and Save As...' },
            { id: 'download',label: 'Save code on local machine'},
            { id: 'download1', label: 'Download Html and Css'}
          ],
          disabled: !cansave(),
        }, {
          id: 'screenshot',
          title: 'Take screenshot',
          label: '<i class="fa fa-camera"></i>'
        });

      // Also insert share button
      if (!specialowner() || !model.ownername) {
        buttons.push({
          id: 'share', title: 'Share links to this program', label: 'Share'});
      }
    }

    //
    // If this directory is owned by some person (i.e. not specialowner)
    //

    if (!specialowner()) {

      // Applies to both files and dirs: a simple "new file" button.
      buttons.push({
        id: 'new', title: 'Make a new program', label: 'New'});

      //
      // Then insert logout/login buttons depending on if someone
      // is already logged in
      //
      if (model.username) {
        buttons.push({
          id: 'logout', label: 'Log out',
          title: 'Log out from ' + model.username});
      } else {
        buttons.push({
          id: 'login', label: 'Log in',
          title: 'Enter password for ' + model.ownername});
      }
    } else {
      // We're either in some file or directory
      if (m.isdir) {
        //
        // If it's a directory then allow browsing by date
        // or by alphabetical
        //

        if (m.bydate) {
          buttons.push({id: 'byname', label: 'Alphabetize'});
        } else {
          buttons.push({id: 'bydate', label: 'Sort by Date'});
        }
      } else if (!nosaveowner()) {
        buttons.push({
          id: 'login', label: 'Log in',
          title: 'Log in and save'});
      }
    }
    buttons.push(
        {id: 'help', label: '<span class=helplink>?</span>' });
    if (m.data && m.data.file) {
      buttons.push({
        id: 'guide', label: '<span class=helplink>Guide</span>',
        title: 'Open online guide'});
    }

    //
    // If this directory has an owner (i.e., not the root owner),
    // enable splitscreen toggle.
    //

    if (model.ownername || m.filename) {
      buttons.push({
          id: 'splitscreen',
          title: 'Toggle split screen',
          label: '<i class="splitscreenicon"></i>'
      });
    }

  }
  // buttons.push({id: 'done', label: 'Done', title: 'tooltip text'});
  view.showButtons(buttons);
  // Update middle button.
  if (m.data && m.data.file ||
      (modelatpos('right').data && modelatpos('right').data.file)) {
    view.showMiddleButton('run');
  } else {
    view.showMiddleButton('');
  }
  // Also if we're runnable, show an empty runner in the right.
  // Is this helpful or confusing?
  if (m.data && m.data.file) {
    if (!modelatpos('right').running) {
      var doc = view.getPaneEditorData(paneatpos('left'));
      // The last flag here means: run the supporting scripts
      // but not the main program.
      runCodeAtPosition('right', doc, m.filename, true);
    }
  }
  // Update editability.
  view.setNameTextReadOnly(!model.editmode);
  view.setPaneEditorReadOnly(paneatpos('right'), true);
  view.setPaneEditorReadOnly(paneatpos('back'), true);
  view.setPaneEditorReadOnly(paneatpos('left'), !model.editmode);
}

//
// Set up some logging event handlers.
//

view.on('selectpalette', function(pane, palname) {
  if (!palname) { palname = 'default'; }
  logEvent('~selectpalette', {name: palname.replace(/\s/g, '').toLowerCase()});
});

view.on('pickblock', function(pane, blockid) {
  logEvent('~pickblock', { id: blockid });
});

//
// Now setup event handlers.  Each event handler corresponds to
// an ID (as specified in updateTopControls() above) and
// an event handler function
//

view.on('help', function() {
  view.flashNotification('<a href="//group.' +
     window.pencilcode.domain + '/" target="_blank">Ask a question.</a>' +
    (model.username ?
        '&emsp; <a id="setpass" href="#setpass">Change password.</a>' : '')
  );
});

view.on('tour', function() {
  // view.flashNotification('Tour coming soon.');
  setTimeout(function() { view.flashNotification('Tour coming soon.');}, 0);
});

view.on('new', function() {
  if (modelatpos('left').isdir) {
    handleDirLink(paneatpos('left'), '#new');
    return;
  }
  var directoryname =
      modelatpos('left').filename.replace(/(?:^|\/)[^\/]*$/, '/');
  // Load the directory listing to find an unused name.
  storage.loadFile(model.ownername, directoryname, false, function(m) {
    var untitled = 'untitled';
    if (m.directory && m.list) {
      untitled = chooseNewFilename(m.list);
    }
    if (directoryname == '/') {
      directoryname = '';
    }
    window.location.href = '/edit/' + directoryname + untitled;
  });
});

var lastSharedName = '';

view.on('share', function() {
  var shortfilename = modelatpos('left').filename.replace(/^.*\//, '');
  if (!shortfilename) { shortfilename = 'clip'; }
  var doc = view.getPaneEditorData(paneatpos('left'));
  if (isEmptyDoc(doc)) { return; }
  // First save if needed (including login user if necessary)
  if (view.isPaneEditorDirty(paneatpos('left'))) {
    saveAction(false, 'Log in to share', shareAction);
  } else {
    shareAction();
  }
  function shareAction() {
    // Then attempt to save on share.pencilcode.net
    var prefix = (60466175 - (Math.floor((new Date).getTime()/1000) %
        (24*60*60*500))).toString(36);
    var sharename =
        prefix + "-" + model.ownername + "-" +
        shortfilename.replace(/[^\w\.]+/g, '_').replace(/^_+|_+$/g, '');
    if (lastSharedName.substring(prefix.length) ==
        sharename.substring(prefix.length)) {
      // Don't pollute the shared space with duplicate code; use the
      // same share filename if the code is the same.
      sharename = lastSharedName;
    }
    if (!doc) {
      // There is no editor on the left (or it is misbehaving) - do nothing.
      console.log("Nothing to share.");
      return;
    } else if (doc.data !== '') { // If program is not empty, generate thumbnail.
      if (model.tempThumbnail) {
        postThumbnailGeneration(model.tempThumbnail);
      } else {
        var iframe = document.getElementById('output-frame');
        // `thumbnail.generateThumbnailDataUrl` second parameter is a callback.
        thumbnail.generateThumbnailDataUrl(iframe, postThumbnailGeneration);
      }
    }
    function postThumbnailGeneration(thumbnailDataUrl) {
      var data = $.extend({
        thumbnail: thumbnailDataUrl
      }, modelatpos('left').data, doc);
      storage.saveFile('share', sharename, data, true, 828, false, function(m) {
        var opts = { title: shortfilename };
        if (!m.error && !m.deleted) {
          opts.shareStageURL = "//share." + window.pencilcode.domain +
              "/home/" + sharename;
        }
        if (model.ownername) {
          // Share the run URL unless there is no owner (e.g., for /first).
          opts.shareRunURL = "//" + document.domain + '/home/' +
              modelatpos('left').filename;
        }
        opts.shareEditURL = window.location.href;
        // Now bring up share dialog
        view.showShareDialog(opts);
      });
    }
  }
});

view.on('fullscreen', function(pane) {
  function showfullscreen() {
    var w = window.open("/home/" + model.pane[pane].filename,
         "run-" + model.ownername);
    if (!w || w.closed) {
      view.showDialog({
        prompt:'Saved.', content: '<p>Will open full page.</p>' +
            '<button class="ok">OK</button> ' +
            '<button class="cancel">Cancel</button>',
        done: function(s) { s.update({cancel:true}); showfullscreen(); }});
    } else {
      w.focus();
    }
  }
  if (view.isPaneEditorDirty(paneatpos('left'))) {
    if (model.ownername == model.username) {
      // Open immediately to avoid popup blocker.
      showfullscreen();
    }
    saveAction(false, 'Log in to save', showfullscreen);
  } else {
    showfullscreen();
  }
});

view.on('bydate', function() {
  if (modelatpos('left').isdir) {
    modelatpos('left').bydate = true;
    var pane = paneatpos('left');
    updateSortResults(pane);
  }
});

view.on('byname', function() {
  if (modelatpos('left').isdir) {
    modelatpos('left').bydate = false;
    var pane = paneatpos('left');
    updateSortResults(pane);
  }
});


view.on('search', function(pane, search, cb) {
  updateSearchResults(pane, search, cb);
});

view.on('dirty', function(pane) {
  if (posofpane(pane) == 'left') {
    view.enableButton('save', cansave());
    view.enableButton('save2', cansave());
    // Toggle button between triangle and refresh.
    view.showMiddleButton('run');
  }
});

view.on('changelines', function(pane) {
  // End debugging session when number of lines is changed.
  if (posofpane(pane) == 'left') {
    debug.bindframe(null);
  }
});

view.on('editfocus', function(pane) {
  if (posofpane(pane) == 'right') {
    rotateModelLeft(true);
  }
});

view.on('changehtmlcss', function(pane) {
  if (posofpane(pane) != 'left' || debug.stopButton()) {
    return;
  }
  var doc = view.getPaneEditorData(pane);
  var newdata = $.extend({}, modelatpos('left').data, doc);
  var filename = modelatpos('left').filename;
  runCodeAtPosition('right', newdata, filename, true);
  view.showMiddleButton('run');
  saveDefaultMeta(doc.meta);
});

view.on('run', runAction);

function runAction() {
  var doc = view.getPaneEditorData(paneatpos('left'));
  if (!doc) {
    doc = view.getPaneEditorData(paneatpos('right'));
    if (!doc) {
      console.log('Nothing to run.');
      return;
    }
    cancelAndClearPosition('back');
    rotateModelLeft(true);
  }
  if (!view.getPreviewMode()) {
    view.setPreviewMode(true, true /* no animation */);
  }
  // Hide the guide, if any
  if (guide.isVisible()) {
    guide.show(false);
    // Blink the guide button.
    // view.flashButton('guide');
    // Let the animation complete before running.
    setTimeout(runAction, 500);
    return;
  }
  // Grab the code.
  var newdata = $.extend({}, modelatpos('left').data, doc);
  var filename = modelatpos('left').filename;
  view.clearPaneEditorMarks(paneatpos('left'));
  if (!specialowner()) {
    // Save file (backup only)
    storage.saveFile(model.ownername, filename, newdata, false, null, true);
  }
  // Provide instant (momentary) feedback that the program is now running.
  debug.stopButton('flash');
  view.publish('startExecute');
  runCodeAtPosition('right', newdata, filename, false);
  logCodeEvent('run', filename, newdata.data,
      view.getPaneEditorBlockMode(paneatpos('left')),
      view.getPaneEditorLanguage(paneatpos('left')));
  if (!specialowner()) {
    // Remember the most recently run program.
    cookie('recent', window.location.href,
        { expires: 7, path: '/', domain: window.pencilcode.domain });
  }
}

$(window).on('beforeunload', function() {
  if (view.isPaneEditorDirty(paneatpos('left')) && !nosaveowner()) {
    view.flashButton('save');
    return "There are unsaved changes."
  }
});
//Saves the Main code on our local machine
view.on('download', function() {
uriContent = "data:application/octet-stream," + encodeURIComponent("Main Code"+"\n\n"+newdata.data);
window.open(uriContent, 'neuesDokument');
});
//Saves HTML and CSS on your local machine
view.on('download1', function() {
  urlContent = "data:application/octet-stream," + encodeURIComponent("HTML"+"\n\n"+window.downloadhtml+"\n\n"+"CSS"+"\n\n"+window.downloadcss);
window.open(urlContent, 'neuesDokument');
});

view.on('logout', function() {
  model.username = null;
  model.passkey = null;
  // Erase some cookies after logout.
  cookie('login', '', { expires: -1, path: '/' });
  cookie('recent', '',
      { expires: -1, path: '/', domain: window.pencilcode.domain });
  updateTopControls(false);
  view.flashNotification('Logged out.');
});

view.on('login', function() {
  if (specialowner()) {
    saveAction(false, 'Log in and save.', null);
    return;
  }
  view.showLoginDialog({
    prompt: 'Log in.',
    username: model.ownername,
    validate: function(state) { return {}; },
    switchuser: signUpAndSave,
    done: function(state) {
      model.username = model.ownername;
      model.passkey = keyFromPassword(model.username, state.password);
      state.update({info: 'Logging in...', disable: true});
      storage.setPassKey(
          model.username, model.passkey, model.passkey,
      function(m) {
        if (m.needauth) {
          state.update({info: 'Wrong password.', disable: false});
          model.username = null;
          model.passkey = null;
          return;
        } else if (m.error) {
          state.update({info: 'Could not log in.', disable: false});
          model.username = null;
          model.passkey = null;
          return;
        }
        state.update({cancel: true});
        saveLoginCookie();
        if (!specialowner()) {
          cookie('recent', window.location.href,
              { expires: 7, path: '/', domain: window.pencilcode.domain });
        }
        updateTopControls();
        view.flashNotification('Logged in as ' + model.username + '.');
      });
    }
  });
});

view.on('setpass', function() {
  view.showLoginDialog({
    prompt: 'Change password.',
    username: model.ownername,
    setpass: true,
    validate: function(state) {
      if (state.password === state.newpass) {
        return { disable: true };
      } else {
        return { disable: false };
      }
    },
    done: function(state) {
      var oldpasskey = keyFromPassword(model.ownername, state.password);
      var newpasskey = keyFromPassword(model.ownername, state.newpass);
      state.update({info: 'Changing password...', disable: true});
      storage.setPassKey(model.ownername, newpasskey, oldpasskey,
      function(m) {
        if (m.needauth) {
          state.update({info: 'Wrong password.', disable: false});
          return;
        } else if (m.error) {
          state.update({info: 'Could not change password.', disable: false});
          return;
        }
        state.update({cancel: true});
        model.username = model.ownername;
        model.passkey = newpasskey;
        saveLoginCookie();
        if (!specialowner()) {
          cookie('recent', window.location.href,
              { expires: 7, path: '/', domain: window.pencilcode.domain });
        }
        updateTopControls();
        view.flashNotification('Changed password for ' + model.username + '.');
      });
    }
  });
});

view.on('screenshot', function() {
  var iframe = document.getElementById('output-frame');
  // `thumbnail.generateThumbnailDataUrl` second parameter is a callback.
  thumbnail.generateThumbnailDataUrl(iframe, function(thumbnailDataUrl) {
    model.tempThumbnail = thumbnailDataUrl;
    updateTopControls();
    view.flashThumbnail(thumbnailDataUrl);
  });
});

view.on('save', function() { saveAction(false, null, null); });
view.on('save2', function() { saveAction(false, null, null); });
view.on('saveas', saveAs);

view.on('overwrite', function() { saveAction(true, null, null); });
view.on('guide', function() {
  if (!model.guideUrl) {
    window.open(
       '//guide.' + window.pencilcode.domain + '/home/');
    return;
  }
  guide.show(!guide.isVisible());
});

guide.on('guideurl', function(guideurl) {
  readNewUrl.suppress = true;
  updateVisibleUrl(window.location.pathname, guideurl, false);
  readNewUrl.suppress = false;
});

function guideHash(guideurl) {
  return guideurl ? '#guide=' + (/[&#%]/.test(guideurl) ?
      encodeURIComponent(guideurl) : encodeURI(guideurl)) : '';
}

function updateVisibleUrl(baseurl, guideurl, addHistory) {
  model.guideUrl = guideurl;
  view.setVisibleUrl(baseurl + guideHash(guideurl), addHistory);
}

guide.on('login', function(options) {
  if (!options) {
    options = {
      oldonly: true,
      center: true
    };
  }
  signUpAndSave(options);
});

// Used by a guide to set up a starting doc (or a remembered doc).
var currentGuideSessionUrl = null;
var currentGuideSessionFilename = null;
var currentGuideSessionTimer = null;
var currentGuideSessionSaveTime = 0;

guide.on('session', function session(options) {
  var url = options.url,
      match = !url ? null :
        /^(?:(?:\w+:)?\/\/(\w+)\.\w+[^\/]{8})?(?:\/\w+\/([^#?]*))?$/.exec(url);
      ownername = match && match[1] || '',
      filename = match && match[2] || options.filename || 'untitled';
  if (options.remove || options.reset) {
    localStorage.removeItem('pcgs:' + url);
    if (options.remove) return;
  }
  currentGuideSessionUrl = url;
  currentGuideSessionFilename = filename;
  // Set up palette if requested.
  if (options.palette || options.modeOptions) {
    view.setPaneEditorBlockOptions(paneatpos('left'),
         options.palette, options.modeOptions);
  }
  // Look for session from localStorage
  var saved = localStorage.getItem('pcgs:' + url);
  if (saved) {
    try { saved = JSON.parse(saved); } catch (e) { saved = null; }
  }
  if (options && options.age && saved && (!saved.mtime ||
      saved.mtime < (new Date).getTime() - options.age)) {
    saved = null;
  }
  // Do nothing if we are already at the right filename (any user).
  if (!saved && !options.reset) {
    var cm = model.pane[paneatpos('left')];
    if (filename == cm.filename && cm.data && cm.data.data) {
      return;
    }
  }
  var doc = $.extend({}, options);
  if (saved) {
    $.extend(doc, saved);
  }
  // If we have data, load it right away; otherwise load it from the url.
  if (doc.data != null) {
    setupEditor();
  } else {
    storage.loadFile(ownername, filename, true, function(loptions) {
      if (loptions.error) {
        view.flashNotification(loptions.error);
        return;
      }
      doc = $.extend(loptions, options);
      setupEditor();
    });
  }
  function setupEditor() {
    var pane = paneatpos('left');
    var mpp = model.pane[pane];
    if (!doc.file) { doc.file = 'setdoc'; }
    mpp.isdir = false;
    mpp.data = doc;
    var mode = doc.hasOwnProperty('blocks') ?
        !falsish(doc.blocks) : loadBlockMode();
    mpp.filename = filename;
    mpp.isdir = false;
    mpp.bydate = false;
    mpp.loading = nextLoadNumber();
    mpp.running = false;
    view.setPaneEditorData(pane, doc, filename, mode);
    if (options.palette || options.modeOptions) {
      view.setPaneEditorBlockOptions(paneatpos('left'),
           options.palette, options.modeOptions);
    }
    updateTopControls();
  }
});

view.on('delta', function(pane) {
  // Listen to deltas if there is a guide session active.
  if (!currentGuideSessionUrl || !currentGuideSessionFilename ||
      currentGuideSessionTimer || posofpane(pane) != 'left' ||
      model.pane[pane].filename != currentGuideSessionFilename) {
    return;
  }
  // Save after every change, polling at most twice per second.
  var delay =
    Math.max(0, currentGuideSessionSaveTime + 500 - (new Date).getTime());
  currentGuideSessionTimer = setTimeout(function() {
    currentGuideSessionTimer = null;
    var doc = view.getPaneEditorData(pane);
    doc.mtime = currentGuideSessionSaveTime = +(new Date);
    if (doc && doc.data != null) {
      localStorage.setItem(
          'pcgs:' + currentGuideSessionUrl, JSON.stringify(doc));
    }
  }, delay);
});

view.on('toggleblocks', function(p, useblocks) {
  saveBlockMode(useblocks);
  var filename = model.pane[p].filename;
  var doc = view.getPaneEditorData(p),
      code = (doc && doc.data) || model.pane[p].data.data;
  logCodeEvent('toggle', filename, code, useblocks,
      view.getPaneEditorLanguage(p));
});

view.on('splitscreen', function() {
  view.setPreviewMode(!view.getPreviewMode());
});

function saveAction(forceOverwrite, loginPrompt, doneCallback) {
  if (nosaveowner()) {
    return;
  }
  if (specialowner()) {
    var options = {};
    if (loginPrompt) {
      options.prompt = loginPrompt;
    }
    signUpAndSave(options);
    return;
  }
  var doc = view.getPaneEditorData(paneatpos('left'));
  var filename = modelatpos('left').filename;
  var thumbnailDataUrl = '';
  if (!doc) {
    // There is no editor on the left (or it is misbehaving) - do nothing.
    console.log("Nothing to save.");
    return;
  } else if (doc.data !== '') { // If program is not empty, generate thumbnail
    if (model.tempThumbnail) {
      postThumbnailGeneration(model.tempThumbnail);
    } else {
      var iframe = document.getElementById('output-frame');
      // `thumbnail.generateThumbnailDataUrl` second parameter is a callback.
      thumbnail.generateThumbnailDataUrl(iframe, postThumbnailGeneration);
    }
  } else {  // Empty content, file delete, no need for thumbnail.
    postThumbnailGeneration('');
  }
  function postThumbnailGeneration(thumbnailDataUrl) {
    // Remember meta in a cookie.
    saveDefaultMeta(doc.meta);
    var newdata = $.extend({
      thumbnail: thumbnailDataUrl
    }, modelatpos('left').data, doc);
    if (newdata.auth && model.ownername != model.username) {
      // If we know auth is required and the user isn't logged in,
      // prompt for a login.
      logInAndSave(filename, newdata, forceOverwrite,
                   noteclean, loginPrompt, doneCallback);
      return;
    }
    // Attempt to save.
    view.flashNotification('', true);
    storage.saveFile(
        model.ownername, filename, newdata, forceOverwrite, model.passkey, false,
    function(status) {
      if (status.needauth) {
        logInAndSave(filename, newdata, forceOverwrite, noteclean,
                     loginPrompt, doneCallback);
      } else {
        if (!model.username) {
          // If not yet logged in but we have saved (e.g., no password needed),
          // then log us in.
          model.username = model.ownername;
        }
        handleSaveStatus(status, filename, noteclean);
        if (doneCallback) {
          doneCallback();
        }
      }
    });
    // After a successful save, mark the file as clean and update mtime.
    function noteclean(mtime) {
      view.flashNotification('Saved.');
      view.notePaneEditorCleanData(paneatpos('left'), newdata);
      logCodeEvent('save', filename, newdata.data,
          view.getPaneEditorBlockMode(paneatpos('left')),
          view.getPaneEditorLanguage(paneatpos('left')));
      if (modelatpos('left').filename == filename) {
        var oldmtime = modelatpos('left').data.mtime || 0;
        if (mtime) {
          modelatpos('left').data.mtime = Math.max(mtime, oldmtime);
        }
      }
      // Delete the pre-saved thumbnail from the model.
      model.tempThumbnail = null;
      updateTopControls();
      // Flash the thumbnail after the control are updated.
      view.flashThumbnail(thumbnailDataUrl);
    }
  }
}

function keyFromPassword(username, p) {
  if (!p) { return ''; }
  if (/^[0-9]{3}$/.test(p)) { return p; }
  var key = '';
  var prng = seedrandom('turtlebits:' + username + ':' + p + '.');
  for (var j = 0; j < 3; j++) {
    key += Math.floor(prng() * 10);
  }
  return key;
}

function letterComplexity(s) {
  var maxcount = 0, uniqcount = 0, dupcount = 0, last = null, count = {}, j, c;
  for (j = 0; j < s.length; ++j) {
    c = s.charAt(j);
    if (!(c in count)) {
      uniqcount += 1;
      count[c] = 0;
    }
    count[c] += 1;
    maxcount = Math.max(count[c], maxcount);
    if (c == last) { dupcount += 1; }
    last = c;
  }
  return uniqcount && (uniqcount / (maxcount + dupcount));
}

function signUpAndSave(options) {
  if (!options) { options = {}; }
  var doc = view.getPaneEditorData(paneatpos('left'));
  var mp = modelatpos('left');
  var shouldCreateAccount = true;
  if (!doc) {
    console.log("Nothing to save here.");
    return;
  }

  // updateUserSet will look up only one username at once.  It will:
  // (1) wait until a query has been sitting for 500ms without being
  //     superceded by a newer query; then it will kick off a server
  //     request if the answer to the query isn't already known.
  // (2) avoid kicking off another server request while one is in
  //     progress and a hasn't returned yet, for up to 10 seconds.
  // (3) it will restart the process after the server is done
  //     if a new different query has come in the meantime.
  var userSet = {};
  var lastquery = null;
  var delayTimer = null;
  var queryTimer = null;
  function updateUserSet(prefix) {
    // Repeated queries have no effect.
    if (lastquery == prefix) return;
    lastquery = prefix;
    // A new query will reset the delay timer.
    clearTimeout(delayTimer);
    delayTimer = null;
    // There is no work if the answer is cached.
    if (userSet.hasOwnProperty(lastquery)) { return; }
    // Block if a server query is in progress.
    if (queryTimer) { return; }
    // Server work starts after a 500ms delay.
    delayTimer = setTimeout(function() {
      delayTimer = null;
      var querying = lastquery;
      var cancelled = false;
      // When completed, unblock any newer query once.
      var complete = function() {
        if (!cancelled) {
          cancelled = true;
          clearTimeout(queryTimer);
          queryTimer = null;
          if (!userSet.hasOwnProperty(querying)) {
            userSet[querying] = 'error';
          }
          // Hackish: trigger a keyup on the $('.username') field to force
          // a revalidate after we have a userlist.
          $('.username').trigger('keyup');
          if (lastquery != querying) { updateUserSet(lastquery); }
        }
      };
      // Block other requests for 10 seconds or until the server returns.
      queryTimer = setTimeout(complete, 10000);
      // Update the userSet by querying the server.
      storage.updateUserSet(querying, userSet, complete);
    }, 500);
  };

  view.showLoginDialog({
    prompt: options.prompt || 'Choose an account name to save.',
    rename: options.nofilename ? '' : (options.filename || mp.filename),
    center: options.center,
    cancel: options.cancel,
    info: 'Accounts on pencilcode are free.',
    validate: function(state) {
      var username = state.username.toLowerCase();
      shouldCreateAccount = true;
      var instructions = {
        disable: true,
        info: 'Real names are <a target=_blank ' +
           'href="//' + pencilcode.domain + '/privacy.html">' +
           'not allowed</a>.' +
           '<br>When using a Pencil Code account,' +
           '<br><label>' +
           'I agree to <a target=_blank ' +
           'href="//' + pencilcode.domain + '/terms.html">' +
           'the terms of service<label></a>.'
      };
      if (username && !/^[a-z]/.test(username)) {
        return {
          disable: true,
          info: 'Username must start with a letter.'
        };
      }
      if (username.length < 3) {
        return instructions;
      }
      if (username && username.length > 20) {
        return {
          disable: true,
          info: 'Username too long.'
        };
      }
      if (username && !/^[a-z][a-z0-9]*$/.test(username)) {
        return {
          disable: true,
          info: 'Invalid username.'
        };
      }
      var status = 'unknown';
      if (userSet.hasOwnProperty(username)) {
        status = userSet[username];
      }
      if (status == 'reserved') {
        return {
          disable: true,
          info: 'Name "' + username + '" reserved.'
        };
      } else if (status == 'user' && options.newonly) {
        return {
          disable: true,
          info: 'Name "' + username + '" already used.'
        };
      } else if (status == 'user') {
        shouldCreateAccount = false;
        return {
          disable: false,
          info: 'Will log in as "' + username + '" and save.'
        };
      }
      if (status == 'nouser' && options.oldonly) {
        return {
          disable: true,
          info: 'Use an existing account.'
        };
      }
      if (status == 'unknown') {
        updateUserSet(username);
        return instructions;
      }
      if (username.length < 4) {
        return instructions;
      }
      if (username && letterComplexity(username) <= 1) {
        // Discourage users from choosing a username "aaaaaa".
        return {
          disable: true,
          info: 'Name "' + username + '" reserved.'
        };
      }
      if (username && username.length >= 8 &&
          /(?:com|org|net|edu|mil)$/.test(username)) {
        // Discourage users from choosing a username that looks like
        // an email address or domain name.
        return {
          disable: true,
          info: 'Name should not end with "' +
              username.substr(username.length - 3) + '".'
        };
      }
      if (username && /^pencil/.test(username)) {
        // Discourage usernames that start with 'pencil'
        return {
          disable: true,
          info: 'Name should not start with pencil.'
        };
      }
      if (!options.nofilename && !state.rename) {
        return {
          disable: true,
          info: 'Choose a file name.'
        }
      }
      if (status == 'error') {
        // Return a generic message when we can't determine
        // the status of the account.
        return {
          disable: false,
          info: 'Will use ' + username +
              '.' + window.pencilcode.domain + '.' +
               '<br>When using a Pencil Code account,' +
               '<br>I agree to <a target=_blank ' +
               'href="/terms.html">the terms of service</a>.'
        };
      }
      return {
        disable: false,
        info: 'Will create ' + username +
            '.' + window.pencilcode.domain + '.' +
             '<br>When using a Pencil Code account,' +
             '<br>I agree to <a target=_blank ' +
             'href="/terms.html">the terms of service</a>.'
      };
    },
    done: function(state) {
      var username = state.username.toLowerCase();
      if (username != model.ownername) {
        view.clearPane(paneatpos('right'), true);
      }
      var rename = state.rename || mp.filename;
      var forceOverwrite = (username != model.ownername) || specialowner();
      var key = keyFromPassword(username, state.password);
      var step2 = function() {
        storage.saveFile(
            username, rename, $.extend({}, doc),
            forceOverwrite, key, false,
            function(status) {
          if (status.needauth) {
            state.update({
              disable: false,
              info: 'Wrong password.'
            });
            view.clearPane(paneatpos('right'));
          } else if (status.newer) {
            state.update({
              disable: false,
              info: 'Did not overwrite newer file.'
            });
            view.clearPane(paneatpos('right'));
          } else if (status.transient) {
            state.update({
              disable: false,
              info: 'Network down.'
            });
            view.clearPane(paneatpos('right'));
          } else if (status.error) {
            state.update({
              disable: false,
              info: status.error
            });
            view.clearPane(paneatpos('right'));
          } else {
            view.notePaneEditorCleanData(paneatpos('left'), doc);
            storage.deleteBackup(mp.filename);
            storage.deleteBackup(rename);
            view.flashNotification('Saved.');
            var hostpath = username + '.' + window.pencilcode.domain +
                  '/edit/' + rename,
                newurl = '//' + hostpath +
                  '#login=' + username + ':' + (key ? key : '');
            if (model.guideUrl) {
              var guideurl = model.guideUrl;
              newurl += '&guide=' + (/[&#%]/.test(guideurl) ?
                encodeURIComponent(guideurl) : encodeURI(guideurl));
            }
            if (location.host + location.pathname == hostpath) {
              // If there is no change in URL, be careful to close the dialog.
              // We don't do this always, because the 'new user' flow
              // will do a 'history.back' when closing the dialog.
              state.update({cancel: true});
            }
            if (options.nohistory) {
              window.location.replace(newurl);
            } else {
              window.location.href = newurl;
            }
          }
        });
      }
      if (key && shouldCreateAccount) {
        storage.setPassKey(username, key, null, function(m) {
          if (m.error) {
            console.log('got error', m.error);
            state.update({info: 'Could not create account.<br>' +
                m.error });
            view.clearPane(paneatpos('right'), false);
            return;
          }
          step2();
        });
      } else {
        step2();
      }
    }
  });
}

function saveAs() {
  if (!model.username) {
    signUpAndSave();
    return;
  }
  var pp = paneatpos('left');
  var doc = view.getPaneEditorData(pp);
  var mp = modelatpos('left');
  var oldFilename = mp.filename;
  view.showLoginDialog({
    prompt: 'Copy and Save As...',
    username: model.ownername,
    nopass: true,
    rename: oldFilename,
    switchuser: signUpAndSave,
    validate: function(state) {
      if (!state.rename) {
        return {disable: true};
      }
      return {disable: false};
    },
    done: function(state) {
      state.update({info: 'Saving....', disable: true});
      var newFilename = state.rename;
      storage.saveFile(
          model.username, newFilename, doc, true,
          model.passkey, false,
      function(m) {
        if (m.needauth) {
          signUpAndSave();
          return;
        }
        if (m.error) {
          state.update({info: m.error, disable: true});
          return;
        }
        if (oldFilename != newFilename) {
          storage.deleteBackup(oldFilename);
        }
        state.update({cancel: true});
        mp.filename = newFilename;
        view.noteNewFilename(pp, newFilename);
        view.notePaneEditorCleanData(pp, doc);
        updateTopControls(false);
        view.flashNotification('Saved as ' + newFilename);
        view.setPrimaryFocus();
        logCodeEvent('save', newFilename, doc.data,
            view.getPaneEditorBlockMode(pp),
            view.getPaneEditorLanguage(pp));
        var oldmtime = mp.data.mtime || 0;
        if (m.mtime) {
          mp.data.mtime = Math.max(m.mtime, oldmtime);
        }
      });
    }
  });
}

function logInAndSave(filename, newdata, forceOverwrite,
                      noteclean, loginPrompt, doneCallback) {
  if (!filename || !newdata || nosaveowner()) {
    return;
  }
  view.showLoginDialog({
    prompt: (loginPrompt) ? loginPrompt : 'Log in to save.',
    username: model.ownername,
    switchuser: signUpAndSave,
    validate: function(state) { return {}; },
    done: function(state) {
      model.username = model.ownername;
      model.passkey = keyFromPassword(model.username, state.password);
      state.update({info: 'Saving....', disable: true});
      storage.saveFile(
          model.username, filename, newdata, forceOverwrite,
          model.passkey, false,
      function(m) {
        if (m.needauth) {
          state.update({info: 'Wrong password.', disable: false});
          return;
        }
        state.update({cancel: true});
        handleSaveStatus(m, filename, noteclean);
        if (doneCallback) {
          doneCallback();
        }
      });
    }
  });
}

function handleSaveStatus(status, filename, noteclean) {
  if (status.newer) {
    view.flashNotification('Newer copy on network. ' +
                           '<a href="#overwrite" id="overwrite">Overwrite</a>?');
  } else if (status.transient) {
    view.flashNotification('Network down.  Local backup made.');
  } else if (status.offline) {
    view.flashNotification('Offline.  Local backup made.');
  } else if (status.error) {
    view.flashNotification(status.error);
  } else if (status.deleted) {
    view.flashNotification('Deleted ' + filename.replace(/^.*\//, '') + '.');
    saveLoginCookie();
    if (!specialowner()) {
      cookie('recent', window.location.href,
             { expires: 7, path: '/', domain: window.pencilcode.domain });
    }

    if (modelatpos('left').filename == filename) {
      cancelAndClearPosition('left');
      var parentdir = '';
      if (filename.indexOf('/') >= 0) {
        parentdir = filename.replace(/\/[^\/]+\/?$/, '');
      }
      loadFileIntoPosition('back', parentdir, true, true);
      rotateModelRight(true);
    }
  } else {
    noteclean(status.mtime);
    saveLoginCookie();
    if (!specialowner()) {
      cookie('recent', window.location.href,
             { expires: 7, path: '/', domain: window.pencilcode.domain });
    }
  }
}

function saveLoginCookie() {
  cookie('login', (model.username || '') + ':' + (model.passkey || ''),
         { expires: 1, path: '/' });
}

var requestedBlockMode = null;
function loadBlockMode() {
  var result = requestedBlockMode;
  if (result === null) {
    if (model.ownername == 'frame') {
      // Frames that don't request a block mode start in text mode.
      result = false;
    } else {
      // Otherwise we start in block mode unless the cookie has disabled it.
      result = (cookie('blocks') != 'off');
    }
  }
  return result;
}

function saveBlockMode(on) {
  requestedBlockMode = on;
  if (model.ownername != 'frame') {
    cookie('blocks', on ? 'on' : 'off', { expires: 7, path: '/' });
  }
}

function loadDefaultMeta() {
  if (model.ownername == 'frame') {
    return null;
  }
  var m = cookie('meta');
  if (!m) { return null; }
  try {
    return JSON.parse(m);
  } catch (e) { }
  return null;
}

function saveDefaultMeta(meta) {
  if (model.ownername == 'frame') {
    return;
  }
  if (filetype.isDefaultMeta(meta)) {
    meta = null;
  }
  if (meta == null) {
    cookie('meta', '', { expires: -1, path: '/' });
  } else {
    try {
      meta = JSON.parse(JSON.stringify(meta));
      if (meta.html) { meta.html = ''; }
      if (meta.css) { meta.css = ''; }
      cookie('meta', JSON.stringify(meta), { expires: 7, path: '/' });
    } catch (e) { }
  }
}

function chooseNewFilename(dirlist) {
  if (!dirlist) { return 'unutitled'; }
  if (dirlist.length === 0) { return 'first';}
  var maxNum = -1;
  for (var j = 0; j < dirlist.length; ++j) {
    var m = /^untitled(\d*)$/.exec(dirlist[j].name);
    if (m) {
      maxNum = Math.max(maxNum, m[1].length && parseInt(m[1]));
    }
  }
  if (maxNum < 0) { return 'untitled'; }
  if (maxNum == 0) { maxNum = 1; }
  return 'untitled' + (maxNum + 1);
}

view.on('link', handleDirLink);

function handleDirLink(pane, linkname) {
  var base = model.pane[pane].filename;
  if (base === null) { return; }
  if (base.length) { base += '/'; }
  if (posofpane(pane) == 'right') {
    cancelAndClearPosition('back');
    rotateModelLeft(true);
  }
  cancelAndClearPosition('back');
  if (linkname == '#new') {
    if (!model.pane[pane].data) { return; }
    var untitled = chooseNewFilename(model.pane[pane].data.list);
    createNewFileIntoPosition('right', base + untitled);
    rotateModelLeft(true);
    return;
  }
  var openfile;
  if (linkname == '#reload') {
    openfile = base;
    loadFileIntoPosition('left', openfile, true, true, function() {});
    return;
  } else {
    openfile = base + linkname.replace(/\/$/, '');
  }
  var isdir = /\/$/.test(linkname);
  loadFileIntoPosition('right', openfile, isdir, isdir,
    function() { rotateModelLeft(true); });
}

view.on('linger', function(pane, linkname) {
  if (pane !== paneatpos('left')) { return; }
  var base = model.pane[pane].filename;
  if (base === null) { return; }
  if (base.length) { base += '/'; }
  if (/^#/.test(linkname)) {
    return;
  }
  var openfile = base + linkname.replace(/\/$/, '');
  var isdir = /\/$/.test(linkname);
  loadFileIntoPosition('right', openfile, isdir, isdir);
});

view.on('root', function() {
  if (view.isPaneEditorDirty(paneatpos('left'))) {
    view.flashButton('save');
  }
  if (!model.ownername) {
    window.location.href = '/';
    return;
  }
  if (modelatpos('left').filename === '') {
    loadFileIntoPosition('left', '', true, true);
  } else {
    var needToClear = modelatpos('left').filename &&
        modelatpos('left').filename.indexOf('/') >= 0;
    var pl = paneatpos('left');
    loadFileIntoPosition('back', '', true, true, function() {
      if (needToClear) {
        view.clearPane(pl)
      }
    });
    rotateModelRight(needToClear);
  }
});

view.on('editmode', function() {
  if (!model.editmode) {
    // Fake out updateTopControls to switch url to /edit/
    model.editmode = true;
    updateTopControls(true);
    // Then go back and readNewUrl to make it process as if the URL had
    // been changed by hand.
    model.editmode = false;
    readNewUrl();
  }
});

view.on('done', function() {
  if (view.isPaneEditorDirty(paneatpos('left'))) {
    view.flashButton('save');
  }
  doneWithFile(modelatpos('left').filename);
});

function doneWithFile(filename) {
  if (!filename || !model.ownername) {
    if (window.location.href ==
      '//' + window.pencilcode.domain + '/edit/') {
      window.location.href = '//' + window.pencilcode.domain + '/';
    } else {
      // Do nothing when clicking the folder icon when at the root
      // of a user's directory.
    }
  } else {
    if (filename.indexOf('/') >= 0) {
      // `history.state.previous` is like '/edit/demo/', so we should
      // strip the filename after '/' and keep the '/'.
      filename = filename.replace(/[^\/]+\/?$/, '');
    } else {
      filename = '';
    }
    var newUrl = (model.editmode ? '/edit/' : '/home/') + filename;
    // A trick: if 'back' would be the same as going to the parent,
    // then just do a 'back'.
    if (history.state && history.state.depth > 0 &&
        history.state.previous == newUrl) {
      history.back();
    } else {
      // Strip any trailing / from the filename before using it for loading.
      filename = filename.replace(/\/$/, '');
      loadFileIntoPosition('back', filename, true, true);
      rotateModelRight(true);
    }
  }
}

view.on('rename', function(newname) {
  var pp = paneatpos('left');
  var mp = modelatpos('left');
  if (mp.filename === newname || nosaveowner()) {
    // Nothing to do
    return;
  }
  var oldMimeType = filetype.mimeForFilename(mp.filename);
  // Error cases: go back to original name.
  // Can't rename the root (for now).
  // TODO: check for:
  // - moving directory inside itself
  // etc.
  if (!mp.filename) {
    view.setNameText(mp.filename);
    return;
  }
  function completeRename(newfile) {
    view.flashNotification(
        (newfile ? 'Using name ' : 'Renamed to ') + newname + '.');
    // If there is a running on the right, bring it along
    var rp = modelatpos('right');
    if (rp.running && rp.filename == mp.filename) {
      rp.filename = newname;
    }
    mp.filename = newname;
    view.noteNewFilename(pp, newname);
    updateTopControls(false);
    view.setPrimaryFocus();
    var changed = view.isPaneEditorDirty(paneatpos('left')) ||
        oldMimeType != filetype.mimeForFilename(newname);
    if (changed && model.ownername && !nosaveowner() &&
        !view.isPaneEditorEmpty(paneatpos('left'))) {
      saveAction(true, 'Login to save', function() {
        if (modelatpos('right').running) {
          // After a change-rename-save, reset the run preview if any.
          // (Possible mime type change.)
          var doc = view.getPaneEditorData(paneatpos('left'));
          runCodeAtPosition('right', doc, modelatpos('left').filename, true);
        }
      });
    }
  }
  var payload = {
    source: model.ownername + '/' + mp.filename,
    mode: 'mv'
  };
  if (model.passkey) {
    payload.key = model.passkey;
  }
  // Don't attempt to rename files without an owner on disk.
  // Otherwise, if the file is a directory or it is has an mtime,
  // it exists on disk and so we first rename it on disk.
  if (model.ownername && (mp.data.directory || mp.data.mtime)) {
    if (mp.data.auth && !model.username) {
      view.setNameText(mp.filename);
      logInAndMove(mp.filename, newname, completeRename);
    } else {
      storage.moveFile(
          model.ownername, mp.filename, newname, model.passkey, false,
      function(m) {
        if (m.needauth) {
          view.setNameText(mp.filename);
          logInAndMove(mp.filename, newname, completeRename);
          return;
        }
        if (m.error) {
          // Abort if there is an error.
          view.flashNotification(m.error);
          view.setNameText(mp.filename);
        } else {
          completeRename();
        }
      });
    }
  } else {
    // No mtime means it's purely local - just rename in memory.
    storage.deleteBackup(mp.filename);
    completeRename(true);
  }
});

view.on('popstate', readNewUrl);

function logInAndMove(filename, newfilename, completeRename) {
  if (!filename || !newfilename) {
    return;
  }
  view.showLoginDialog({
    prompt: 'Log in to rename.',
    username: model.ownername,
    validate: function(state) { return {}; },
    done: function(state) {
      model.username = model.ownername;
      model.passkey = keyFromPassword(model.username, state.password);
      state.update({info: 'Renaming....', disable: true});
      storage.moveFile(
          model.ownername, filename, newfilename, model.passkey, false,
      function(m) {
        if (m.needauth) {
          state.update({info: 'Wrong password.', disable: false});
          return;
        }
        state.update({cancel: true});
        if (m.error) {
          view.flashNotification(m.error);
        } else {
          saveLoginCookie();
          if (!specialowner()) {
            cookie('recent', window.location.href,
                { expires: 7, path: '/', domain: window.pencilcode.domain });
          }
          completeRename();
        }
      });
    }
  });
}

function noteIfUnsaved(position) {
  var m = modelatpos(position).data;
  if (m && m.unsaved) {
    if (position === 'left') {
      view.flashNotification('Showing unsaved backup.' +
          (m.offline ? '' :
          ' <a href="#netload" id="netload">Load last saved version.</a>'));
    }
    view.notePaneEditorCleanData(paneatpos(position), {data: ''});
  }
}

function rotateModelLeft(addHistory) {
  debug.bindframe(null);
  view.rotateLeft();
  if (modelatpos('back').running) {
    cancelAndClearPosition('back');
  }
  noteIfUnsaved('left');
  updateTopControls(addHistory);
}

function rotateModelRight(addHistory) {
  debug.bindframe(null);
  view.rotateRight();
  if (modelatpos('back').running) {
    cancelAndClearPosition('back');
  }
  updateTopControls(addHistory);
}

function isFileWithin(base, candidate) {
  if (base.length && !/\/%/.test(base)) { base += '/'; }
  return candidate.length > base.length &&
      candidate.indexOf(base) === 0;
}

function falsish(s) {
  return !s || s == '0' || s == 'false' || s == 'none' || s == 'null' ||
         s == 'off' || s == 'no';
}

function readNewUrl(undo) {
  if (readNewUrl.suppress) {
    return;
  }
  // True if this is the first url load.
  var firsturl = (model.ownername === null),
  // Firefox incorrectly decodes window.location.hash, so this is consistent:
      hash = window.location.href.indexOf('#') < 0 ? '' :
          location.href.substring(window.location.href.indexOf('#')),
  // Owner comes from domain name.
      ownername = window.location.hostname.replace(
          /(?:(.*)\.)?[^.]*.{8}$/, '$1'),
  // Filename comes from URL minus first directory part.
      filename = window.location.pathname.replace(
          /^\/[^\/]+\//, '').replace(/\/+$/, ''),
  // Expect directory if the pathname ends with slash.
      isdir = /\/$/.test(window.location.pathname),
  // Extract login from hash if present.
      login = /(?:^|#|&)login=([^:]*)(?::(\w+))?\b/.exec(hash),
  // Extract text from hash if present.
      text = /(?:^|#|&)text=([^&]*)(?:&|$)/.exec(hash),
  // Extract newuser flag from hash if present.
      newuser = /(?:^|#|&)new(?:[=&]|$)/.exec(hash),
  // Extract blocks flag from hash if present.
      blocks = /(?:^|#|&)blocks=([^&]*)(?:&|$)/.exec(hash),
  // Extract lang from hash if present.
      lang = /(?:^|#|&)lang=([^&]*)(?:&|$)/.exec(hash),
  // Extract html from hash if present.
      html = /(?:^|#|&)html=?([^&]*)(?:&|$)/.exec(hash),
  // Extract css from hash if present.
      css = /(?:^|#|&)css=?([^&]*)(?:&|$)/.exec(hash),
  // Extract setup script spec from hash if present.
      setup = /(?:^|#|&)setup=([^&]*)(?:&|$)/.exec(hash),
  // Extract guide url from hash if present.
      guidehash = /(?:^|#|&)guide=([^&]*)(?:&|$)/.exec(hash),
      guideurl = null,
  // Extract edit mode
      editmode = /^\/edit\//.test(window.location.pathname),
  // Login from cookie.
      cookielogin = null;
  // Give the user a chance to abort navigation.
  if (undo && !nosaveowner()) {
    var type = null;
    if (view.isPaneEditorDirty(paneatpos('left'))) {
      type = 'changes';
    } else if (model.tempThumbnail) {
      type = 'thumbnail';
    }
    if (type && !window.confirm(
      "There are unsaved " + type + ".\n\n" +
      "Are you sure you want to leave this page?")) {
      view.flashButton('save');
      undo();
      return;
    } else {
      model.tempThumbnail = null;
    }
  }
  if (!login) {
    cookielogin = cookie('login');
    login = cookielogin && /\b^([^:]*)(?::(\w*))?$/.exec(cookielogin);
  }
  if (login) {
    model.username = login[1] || null;
    model.passkey = login[2] || null;
  }
  if (ownername) {
    // Remember credentials.
    if (!cookielogin && login) { saveLoginCookie(); }
  }
  if (guidehash) { try { guideurl = unescape(guidehash[1]); } catch (e) { } }
  if (guideurl) {
    if (!/^https?:\/\/\w/i.test(guideurl)) {
      var prefix = location.protocol + (/^\/\//.test(guideurl) ? '' : '//');
      guideurl = prefix + guideurl;
    }
    guide.setUrl(guideurl);
    guide.show(true, firsturl);
    model.guideUrl = guideurl;
  } else {
    guide.show(false, firsturl);
    model.guideUrl = null;
  }
  // Handle #blocks
  if (blocks) {
    var f = blocks[1];
    requestedBlockMode = !falsish(f);
  }
  // Handle #new (new user) hash.
  var afterLoad = null;
  if (newuser) {
    afterLoad = (function() {
      signUpAndSave({
        center: true,
        nofilename: true,
        nohistory: true,
        newonly: true,
        prompt: 'Choose an account name',
        cancel: function() { history.back(); }
      });
    });
  }
  // Clean up the hash if present, and absorb the new auth information.
  if (hash.length) {
    readNewUrl.suppress = true;
    // window.location.replace('#');
    updateVisibleUrl(window.location.pathname, guideurl, false);
    readNewUrl.suppress = false;
  }
  // Update global model state.
  var forceRefresh = false;
  if (model.ownername !== ownername || model.editmode !== editmode) {
    model.ownername = ownername;
    model.editmode = editmode;
    forceRefresh = true;
  }
  if (!specialowner()) {
    // Remember as the most recently used program (without hash).
    cookie('recent', window.location.href.replace(/#.*$/, ''),
        { expires: 7, path: '/', domain: window.pencilcode.domain });
  }
  // Update setup scripts if specified.
  if (setup) {
    try {
      model.setupScript =
          JSON.parse(decodeURIComponent(setup[1].replace(/\+/g, ' ')));
    } catch(e) {
      if (window.console) {
        console.log('Unable to parse setup script spec: ' + e.message);
      }
    }
  }
  // If the new url is replacing an existing one, animate it in.
  if (!firsturl && modelatpos('left').filename !== null) {
    if (isFileWithin(modelatpos('left').filename, filename)) {
      cancelAndClearPosition('back');
      if (forceRefresh) {
        cancelAndClearPosition('right');
      }
      loadFileIntoPosition('right', filename, isdir, isdir, rotateModelLeft);
      return;
    } else if (isFileWithin(filename, modelatpos('left').filename)) {
      if (forceRefresh) {
        cancelAndClearPosition('back');
      }
      loadFileIntoPosition('back', filename, isdir, isdir);
      rotateModelRight(false);
      return;
    }
    if (!forceRefresh && filename == modelatpos('left').filename) {
      if (afterLoad) {
        afterLoad();
      }
      return;
    }
  }
  // Remove the preview pane if just browsing, or if browsing users.
  view.setPreviewMode(
      model.editmode && (model.ownername !== "" || filename !== ""), firsturl);
  // Preload text if specified.
  if (text != null || html != null || css != null || lang != null) {
    var code = '';
    var meta = {};
    if (lang) {
      if (/js|javascript/.test(lang[1])) {
        meta.type = 'text/javascript';
      }
    }
    if (html) {
      try {
        meta.html = decodeURIComponent(html[1].replace(/\+/g, ' '));
      } catch (e) { }
    }
    if (css) {
      try {
        meta.css = decodeURIComponent(css[1].replace(/\+/g, ' '));
      } catch (e) { }
    }
    if (text) {
      try {
         code = decodeURIComponent(text ? text[1].replace(/\+/g, ' ') : '');
      } catch (e) { }
    }
    createNewFileIntoPosition('left', filename, code, meta);
    updateTopControls(false);
    return;
  }
  // Regular startup: load the file.
  if (forceRefresh) {
    cancelAndClearPosition('left');
  }
  loadFileIntoPosition('left', filename, isdir, isdir, afterLoad);
}

function directNetLoad() {
  var pos = 'left';
  var filename = modelatpos(pos).filename;
  if (modelatpos(pos).data) {
    loadFileIntoPosition(pos, filename, false, true);
  }
}

view.on('netload', directNetLoad);

var loadNumber = 0;

function nextLoadNumber() {
  return ++loadNumber;
}

function cancelAndClearPosition(pos) {
  debug.bindframe(null);
  view.clearPane(paneatpos(pos), false);
  modelatpos(pos).loading = 0;
  modelatpos(pos).filename = null;
  modelatpos(pos).isdir = false;
  modelatpos(pos).data = null;
  modelatpos(pos).bydate = false;
  modelatpos(pos).running = false;
}

function instrumentCode(code, language) {
  try {
    if (language === 'javascript') {
      options = {
        traceFunc: 'ide.trace',
        includeArgsStrings: true,
        sourceMap: true
      };
      result = pencilTracer.instrumentJs(code, options);
      debug.setSourceMap(result.map);
      code = result.code;
    } else if (language === 'coffeescript') {
      options = {
        traceFunc: 'ide.trace',
        includeArgsStrings: true,
        sourceMap: true,
        bare: true
      };
      result = pencilTracer.instrumentCoffee(code, icedCoffeeScript, options);
      debug.setSourceMap(result.map);
      code = result.code;
    }
  } catch (err) {
    // An error here means that either the user's code has a syntax error, or
    // pencil-tracer has a bug. Returning false here means the user's code
    // will run directly, without the debugger, and then if there's a syntax
    // error it will be displayed to them, and if it's a pencil-tracer bug,
    // their code will still run but with the debugger disabled.
    return false;
  }
  return code;
}

function runCodeAtPosition(position, doc, filename, emptyOnly) {
  var m = modelatpos(position);
  if (!m.running) {
    cancelAndClearPosition(position);
  }
  m.running = true;
  m.filename = filename;
  var baseUrl = filename && (
      window.location.protocol +
      '//' + (model.ownername ? model.ownername + '.' : '') +
      window.pencilcode.domain + '/home/' + filename);
  var pane = paneatpos(position);
  var setupScript = (model.setupScript || []).concat(
      [{ src: "//{site}/lib/start-ide.js" }]);
  var html = filetype.modifyForPreview(
      doc, window.pencilcode.domain, filename, baseUrl,
      emptyOnly, setupScript, instrumentCode);
  // Delay allows the run program to grab focus _after_ the ace editor
  // grabs focus.  TODO: investigate editor.focus() within on('run') and
  // remove this setTimeout if we can make editor.focus() work without delay.
  setTimeout(function() {
    if (m.running) {
      view.setPaneRunHtml(pane, html, filename, baseUrl,
         // Do not enable fullscreen mode when no owner, or a nosaveowner.
         model.ownername && !nosaveowner(), emptyOnly);
    }
  }, 1);
}

function defaultDirSortingByDate() {
  if (!specialowner()) return false;
  try {
    if (!window.localStorage) return false;
    return window.localStorage.dirsort === 'bydate';
  } catch(e) {
    return false;
  }
}

function setDefaultDirSortingByDate(f) {
  try {
    if (f) {
      window.localStorage.dirsort = 'bydate';
    } else {
      delete window.localStorage['dirsort'];
    }
  } catch(e) {
  }
}

function createNewFileIntoPosition(position, filename, text, meta) {
  var pane = paneatpos(position);
  var mpp = model.pane[pane];
  if (!text) { text = ''; }
  if (!meta) { meta = loadDefaultMeta(); }
  view.clearPane(pane, false);
  mpp.loading = 0;
  mpp.filename = filename;
  mpp.isdir = false;
  mpp.bydate = false;
  mpp.data = {
    file: filename,
    data: text,
    mtime: 0
  };
  var mode = loadBlockMode();
  view.setPaneEditorData(pane, {data: text, meta: meta}, filename, mode);
  view.notePaneEditorCleanData(pane, {data: ''});
  mpp.running = false;
  logCodeEvent('new', filename, text, mode, view.getPaneEditorLanguage(pane));
}


function loadFileIntoPosition(position, filename, isdir, forcenet, cb) {
  var pane = paneatpos(position);
  var mpp = model.pane[pane];
  var loadNum = nextLoadNumber();
  // Now if the file or owner are different from what is currently shown,
  // update the model and execute the load.
  if (mpp.filename === filename && !forcenet) {
    updateTopControls(false);
    cb && cb();
  } else {
    view.clearPane(pane, true); // show loading animation.
    mpp.filename = filename;
    mpp.isdir = isdir;
    mpp.bydate = isdir && defaultDirSortingByDate();
    mpp.loading = loadNum;
    mpp.data = null;
    mpp.running = false;
    storage.loadFile(model.ownername, filename, forcenet, function(m) {
      if (mpp.loading != loadNum) {
        if (window.console) {
          window.console.log('aborted: loading is ' +
              mpp.loading + ' instead of ' + loadNum);
        }
        return;
      }
      mpp.loading = 0;
      if (model.ownername === '' && filename === '') {
        mpp.isdir = true;
        mpp.data = m;
        renderDirectory(posofpane(pane));
        cb && cb();
      } else if (m.directory && m.list) {
        // Directory listing.
        mpp.isdir = true;
        mpp.data = m;
        renderDirectory(posofpane(pane));
        cb && cb();
      } else if (!m.data && m.newfile) {
        // In the nofile case, create an empty file.
        createNewFileIntoPosition('left', filename);
        updateTopControls(false);
        view.flashNotification('New file ' + filename + '.');
        cb && cb();
      } else if (/^image\//.test(m.mime) && !/^image\/svg/.test(m.mime)) {
        runCodeAtPosition(position, m, filename, false);
      } else {
        // The single file case.
        // TODO:
        // 2. in the offline case, notify the user that we are working offline.
        // 3. in the unsaved case, notify the user that we loaded a backup and
        //    give a link to load from network.
        if (!m.data) { m.data = ''; }
        mpp.isdir = false;
        mpp.data = m;
        var mode = loadBlockMode();
        view.setPaneEditorData(pane, m, filename, mode);
        noteIfUnsaved(posofpane(pane));
        updateTopControls(false);
        cb && cb();
        logCodeEvent('load', filename, m.data, mode,
            view.getPaneEditorLanguage(pane));
      }
    });
  }
};

function sortByDate(a, b) {
  if (b.mtime != a.mtime) {
    return b.mtime - a.mtime;
  }
  return sortByName(a, b);
}

function sortByName(a, b) {
  var aName = a.name.toLowerCase();
  var bName = b.name.toLowerCase();
  if (aName == bName) {
     return  a < b ? -1 : a > b ? 1 : 0;
  } else if (aName < bName) {
    return -1;
  } else if (aName > bName) {
    return 1;
  }
  return 0;
}

function renderDirectory(position) {
  cache.clear();
  var pane = paneatpos(position);
  var mpp = model.pane[pane];
  mpp.bydate = defaultDirSortingByDate();
  var filename = mpp.filename;
  view.setPaneLinkText(pane, getUpdatedLinksArray(pane), filename, model.ownername);
  updateTopControls(false);
}


function updateSortResults(pane) {
  view.setPaneLinks(pane,getUpdatedLinksArray(pane));
  updateTopControls(false);
}

function updateSearchResults(pane, search, cb) {
  search = search ? search.toLowerCase() : '';
  var mpp = model.pane[pane];
  var searchCacheName = 'search-keys-' + (!model.ownername ? '' : model.ownername);
  var searchCacheKey= mpp.filename+"-"+search;
  var cacheResults = cache.get(searchCacheName, searchCacheKey);
  if (cacheResults) {
    mpp.data.list=cacheResults.list;
    updateViewAndCache(cacheResults.list, cacheResults.view);
  } else {
    if (!model.ownername) {
      storage.loadFile(model.ownername, mpp.filename+"?prefix="+search, true, function(m) {
        if(m.list) {
          mpp.data=m
          updateViewAndCache(m.list, getUpdatedLinksArray(pane), cache);
        }
      });
    } else {
      if (!mpp.data.allLinks) {
        mpp.data.allLinks=mpp.data.list;
      }

      var results = [];
      var list = mpp.data.allLinks;

      for (j = 0; j < list.length; j++) {
        if (list[j].name.toLowerCase().indexOf(search) == 0) {
          results.push(list[j]);
        }
      }
      mpp.data.list = results;
      updateViewAndCache(results, getUpdatedLinksArray(pane), cache);
    }
  }

  function updateViewAndCache(list, viewlist, cache) {
    view.setPaneLinks(pane, viewlist);
    cb && cb();
    cache && cache.put(searchCacheName, searchCacheKey, {
      list: list,
      view: viewlist
    });
  }
}

function getUpdatedLinksArray(pane) {
  var mpp = model.pane[pane];
  var m = mpp.data;
  var filename = mpp.filename;
  var filenameslash = filename.length ? filename + '/' : '';
  // TODO: fix up visible URL to ensure slash.
  var links = [];
  if (!m.list) {
    links.push({
      html: m.error || 'Network error',
      link: '#reload'
    });
  } else {
    for (var j = 0; j < m.list.length; ++j) {
      var name = m.list[j].name;
      if (model.ownername === '' && filename === '') {
        if (m.list[j].mode.indexOf('d') < 0) { continue; }
        var href = '//' + name + '.' + window.pencilcode.domain + '/edit/';
        links.push({
          name: name,
          href: href,
          type: 'user',
          mtime: m.list[j].mtime
        });
      } else {
        var thumbnail = '';
        if (m.list[j].thumbnail) {  // If there is a thumbnail for the file.
          // Construct the url to the thumbnail.
          // Append mtime so that when program updates, thumb gets refetched.
          thumbnail = '/thumb/' + filenameslash + name +
                      '.png?' + m.list[j].mtime;
        }
        var type = 'dir';
        if (m.list[j].mode.indexOf('d') >= 0) {
          name += '/';
        } else {
          type = filetype.mimeForFilename(name).replace(/;.*$/, '');
        }
        var href = '/edit/' + filenameslash + name;
        links.push({
            name: name,
            link: name,
            href: href,
            type: type,
            thumbnail: thumbnail,
            mtime: m.list[j].mtime
        });
      }
    }
    if (mpp.bydate) {
      links.sort(sortByDate);
    } else {
      links.sort(sortByName);
    }
    if (model.ownername !== '') {
      links.push({
          name: 'New file',
          type: 'new',
          link: '#new'
      });
    }
  }
  return links;
}

// True if the doc contains nothing, or nothing but spaces.
function isEmptyDoc(doc) {
  if (!doc) return true;
  return ((!doc.data || !doc.data.trim()) &&
      (!doc.meta || (
        (!doc.meta.html || !doc.data.html.trim()) &&
        (!doc.meta.css || !doc.data.css.trim()))));
}

function shortenUrl(url, cb) {
  var reqObj = {
    dataType: 'json',
    // type: 'POST',
    url: 'https://www.googleapis.com/urlshortener/v1/url?' +
         'key=AIzaSyCSnpkwynMDLa7h_lkx4r7QDb2sjqdrFTo',
    header: 'Content-Type: application/json',
    data: JSON.stringify({longUrl: url})
  };
  var reqStr =
      '//jsonlib.appspot.com/fetch?' + escape(JSON.stringify(reqObj));

  // If the request length is longer than 2048, it is not going to succeed.
  if (reqStr.length <= 2048) {
    $.getJSON('http://call.jsonlib.com/fetch', reqObj,
        function(m) {
          if (!m.content) { cb(null); return; }
          var content;
          try {
            content = JSON.parse(m.content);
          } catch(e) {
            cb(null); return;
          }
          cb(content.id);
        }).error(function() { cb(null) });
  } else {
    cb(null);
  }
}

function cookie(key, value, options) {
  // write
  if (value !== undefined) {
    options = $.extend({}, options);

    if (typeof options.expires === 'number') {
      var days = options.expires, t = options.expires = new Date();
      t.setDate(t.getDate() + days);
    }

    return (document.cookie = [
      encodeURIComponent(key),
      '=',
      encodeURIComponent(value),
      options.expires ? '; expires=' + options.expires.toUTCString() : '',
      options.path    ? '; path=' + options.path : '',
      options.domain  ? '; domain=' + options.domain : '',
      options.secure  ? '; secure' : ''
    ].join(''));
  }

  // read
  var decode = function(s) {
     try {
        return decodeURIComponent(s.replace(/\+/g, ' '));
     } catch (e) {
       return '';
     }
  }
  var converted = function(s) {
    if (s.indexOf('"') === 0) {
      s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
    return s;
  }
  var cookies = document.cookie.split('; ');
  var result = key ? undefined : {};
  for (var i = 0, l = cookies.length; i < l; i++) {
    var parts = cookies[i].split('=');
    var name = decode(parts.shift());
    var cookie = decode(parts.join('='));
    if (key && key === name) {
      result = converted(cookie);
      break;
    }
    if (!key && parts.length) {
      result[name] = converted(cookie);
    }
  }
  return result;
};

///////////////////////////////////////////////////////////////////////////
// CROSS-FRAME-MESSAGE SUPPORT
///////////////////////////////////////////////////////////////////////////

// parses window.location.hash params into a dict
function parseWindowLocationHash() {
  // This is more consistent that window.location.hash because
  // Firefox partially uri-decodes window.location.hash.
  var hash = window.location.href.indexOf('#') < 0 ? '' :
      location.href.substring(window.location.href.indexOf('#'));

  if (!hash || hash.length < 2) {
    return {};
  }

  hash = hash.substring(1);
  var hashParts = hash.split('&');
  var hashDict = {};
  for (var i = 0; i < hashParts.length; i++) {
    if (hashParts[i].indexOf('=') === -1) {
      return {};
    }

    var separatorLocation = hashParts[i].indexOf('=');
    var key = hashParts[i].substring(0, separatorLocation);
    var value = hashParts[i].substring(separatorLocation + 1);
    try {
      value = decodeURIComponent(value);
    } catch (e) { }
    hashDict[key] = value;
  }

  return hashDict;
}

// extracts secret from the location hash
function getCrossFrameContext() {
  var hashDict = parseWindowLocationHash();
  if (!hashDict.secret) {
    return {secret: null};
  }
  return {secret: hashDict.secret}
}

// processes messages from other frames
$(window).on('message', function(e) {
  // parse event data
  try {
    var data = JSON.parse(e.originalEvent.data);
  } catch(error) {
    return false;
  }

  // check secret
  if (!data.secret || data.secret != model.crossFrameContext.secret) {
    return false;
  }

  // invoke the requested method
  switch (data.methodName) {
    case 'setCode':
      var code = data.args[0];
      if (!code || typeof(code) != 'object') {
        code = { data: code };
      }
      view.setPaneEditorData(
          paneatpos('left'), code, modelatpos('left').filename,
          loadBlockMode());
      break;
    case 'setupScript':
      model.setupScript = data.args[0];
      if (modelatpos('right').running) {
        // If we are currently showing a run pane, then reload it.
        var doc = view.getPaneEditorData(paneatpos('left'));
        runCodeAtPosition('right', doc, modelatpos('left').filename, true);
      }
      break;
    case 'eval':
      evalAndPostback(data.requestid, data.args[0], data.args[1]);
      break;
    case 'beginRun':
      view.fireEvent('run', []);
      break;
    case 'stopRun':
      view.fireEvent('stop', []);
      break;
    case 'save':
      signUpAndSave({filename:data.args[0]});
      break;
    case 'setBlockMode':
      view.setPaneEditorBlockMode(paneatpos('left'), data.args[0]);
      break;
    case 'setBlockOptions':
      view.setPaneEditorBlockOptions(
          paneatpos('left'), data.args[0], data.args[1]);
      break;
    case 'hideEditor':
      view.hideEditor(paneatpos('left'));
      break;
    case 'showEditor':
      view.showEditor(paneatpos('left'));
      break;
    case 'hideMiddleButton':
      view.canShowMiddleButton = false;
      view.showMiddleButton('');
      break;
    case 'showMiddleButton':
      view.canShowMiddleButton = true;
      view.showMiddleButton('run');
      break;
    case 'hideToggleButton':
      view.showToggleButton(false);
      break;
    case 'showToggleButton':
      view.showToggleButton(true);
      break;
    case 'setEditable':
      view.setPaneEditorReadOnly(paneatpos('left'), false);
      break;
    case 'setReadOnly':
      view.setPaneEditorReadOnly(paneatpos('left'), true);
      break;
    case 'showNotification':
      view.flashNotification(data.args[0]);
      break;
    case 'hideNotification':
      view.dismissNotification();
      break;
    default:
      return false;
  }

  return true;
});


// posts message to the parent window, which may have embedded us
function createParentPostMessageSink() {
  // check we do have a parent window
  if (window.parent === window) {
    return;
  }

  // validate presence of secret in hash
  if (!model.crossFrameContext.secret) {
    return;
  }

  view.subscribe(function(method, args, requestid) {
    var payload = {
        methodName: method,
        args: args};
    if (requestid) {
      payload.requestid = requestid;
    }
    window.parent.postMessage(
        JSON.stringify(payload), '*');
  });
}

createParentPostMessageSink();

function evalAndPostback(requestid, code, raw) {
  var resultanderror = null;
  if (modelatpos('right').running) {
    resultanderror = view.evalInRunningPane(paneatpos('right'), code, raw);
  } else {
    resultanderror = [null, 'error: not running'];
  }
  view.publish("response", resultanderror, requestid);
}

// Detect when the page was refreshed and log it.
(function() {
  $(window).on('unload', function() {
    cookie('unloaded', +(new Date) + ':'
        + window.location.href.replace(/#.*$/, ''));
  });
  // After a refresh, the session cookie is present.
  var unloaded = cookie('unloaded'),
      unloadedmatch = unloaded && /^(\d+):(.*)$/.exec(unloaded);
  if (unloadedmatch && +(new Date) - unloadedmatch[1] < 5000 &&
      window.location.href.replace(/#.*$/, '') == unloadedmatch[2]) {
    $.get('/log/' + window.location.pathname.replace(
            /^\/[^\/]+\//, '').replace(/\/+$/, '') + '?refresh');
  }
})();




// For a hosting frame, publish the 'load' event before publishing
// the first 'update' events.
view.publish('load');

readNewUrl();

module.exports = model;
