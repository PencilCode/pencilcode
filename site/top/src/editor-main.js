///////////////////////////////////////////////////////////////////////////
// JQUERY PREDEFINITION
///////////////////////////////////////////////////////////////////////////

// Jquery is already defined in turtlebits.js - we define it here
// to make require.js aware of it.
define('jquery', [], function() {
      return jQuery;
});


///////////////////////////////////////////////////////////////////////////
// REQUIRE JS path config
///////////////////////////////////////////////////////////////////////////
require.config({
  baseUrl: '/',
  paths: {
    'editor-view': 'src/editor-view',
    'editor-storage': 'src/editor-storage',
    'editor-debug': 'src/editor-debug',
    'draw-protractor': 'src/draw-protractor',
    'tooltipster': 'lib/tooltipster/js/jquery.tooltipster',
    'sourcemap': 'src/sourcemap',
    'ZeroClipboard': 'lib/zeroclipboard/ZeroClipboard'
  },
  shim: {
    'tooltipster': {
       deps: ['jquery'],
       exports: 'jQuery.fn.tooltipster'
    },
    'see': {
       deps: ['jquery'],
       exports: 'see'
    }
  }
});

///////////////////////////////////////////////////////////////////////////
// MODEL, CONTROLLER SUPPORT
///////////////////////////////////////////////////////////////////////////

require([
  'jquery',
  'editor-view',
  'editor-storage',
  'editor-debug',
  'seedrandom',
  'see',
  'draw-protractor'],
function($, view, storage, debug, seedrandom, see, drawProtractor) {

eval(see.scope('controller'));

// TODO Document the fields of the pane model.
function defaultPaneModel() {
  return {
      filename: null,
      isdir: false,
      data: null,
      bydate: false,
      loading: 0,
      running: 0,
      template: null,
      activityDir: false
  };
}

function clearPaneModel(m) {
  m.filename = null;
  m.isdir = false;
  m.data = null;
  m.bydate = false;
  m.loading = 0;
  m.running = false;
  m.template = null;
  m.activityDir = false;
}

var model = {
  // Owner name of this file or directory.
  ownername: null,
  // True if /edit/ url.
  editmode: false,
  // Contents of the three panes.
  pane: {
    alpha: defaultPaneModel(),
    bravo: defaultPaneModel(),
    charlie: defaultPaneModel()
  },
  // Logged in username, or null if not logged in.
  username: null,
  // Three digit passkey, hashed from password.
  passkey: null,
  // secrets passed in from the embedding frame via
  // window.location.hash
  crossFrameContext: getCrossFrameContext()
};

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
  return !model.ownername || !!specialowner.specialowners[model.ownername];
}

specialowner.specialowners = {
  guide: true, event: true, start: true, frame: true
};

//
// A saveable owner is an owner that participates in saving
// and loading.
//
function saveableOwner() {
  return model.ownername && !saveableOwner.unsaveableOwners[model.ownername];
}
saveableOwner.unsaveableOwners = {
  guide: true, event: true, frame: true
};


function updateTopControls(addHistory) {
  var m = modelatpos('left');
  // Update visible URL and main title name.
  view.setNameText(m.filename);
  var slashed = m.filename;
  if (m.isdir && slashed.length) { slashed += '/'; }
  view.setVisibleUrl((model.editmode ? '/edit/' : '/home/') +
      slashed, addHistory)
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
        {id: 'save', title: 'Save program (Ctrl+S)', label: 'Save',
         disabled: model.username && saveableOwner() &&
                   !view.isPaneEditorDirty(paneatpos('left')) });

      // Also insert share button
      buttons.push({
        id: 'share', title: 'Share links to this program', label: 'Share'});

      // Check now whether the file is in an activity dir so that we know whether to
      // offer 'Share Activity' when the user clicks Share.
      checkIfActivityDir();
    }

    // Offer logout button if user is logged in, else offer login button if not
    // special owner.
    if (model.username) {
      buttons.push({
        id: 'logout', label: 'Log out',
        title: 'Log out from ' + model.username});
    } else if (!specialowner()) {
      buttons.push({
        id: 'login', label: 'Log in',
        title: 'Enter password for ' + model.ownername});
    }

    // If viewing a directory, offer sorting buttons.
    if (m.isdir) {
      if (m.bydate) {
        buttons.push({id: 'byname', label: 'Alphabetize'});
      } else {
        buttons.push({id: 'bydate', label: 'Sort by Date'});
      }
    }
    buttons.push(
        {id: 'help', label: '<span class=helplink>?</span>' });
    if (m.data && m.data.file) {
      buttons.push({
        id: 'guide', label: '<span class=helplink>Guide</span>',
        title: 'Open online guide'});
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
      runCodeAtPosition('right', '', m.filename, m.template);
    }
  }
  // Update editability.
  view.setNameTextReadOnly(!model.editmode);
  view.setPaneEditorReadOnly(paneatpos('left'), !model.editmode);
  view.setPaneEditorReadOnly(paneatpos('right'), true);
  view.setPaneEditorReadOnly(paneatpos('back'), true);
}

