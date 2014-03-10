require.config({
  baseUrl: '/',
  paths: {
    'editor-view': 'src/editor-view',
    'editor-storage': 'src/editor-storage',
    'editor-debug': 'src/editor-debug',
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
  'see'],
function($, view, storage, debug, seedrandom, see) {

eval(see.scope('controller'));

var model = {
  // Owner name of this file or directory.
  ownername: null,
  // True if /edit/ url.
  editmode: false,
  // Contents of the three panes.
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
  return (!model.ownername || model.ownername === 'guide' ||
          model.ownername === 'event');
}

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
        {id: 'save', title: 'Ctrl+S', label: 'Save',
         disabled: !specialowner() && model.username &&
                   !view.isPaneEditorDirty(paneatpos('left')) });

      // Also insert share button
      buttons.push({id: 'share', label: 'Share'});
    }

    //
    // If this directory is owned by some person (i.e. not specialowner)
    //

    if (!specialowner()) {
      //
      // Then insert logout/login buttons depending on if someone
      // is already logged in
      //
      if (model.username) {
        buttons.push({id: 'logout', label: 'Log out'});
      } else {
        buttons.push({id: 'login', label: 'Log in'});
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
      }
    }
    buttons.push(
        {id: 'help', label: '<span class=helplink>?</span>' });
    if (m.data && m.data.file) {
      buttons.push(
        {id: 'guide', label: '<span class=helplink>Guide</span>' });
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
      runCodeAtPosition('right', '', m.filename);
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
    // End debugging session when text is edited.
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
  runCodeAtPosition('right', runtext, modelatpos('left').filename);
  if (!specialowner()) {
    cookie('recent', window.location.href,
        { expires: 7, path: '/', domain: window.pencilcode.domain });
  }
});

$(window).on('beforeunload', function() {
  if (view.isPaneEditorDirty(paneatpos('left'))) {
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
  if (specialowner()) {
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
  if (!filename || !newdata) {
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
  if (mp.filename === newname) {
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
    runCodeAtPosition('back', '', null);
  }
  noteIfUnsaved('left');
  updateTopControls(addHistory);
}

function rotateModelRight(addHistory) {
  debug.bindframe(null);
  view.rotateRight();
  if (modelatpos('back').running) {
    runCodeAtPosition('back', '', null);
  }
  updateTopControls(addHistory);
}

function isFileWithin(base, candidate) {
  if (base.length && !/\/%/.test(base)) { base += '/'; }
  return candidate.length > base.length &&
      candidate.indexOf(base) === 0;
}

function readNewUrl(undo) {
  // True if this is the first url load.
  var firsturl = (model.ownername === null),
  // Owner comes from domain name.
      ownername = window.location.hostname.replace(
          /(?:(.*)\.)?[^.]*.{8}$/, '$1'),
  // Filename comes from URL minus first directory part.
      filename = window.location.pathname.replace(
          /^\/[^\/]+\//, '').replace(/\/+$/, ''),
  // Expect directory if the pathname ends with slash.
      isdir = /\/$/.test(window.location.pathname),
  // Extract login from hash if present.
      login = /(?:^|#|&)login=([^:]*)(?::(\w+))?\b/.exec(window.location.hash),
  // Extract text from hash if present.
      text = /(?:^|#|&)text=([^&]*)(?:&|$)/.exec(window.location.hash),
  // Extract edit mode
      editmode = /^\/edit\//.test(window.location.pathname);
  // Give the user a chance to abort navigation.
  if (undo && view.isPaneEditorDirty(paneatpos('left'))) {
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
       decodeURIComponent(text[1].replace(/\+/g, ' ')) + '\n');
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
  modelatpos(pos).loading = 0;
  modelatpos(pos).filename = null;
  modelatpos(pos).isdir = false;
  modelatpos(pos).data = null;
  modelatpos(pos).bydate = false;
  modelatpos(pos).running = false;
}

function runCodeAtPosition(position, code, filename) {
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
      view.setPaneRunText(pane, code, filename, baseUrl);
    }
  }, 0);
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
  view.setPaneEditorText(pane, text, filename);
  view.notePaneEditorCleanText(pane, '');
  mpp.running = false;
}


function loadFileIntoPosition(position, filename, isdir, forcenet, cb) {
  var pane = paneatpos(position);
  var mpp = model.pane[pane];
  var loadNum = nextLoadNumber();
  // Now if the file or owner are different from what is currently shown,
  // update the model and execute the load.
  if (mpp.filename === filename && !forcenet) {
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
          window.console.log('aborted: loading is ' + mpp.loading + ' instead of ' + loadNum);
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
      } else {
        // The single file case.
        // TODO:
        // 2. in the offline case, notify the user that we are working offline.
        // 3. in the unsaved case, notify the user that we loaded a backup and
        //    give a link to load from network.
        if (!m.data) { m.data = ''; }
        mpp.isdir = false;
        mpp.data = m;
        view.setPaneEditorText(pane, m.data, filename);
        noteIfUnsaved(posofpane(pane));
        updateTopControls(false);
        cb && cb();
      }
    });
  }
};

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
  $.getJSON('http://call.jsonlib.com/fetch', {
    dataType: 'json',
    // type: 'POST',
    url: 'https://www.googleapis.com/urlshortener/v1/url?' +
         'key=AIzaSyCSnpkwynMDLa7h_lkx4r7QDb2sjqdrFTo',
    header: 'Content-Type: application/json',
    data: JSON.stringify({longUrl: url})},
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

readNewUrl();

return model;

});