//
// Now setup event handlers.  Each event handler corresponds to
// an ID (as specified in updateTopControls() above) and
// an event handler function
//

view.on('help', function() {
  view.flashNotification('<a href="http://' +
     window.pencilcode.domain + '/group" target="_blank">Ask a question.</a>' +
    (model.username ?
        '&emsp; <a id="setpass" href="#setpass">Change password.</a>' : '')
  );
});

view.on('tour', function() {
  // view.flashNotification('Tour coming soon.');
  setTimeout(function() { view.flashNotification('Tour coming soon.');}, 0);
});

view.on('share', function() {
  var shortfilename = modelatpos('left').filename.replace(/^.*\//, '');
  if (!shortfilename) { shortfilename = 'clip'; }
  var code = getEditTextIfAny() || '';
  shortenUrl('http://' + window.pencilcode.domain + '/edit/' +
      shortfilename + '#text=' +
      encodeURIComponent(code).replace(/%20/g, '+'),
      function(shortened) {
        opts = {};
        if (model.ownername) {
          // Share the run URL unless there is no owner (e.g., for /first).
          opts.shareRunURL = "http://" + document.domain + '/home/' +
            modelatpos('left').filename;

          if (modelatpos('left').activityDir) {
            opts.shareActivityURL = getStartActivityURL();
          }
        }
        opts.shareEditURL = window.location.href;

        opts.shareClipURL = shortened;
        opts.title = modelatpos('left').filename;

        // First save if needed (including login user if necessary)
        if (view.isPaneEditorDirty(paneatpos('left'))) {
          saveAction(false, 'Log in to share', function() {
            // Now bring up share dialog
            view.showShareDialog(opts);
          });
        }
        else {
          view.showShareDialog(opts);
        }
      });
});

view.on('bydate', function() {
  if (modelatpos('left').isdir) {
    modelatpos('left').bydate = true;
    setDefaultDirSortingByDate(true);
    renderDirectory('left');
  }
});

view.on('byname', function() {
  if (modelatpos('left').isdir) {
    modelatpos('left').bydate = false;
    setDefaultDirSortingByDate(false);
    renderDirectory('left');
  }
});

view.on('dirty', function(pane) {
  if (posofpane(pane) == 'left') {
    view.enableButton('save', specialowner() || view.isPaneEditorDirty(pane));
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

view.on('run', function() {
  var mimetext = view.getPaneEditorText(paneatpos('left'));
  if (!mimetext) {
    mimetext = view.getPaneEditorText(paneatpos('right'));
    if (!mimetext) { return; }
    cancelAndClearPosition('back');
    rotateModelLeft(true);
  }
  var runtext = mimetext && mimetext.text;
  var newdata = $.extend({}, modelatpos('left').data, {data: runtext});
  view.clearPaneEditorMarks(paneatpos('left'));
  if (!specialowner()) {
    // Save file (backup only)
    storage.saveFile(model.ownername,
        modelatpos('left').filename, newdata, false, null, true);
  }
  // Provide instant (momentary) feedback that the program is now running.
  debug.flashStopButton();
  runCodeAtPosition(
      'right', runtext,
      modelatpos('left').filename, modelatpos('left').template);
  if (!specialowner()) {
    cookie('recent', window.location.href,
        { expires: 7, path: '/', domain: window.pencilcode.domain });
  }
});

$(window).on('beforeunload', function() {
  if (view.isPaneEditorDirty(paneatpos('left')) && saveableOwner()) {
    view.flashButton('save');
    return "There are unsaved changes."
  }
});


view.on('logout', function() {
  model.username = null;
  model.passkey = null;
  cookie('login', '', { expires: -1, path: '/' });
  cookie('recent', '',
      { expires: -1, path: '/', domain: window.pencilcode.domain });
  updateTopControls(false);
  view.flashNotification('Logged out.');
});

view.on('login', function() {
  view.showLoginDialog({
    prompt: 'Log in.',
    username: model.ownername,
    validate: function(state) { return {}; },
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
        cookie('login', model.username + ':' + model.passkey,
            { expires: 1, path: '/' });
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
        cookie('login', model.username + ':' + model.passkey,
            { expires: 1, path: '/' });
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

view.on('save', function() { saveAction(false, null, null); });
view.on('overwrite', function() { saveAction(true, null, null); });
view.on('guide', function() {
  window.open('http://guide.' + window.pencilcode.domain + '/home/'); });

function saveAction(forceOverwrite, loginPrompt, doneCallback) {
  if (!saveableOwner()) {
    return;
  }
  if (specialowner()) {
    // TODO First figure out what is to be saved, then figure out if we need
    // signUpAndSave.  That way we can handle special behavior for activities
    // (e.g. hide #!pencil from beginning of file when user edits).
    signUpAndSave();
    return;
  }
  var mimetext = view.getPaneEditorText(paneatpos('left'));
  var runtext = mimetext && mimetext.text;
  var filename = modelatpos('left').filename;
  if (!runtext && runtext !== '') {
    // TODO: error message or something - or is this a deletion?
    return;
  }
  // TODO: pick the right mime type here.
  var newdata = $.extend({},
      modelatpos('left').data, { data: runtext, mime: mimetext.mime });
  // After a successful save, mark the file as clean and update mtime.
  function noteclean(mtime) {
    view.flashNotification('Saved.');
    view.notePaneEditorCleanText(
        paneatpos('left'), newdata.data);
    if (modelatpos('left').filename == filename) {
      var oldmtime = modelatpos('left').data.mtime || 0;
      if (mtime) {
        modelatpos('left').data.mtime = Math.max(mtime, oldmtime);
      }
    }
    updateTopControls();
  }
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
      handleSaveStatus(status, filename, noteclean);
      if (doneCallback) {
        doneCallback();
      }
    }
  });
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

function signUpAndSave() {
  if (!saveableOwner()) {
    return;
  }
  var mimetext = view.getPaneEditorText(paneatpos('left'));
  var mp = modelatpos('left');
  var runtext = mimetext && mimetext.text;
  var shouldCreateAccount = true;
  if (!runtext) {
    return;
  }
  var userList = [];
  storage.loadUserList(function(list) {
    if (list) {
      userList = list;
    }
  });
  view.showLoginDialog({
    prompt: 'Choose an account name to save.',
    info: 'Accounts on pencilcode are free.',
    validate: function(state) {
      var username = state.username.toLowerCase();
      shouldCreateAccount = true;
      for (var j = 0; j < userList.length; ++j) {
        if (userList[j].name.toLowerCase() == username) {
          if (userList[j].reserved) {
            return {
              disable: true,
              info: 'Name "' + username + '" reserved.'
            };
          } else {
            shouldCreateAccount = false;
            return {
              disable: false,
              info: 'Will log in as "' + username + '" and save.'
            };
          }
        }
      }
      if (username && !/^[a-z]/.test(username)) {
        return {
          disable: true,
          info: 'Username must start with a letter.'
        };
      }
      if (username && !/^[a-z][a-z0-9]*$/.test(username)) {
        return {
          disable: true,
          info: 'Invalid username.'
        };
      }
      if (state.username.length < 3) {
        return {
          disable: true,
          info: 'Real names are <a target=_blank ' +
             'href="/privacy.html">not allowed</a>.' +
             '<br>When using a Pencil Code account,' +
             '<br><label>' +
             'I agree to <a target=_blank ' +
             'href="/terms.html">the terms of service<label></a>.'
        };
      }
      return {
        disable: false,
        info: 'Will create ' + state.username.toLowerCase() +
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
      var forceOverwrite = (username != model.ownername) || specialowner();
      var key = keyFromPassword(username, state.password);
      var step2 = function() {
        storage.saveFile(
            username, mp.filename, {data: runtext, mtime: 1},
            forceOverwrite, key, false,
            function(status) {
          console.log('status was', status);
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
            view.notePaneEditorCleanText(paneatpos('left'), runtext);
            storage.deleteBackup(mp.filename);
            state.update({cancel: true});
            window.location.href =
                'http://' + username + '.' + window.pencilcode.domain +
                '/edit/' + mp.filename +
                '#login=' + username + ':' + (key ? key : '');
          }
        });
      }
      if (key && shouldCreateAccount) {
        storage.setPassKey(username, key, null, function(m) {
          if (m.error) {
            console.log('got error');
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

function logInAndSave(filename, newdata, forceOverwrite,
                      noteclean, loginPrompt, doneCallback) {
  if (!filename || !newdata || !saveableOwner()) {
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

    cookie('login', model.username + ':' + model.passkey,
           { expires: 1, path: '/' });
    if (model.ownername) {
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

    cookie('login', model.username + ':' + model.passkey,
           { expires: 1, path: '/' });

    if (!specialowner()) {
      cookie('recent', window.location.href,
             { expires: 7, path: '/', domain: window.pencilcode.domain });
    }
  }
}

function chooseNewFilename(dirlist) {
  if (!dirlist) { return 'untitled'; }
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

view.on('link', function(pane, linkname) {
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
  var openfile = base + linkname.replace(/\/$/, '');
  var isdir = /\/$/.test(linkname);
  loadFileIntoPosition('right', openfile, isdir, isdir,
    function() { rotateModelLeft(true); });
});

view.on('linger', function(pane, linkname) {
  if (pane !== paneatpos('left')) { return; }
  var base = model.pane[pane].filename;
  if (base === null) { return; }
  if (base.length) { base += '/'; }
  if (linkname == '#new') {
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
      'http://' + window.pencilcode.domain + '/edit/') {
      window.location.href = 'http://' + window.pencilcode.domain + '/';
    } else {
      window.location.href = 'http://' + window.pencilcode.domain + '/edit/';
    }
  } else {
    if (filename.indexOf('/') >= 0) {
      filename = filename.replace(/\/[^\/]+\/?$/, '');
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
      loadFileIntoPosition('back', filename, true, true);
      rotateModelRight(true);
    }
  }
}

view.on('rename', function(newname) {
  var pp = paneatpos('left');
  var mp = modelatpos('left');
  if (mp.filename === newname || !saveableOwner()) {
    // Nothing to do
    return;
  }
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
    mp.filename = newname;
    view.noteNewFilename(pp, newname);
    updateTopControls(false);
    view.setPrimaryFocus();
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
          cookie('login', model.username + ':' + model.passkey,
              { expires: 1, path: '/' });
          if (model.ownername) {
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
    view.notePaneEditorCleanText(paneatpos(position), '');
  }
}

function rotateModelLeft(addHistory) {
  debug.bindframe(null);
  view.rotateLeft();
  if (modelatpos('back').running) {
    runCodeAtPosition('back', '', null, null);
  }
  noteIfUnsaved('left');
  updateTopControls(addHistory);
}

function rotateModelRight(addHistory) {
  debug.bindframe(null);
  view.rotateRight();
  if (modelatpos('back').running) {
    runCodeAtPosition('back', '', null, null);
  }
  updateTopControls(addHistory);
}

function isFileWithin(base, candidate) {
  if (base.length && !/\/%/.test(base)) { base += '/'; }
  return candidate.length > base.length &&
      candidate.indexOf(base) === 0;
}

// Parse the string in window.location.search into '&' separated key=value pairs,
// and split those pairs, using the key as the property name in the return value object.
function parseURIKeyValues(s) {
  var variables = {};
  if ($.type(s) == 'string' && s.length) {
    $.each(s.split('&'), function(ndx, pair) {
      var parts = pair.split('='),
          key = decodeURIComponent(parts.shift()),
          value = decodeURIComponent(parts.join('='));
      if (key == '') {
        console.log('key missing in search string: ' + s);
      } else if (variables.hasOwnProperty(key)) {
        if ($.type(variables[key]) == 'string') {
          variables[key] = [ variables[key] ];
        }
        variables[key].push(value);
      } else {
        variables[key] = value;
      }
    });
  }
  return variables;
}

function parseURLCore(url) {
  var parsed, type = $.type(url);
  if (type == 'string' && $.type(window.URL) == 'function') {
    // Need a very modern browser.
    parsed = new window.URL(url, window.location.href);
  } else if (type == 'object' && url.href) {
    parsed = url;
  }
  if (!parsed) {
    console.log('parseURL failed');
    console.log(url);
    return;
  }
  // Make a deep copy of parsed, ensuring the standard URLUtils properties
  // are present.
  parsed = $.extend(true, {
      href: '',
      protocol: '',
      host: '',
      hostname: '',
      port: '',
      pathname: '',
      search: '',
      hash: '',
      username: '',
      password: '',
      origin: ''}, parsed);
  return parsed;
}

function parseURL(url) {
  var parsed = parseURLCore(url);
  // Now add our own properties to those defined in the standard for URLUtils.

  // TODO(davidbau): Explain this regexp.  It seems to mean ignore last 8
  // characters, and, working backwards, the characters up to, and including
  // the first period.  This seems designed to convert foo.pencilcode.net,
  // or foo.pencilcode.net.dev into foo, but if we were to host pencilcode
  // at pencilcode.oxford.ac.uk, then the owner would be pencilcode, which
  // seems not ideal! Perhaps we need the server to tell us the root domain.
  parsed.ownername = parsed.hostname.replace(/(?:(.*)\.)?[^.]*.{8}$/, '$1');

  // The filename is the path after to first component (e.g. without /edit
  // or /home).
  parsed.filename = parsed.pathname.replace(
          /^\/[^\/]+\//, '').replace(/\/+$/, ''),

  // Parse the key=value pairs out of the search (aka query) and the hash strings.
  parsed.searchVars = parseURIKeyValues(parsed.search.replace(/^\?+/, ''));
  parsed.hashVars = parseURIKeyValues(parsed.hash.replace(/^#+/, ''));

  // Probably a directory if the pathname ends with slash.
  parsed.isdir = /\/$/.test(parsed.pathname);

  // TODO Extract login from hash if present; appears to have the following format:
  //   login[0]="#login=user:password"
  //   login[1]="user"
  //   login[2]="password"
  // parsed.login =...

  // Extract edit mode
  parsed.editmode = /^\/edit\//.test(parsed.pathname);

  return parsed;
}

function assertEQ(a, b, msg) {
  if (a === b) return;
  alert(a + ' !== ' + b + '\n\n' + msg);
}

function readNewUrl(undo) {
  // True if this is the first url load.
  var firsturl = (model.ownername === null),
      // TODO(jamessynge): Get complete parseURL impl working, then stop depending upon
      // the patterns below.
      parsedURL = parseURL(window.location),
  // Owner comes from domain name.
      ownername = window.location.hostname.replace(
          /(?:(.*)\.)?[^.]*.{8}$/, '$1'),
  // Filename comes from URL minus first directory part
  // (i.e. without /edit/ or /home/, for example).
      filename = window.location.pathname.replace(
          /^\/[^\/]+\//, '').replace(/\/+$/, ''),
  // Expect directory if the pathname ends with slash.
      isdir = /\/$/.test(window.location.pathname),
  // Extract login from hash if present.
      login = /(?:^|#|&)login=([^:]*)(?::(\w+))?\b/.exec(window.location.hash),
  // Extract text from hash if present.
      text = /(?:^|#|&)text=([^&]*)(?:&|$)/.exec(window.location.hash),
  // Extract edit mode
      editmode = /^\/edit\//.test(window.location.pathname),
  // Extract variables in search string
      searchVars = parsedURL.searchVars;

  // Give the user a chance to abort navigation.
  if (undo && view.isPaneEditorDirty(paneatpos('left')) && saveableOwner()) {
    view.flashButton('save');
    if (!window.confirm(
      "There are unsaved changes.\n\n" +
      "Are you sure you want to leave this page?")) {
      undo();
      return;
    }
  }
  if (!login) {
    var savedlogin = cookie('login');
    login = savedlogin && /\b^([^:]*)(?::(\w+))?$/.exec(cookie('login'));
  } else if (ownername) {
    cookie('login', login, { expires: 1, path: '/' });
  }
  if (login) {
    model.username = login[1] || null;
    model.passkey = login[2] || null;
  }
  // Clean up the hash if present, and absorb the new auth information.
  if (window.location.hash.length) {
    window.location.replace('#');
    view.setVisibleUrl(window.location.pathname);
  }
  // Update global model state.
  var forceRefresh = false;
  if (model.ownername !== ownername || model.editmode !== editmode) {
    model.ownername = ownername;
    model.editmode = editmode;
    forceRefresh = true;
  }
  if (ownername === 'start' && editmode && searchVars.hasOwnProperty('activity')) {
    // User is starting a new activity (e.g. a lesson defined by a teacher).
    // TODO(davidbau): Please help figure out how this should interact with the block
    // below which animates panes.
    // Should we actually just fetch the default text for the activity at this point,
    // store that in 'text', set firsturl = true, and fall through?

    startNewActivity(filename, searchVars.activity);
    return;
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
      // if (window.console) {
      //   window.console.log('same filename; nothing done');
      // }
      return;
    }
  }
  // Remove the preview pane if just browsing, or if browsing users.
  view.setPreviewMode(
      model.editmode && (model.ownername !== "" || filename !== ""), firsturl);
  // Preload text if specified.
  if (text) {
    createNewFileIntoPosition('left', filename,
       decodeURIComponent(text[1].replace(/\+/g, ' ')));
    updateTopControls(false);
    return;
  }
  // Regular startup: load the file.
  if (forceRefresh) {
    cancelAndClearPosition('left');
  }
  loadFileIntoPosition('left', filename, isdir, isdir);
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

var stopButtonTimer = null;

function cancelAndClearPosition(pos) {
  debug.bindframe(null);
  view.clearPane(paneatpos(pos), false);
  clearPaneModel(modelatpos(pos));
}

// Runs the given code, applying template boilerplate if given.
function runCodeAtPosition(position, code, filename, template) {
  var m = modelatpos(position);
  if (!m.running) {
    cancelAndClearPosition(position);
  }
  m.running = true;
  m.filename = filename;
  var baseUrl = 'http://' + (model.ownername ? model.ownername + '.' : '') +
          window.pencilcode.domain + '/home/' + filename;
  var pane = paneatpos(position);
  // Delay allows the run program to grab focus _after_ the ace editor
  // grabs focus.  TODO: investigate editor.focus() within on('run') and
  // remove this setTimeout if we can make editor.focus() work without delay.
  setTimeout(function() {
    if (m.running) {
      view.setPaneRunText(
         pane, code, template, filename, baseUrl);
    }
  }, 1);
  if (code) {
    $.get('/log/' + filename + '?run=' +
        encodeURIComponent(code).replace(/%20/g, '+').replace(/%0A/g, '|')
        .replace(/%2C/g, ','));
  }
}

function defaultDirSortingByDate() {
  if (!window.localStorage) return false;
  if (!specialowner()) return false;
  try {
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

function createNewFileIntoPosition(position, filename, text) {
  var pane = paneatpos(position);
  var mpp = model.pane[pane];
  if (!text) { text = ''; }
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
  mpp.activityDir = false;
  view.setPaneEditorText(pane, text, filename, null);
  view.notePaneEditorCleanText(pane, '');
  mpp.running = false;
}

// Given a pane position (e.g., 'left' or 'right'), does a couple steps:
// (1) Loads the underlying file given by filename
// (2) If it is a template file, loads the template metadata
// (3) Puts the loaded data into the model.pane[pane] object for the pane
// (4) Finally, calls callback cb when done.
function loadFileIntoPosition(position, filename, isdir, forcenet, cb) {
  var pane = paneatpos(position);
  var mpp = model.pane[pane];
  var loadNum = nextLoadNumber();
  // Now if the file or owner are different from what is currently shown,
  // update the model and execute the load.
  if (mpp.filename === filename && !forcenet) {
    cb && cb();
    return;
  }
  view.clearPane(pane, true); // show loading animation.
  mpp.filename = filename;
  mpp.isdir = isdir;
  mpp.bydate = isdir && defaultDirSortingByDate();
  mpp.loading = loadNum;
  mpp.activityDir = false;
  mpp.data = null;
  mpp.running = false;
  var mpploading = {};
  function checkConsistency() {
    // This function verifies that the load that we are completing
    // is the same as the load that we started (might not be true if
    // the user clicks on load several times, faster than net responses).
    // Should be called before mutating mpp again.
    if (mpp.loading != loadNum) {
      if (window.console) {
        window.console.trace('aborted: loading is ' + mpp.loading +
            ' instead of ' + loadNum);
      }
      return false;
    }
    mpp.loading = 0;
    return true;
  }
  function firstStepLoadFile(m) {
    if (model.ownername === '' && filename === '') {
      if (!checkConsistency()) { return; }
      mpp.isdir = true;
      mpp.data = m;
      renderDirectory(posofpane(pane));
    } else if (m.directory && m.list) {
      // Directory listing.
      if (!checkConsistency()) { return; }
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
    } else {
      // The single file case.
      // TODO:
      // 2. in the offline case, notify the user that we are working offline.
      // 3. in the unsaved case, notify the user that we loaded a backup and
      //    give a link to load from network.
      if (!m.data) { m.data = ''; }
      mpploading.isdir = false;
      mpploading.data = m;
      secondStepOpenTemplate();
    }
  }
  function secondStepOpenTemplate() {
    // TODO: maybe do a prelim request instead of forcing errors when
    // the template is missing some stuff.
    var templateBaseDir = parseTemplateDirFromLoadedFile(mpploading.data);
    if (!templateBaseDir) {
      thirdStepShowEditor();
      return;
    }
    loadTemplateMetadata(templateBaseDir, function(template) {
      mpploading.template = template;
      thirdStepShowEditor();
    });
  }
  function thirdStepShowEditor() {
    if (!checkConsistency()) { return; }
    $.extend(mpp, mpploading);
    console.log('mpp.data', mpp.data, 'mpploading.data', mpploading.data)
    view.setPaneEditorText(pane, mpp.data.data, filename,
        instructionTextForTemplate(mpp.template));
    noteIfUnsaved(posofpane(pane));
    updateTopControls(false);
    cb && cb();
  }
  storage.loadFile(model.ownername, filename, forcenet, firstStepLoadFile);
};

function startNewActivity(filename, activityURL) {
  view.setPreviewMode(true /*show preview*/, true /*no animation delay*/);

  var position = 'left',
      pane = paneatpos(position),
      mpp = model.pane[pane],
      loadNum = nextLoadNumber();

  // TODO Do we need a loadnum, given that we aren't loading the user's own file?

  view.clearPane(pane, true); // show loading animation.

  mpp.filename = filename;
  mpp.isdir = false;
  mpp.loading = loadNum;
  mpp.data = {
    file: filename,
    data: '',  // To be filled in from activity.
    mtime: 0
  };
  mpp.running = false;

  function checkConsistency() {
    // This function verifies that the load that we are completing
    // is the same as the load that we started (might not be true if
    // the user clicks on load several times, faster than net responses).
    // Should be called before mutating mpp again.
    if (mpp.loading != loadNum) {
      if (window.console) {
        window.console.trace('aborted: loading is ' + mpp.loading +
            ' instead of ' + loadNum);
      }
      return false;
    }
    mpp.loading = 0;
    return true;
  }

  function activityLoaded(activityData) {
    // TODO Convert 'template' to 'activity' throughout (coordinate with others to
    // reduce the number of merge conflicts).

    // TODO If failed to load, redirect to pencilcode.net/?  OR show some error?

    if (!checkConsistency()) { return; }
    mpp.template = activityData;
    mpp.data.data = '#!pencil ' + activityData.activityURL + '\n' +
                    activityData.wrapperParts.defaultText;
    mpp.unsaved = true;
    console.log('mpp.data', mpp.data)
    view.setPaneEditorText(pane, mpp.data.data, filename,
        instructionTextForTemplate(mpp.template));
    noteIfUnsaved(posofpane(pane));
    updateTopControls(false);
  }

  loadTemplateMetadata(activityURL, activityLoaded);
}

function sortByDate(a, b) {
  return b.mtime - a.mtime;
}

function renderDirectory(position) {
  var pane = paneatpos(position);
  var mpp = model.pane[pane];
  console.log(pane, position, mpp);
  var m = mpp.data;
  var filename = mpp.filename;
  var filenameslash = filename.length ? filename + '/' : '';
  // TODO: fix up visible URL to ensure slash.
  var links = [];
  for (var j = 0; j < m.list.length; ++j) {
    var label = m.list[j].name;
    if (model.ownername === '' && filename === '') {
      if (m.list[j].mode.indexOf('d') < 0) { continue; }
      var href = 'http://' + label + '.' + window.pencilcode.domain + '/edit/';
      links.push({html:label, href:href, mtime:m.list[j].mtime});
    } else {
      if (m.list[j].mode.indexOf('d') >= 0) { label += '/'; }
      var href = '/home/' + filenameslash + label;
      links.push({html:label, link:label, href:href, mtime:m.list[j].mtime});
    }
  }
  if (mpp.bydate) {
    links.sort(sortByDate);
  }
  if (model.ownername !== '') {
    links.push({html:''});
    links.push({html:'<span class="create">Create new file</span>',
        link:'#new'});
  }
  view.setPaneLinkText(pane, links, filename);
  updateTopControls(false);
}

//
// Returns text content of the editor
// or null if there's no file loaded.
//

function getEditTextIfAny() {
  var m = modelatpos('left');
  if (m.filename && m.data && m.data.file) {
    var text = view.getPaneEditorText(paneatpos('left'));
    return (text && text.text && text.text.trim())
  }
  return null;
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
  var reqStr = 'http://call.jsonlib.com/fetch?' + escape(JSON.stringify(reqObj));

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
  var decode = function(s) {return decodeURIComponent(s.replace(/\+/g, ' '));}
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
// TEMPLATE SUPPORT (see also editor-view.js:expandRunTemplate)
///////////////////////////////////////////////////////////////////////////

// Given some saved code, pull the first line and looks to see
// if it contains a specially-formatted template URL.  If so,
// it returns it.  Otherwise, returns null.
function parseTemplateDirFromLoadedFile(code) {
  // Search for "#!pencil <url>\n" at the start of the file.
  var m = /^#!pencil[ \t]+([^\n\r]+)($|[\n\r])/.exec(code.data);
  if (m && m.index == 0) {
    var hashBangParams = m[1];
    console.log("User's file refers to a template: " + hashBangParams);
    return hashBangParams;
  }

  console.log("User's file does not refer to a template:\n" + code.data.substr(0, 100));

  return null;
}

// Given a template base directory, loads the template metadata.
function loadTemplateMetadata(templateBaseDir, callback) {
  var templateOwner, templateName, activityURL;
  if (window.URL && /^(https?:)?\/\//.test(templateBaseDir)) {
    var parsedURL = parseURL(templateBaseDir);
    templateOwner = parsedURL.ownername;
    templateName = parsedURL.filename;
    activityURL = '//' + parsedURL.hostname + '/home/' + templateName;
  }

  // TODO Remove this if block which is from our hackathon where we
  // chose to use owner:/path/to/dir as the templateBaseDir, but David
  // argues for full URL (as handled above) so we can support multiple
  // instances (root domains) of pencilcode.
  if (!templateOwner || !templateName) {
    var match = templateBaseDir.split(':');
    if (match.length != 2) {
      console.log('Failed to parse template location: ' + templateBaseDir);
      callback(null);
      return;
    }
    templateOwner = match[0];
    templateName = match[1];
    activityURL = '//' + templateOwner + "." +
                  window.pencilcode.domain + '/home/' + templateName;
  }

  var activityFile = null;
  var instructionsFile = null;
  var wrapperFile = null;

  var processTemplateDir = function(dirData) {
    // Check for wrapper and instruction files and load them.
    for (var i = 0, file; file = dirData.list[i]; i++) {
      if (file.name == 'instructions.html') {
        instructionsFile = templateName + '/' + file.name;
        storage.loadFile(templateOwner, instructionsFile, true, processInstructions);
      } else if (file.name == 'wrapper' || file.name == 'wrapper.html') {
        wrapperFile = templateName + '/' + file.name;
        storage.loadFile(templateOwner, wrapperFile, true, processWrapper);
      } else if (file.name == 'activity.json') {
        activityFile = templateName + '/' + file.name;
        storage.loadFile(templateOwner, activityFile, true, processActivity);
      }
    }
  };

  var templateData = {
    activityURL: activityURL,

    // wrapper is the file (object) that will wrap the student's code, contains
    // the strings {{start-default-text}} and {{end-default-text}} to mark where
    // the student's code should be inserted.
    wrapper: null,

    // HTML to be displayed above editor
    instructions: '',

    // From optional json file.
    metadata: null
  };

  var processInstructions = function(fileData) {
    templateData.instructions = fileData.data;
    finish();
  };

  var processWrapper = function(fileData) {
    templateData.wrapper = fileData;
    templateData.wrapperParts = view.parseTemplateWrapper(fileData.data);
    finish();
  };

  var processActivity = function(fileData) {
    templateData.metadata = JSON.parse(fileData.data);
    finish();
  };

  var finish = function() {
    if ((!instructionsFile || templateData.instructions) &&
        (!wrapperFile || templateData.wrapper) &&
        (!activityFile || templateData.metadata)) {
      callback(templateData);
    }
  }

  storage.loadFile(templateOwner, templateName, true, processTemplateDir);
}

// Given a template object, returns a piece of HTML that the IDE
// will place in a div above the code editor.
function instructionTextForTemplate(template) {
  if (template) {
    if (template.instructions)
      return template.instructions;
    else
      return null;
  } else {
    return null;
  }
}

// Check for activity files in current (left) directory, asynchronously.
// Set activityDir for model
function checkIfActivityDir() {
  var hasInstruction = false;
  var hasWrapper = false;
  var hasMetadata = false;
  var defaultPath = '';
  var m = modelatpos('left');
  var fn = m.filename;

  if (m.isdir) {
    defaultPath = fn;
  } else {
    defaultPath = fn.substr(0, fn.lastIndexOf('/'));
  }
  function detectActivityDir(data) {
    if (data.length) {
       for (var j = 0; j < data.length; ++j) {
        if (data[j].name === 'wrapper.html') {
          hasWrapper = true;
        } else if (data[j].name === 'wrapper') {
          hasWrapper = true;
        } else if (data[j].name === 'activity.json') {
          hasMetadata = true;
        }
      }
    }
    if (hasWrapper || hasMetadata) {
      var currModel = modelatpos('left');
      if (currModel === m && m.filename === fn) {
        m.activityDir = true;
      }
    }
  }
  storage.loadDirList(model.ownername, defaultPath, detectActivityDir);
}

// Construct an activity URL from the current run file path.
function getStartActivityURL() {
  var defaultPath = '';
  var m = modelatpos('left');
  var fn = m.filename;
  var aUrl = '';
  var activityDir = '';

  if (m.isdir) {
    defaultPath = fn;
  } else {
    defaultPath = fn.substr(0, fn.lastIndexOf('/'));
  }
  if (m.activityDir) {
    // Omit the protocol from the activityDir so that it defaults to
    // that used by the page.
    activityDir = "//" + document.domain + '/home/' + defaultPath;
    aUrl = ("http://start." + window.pencilcode.domain +
      '/edit/' + defaultPath + '?' + 'activity=' + activityDir);
  }
  return aUrl;
}

///////////////////////////////////////////////////////////////////////////
// CROSS-FRAME-MESSAGE SUPPORT
///////////////////////////////////////////////////////////////////////////

// parses window.location.hash params into a dict
function parseWindowLocationHash() {
  if (!window.location.hash || window.location.hash.length < 2) {
    return {};
  }

  var hash = window.location.hash.substring(1);
  var hashParts = hash.split('&');
  var hashDict = {};
  for (var i = 0; i < hashParts.length; i++) {
    if (hashParts[i].indexOf('=') === -1) {
      return {};
    }

    var separatorLocation = hashParts[i].indexOf('=');
    hashDict[hashParts[i].substring(0, separatorLocation)] = (
      decodeURIComponent(hashParts[i].substring(separatorLocation + 1)));
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
       view.setPaneEditorText(paneatpos('left'), data.args[0], null);
      break;
    case 'beginRun':
      view.run();
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
function createMessageSinkFunction() {
  var noneMessageSink = function(method, args){};

  // check we do have a parent window
  if (window.parent === window) {
    return noneMessageSink;
  }

  // validate presence of secret in hash
  if (!model.crossFrameContext.secret) {
    return noneMessageSink;
  }

  return function(method, args){
    var payload = {
        methodName: method,
        args: args};
    window.parent.postMessage(
        JSON.stringify(payload), '*');
  };
}

view.on('messageToParent', function(methodName, args){
  postMessageToParent(methodName, args);
});

view.subscribe(createMessageSinkFunction());

// For a hosting frame, publish the 'load' event before publishing
// the first 'update' events.
view.publish('load');

readNewUrl();

return model;

});
