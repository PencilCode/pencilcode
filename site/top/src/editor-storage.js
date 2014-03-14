///////////////////////////////////////////////////////////////////////////
// STORAGE AND CACHE SERVICE
///////////////////////////////////////////////////////////////////////////

define(['jquery', 'see'],
function($, see) {

eval(see.scope('storage'));
function hasBackup(filename) {
  if (!window.localStorage) return false;
  return ('backup:' + filename) in window.localStorage;
}

function isOnline() {
  // PhantomJS (headless testing) gets this wrong.
  // https://github.com/ariya/phantomjs/issues/10647
  return window.navigator.onLine ||
         null != window.navigator.userAgent.match(/PhantomJS/);
}

function loadBackup(filename, annotation) {
  try {
    var result = JSON.parse(window.localStorage['backup:' + filename]);
    if (annotation) {
      $.extend(result, annotation);
    }
    return result;
  } catch(e) {
    return { error: 'Backup load failed.', down: true };
  }
}

function saveBackup(filename, msg) {
  if (!window.localStorage) return;
  try {
    window.localStorage['backup:' + filename] = JSON.stringify(msg);
  } catch(e) { }
}

function deleteBackup(filename) {
  if (!window.localStorage) return;
  try {
    delete window.localStorage['backup:' + filename];
  } catch(e) { }
}

function deleteBackupPrefix(filename) {
  if (!window.localStorage) return;
  try {
    var prefix = 'backup:' + filename;
    delete window.localStorage[prefix];
    if (filename.length > 0 &&
        filename.substring(filename.length - 1) != '/') { prefix += '/'; }
    var toDelete = [];
    for (var j = 0; j < localStorage.length; j++) {
      if (localStorage.key(j).indexOf(prefix) === 0) {
        toDelete.push(localStorage.key(j));
      }
    }
    for (var j = 0; j < toDelete.length; j++) {
      delete window.localStorage[toDelete[j]];
    }
  } catch(e) {
  }
}

function isBackupPreferred(filename, m, preferUnsaved) {
  if (!window.localStorage) return false;
  try {
    var result = JSON.parse(window.localStorage['backup:' + filename]);
    // If backup is empty, then don't prefer the backup.
    if (/^\s*$/.test(result.data)) {
      return false;
    }
    // If backup is identical to net file (ignoring extra blank lines),
    // then don't prefer the backup.
    if (result.data.replace(/\s*($|\n)/g, '$1') ===
        m.data.replace(/\s*($|\n)/g, '$1')) {
      return false;
    }
    if (preferUnsaved && result.unsaved) { return true; }
    if (result.mtime && m.mtime && result.mtime > m.mtime) { return true; }
  } catch(e) {
  }
  return false;
}

// When there is a problem posting cross-domain, display a link
// to the domain so that users can bring up firewall UI for an expln.
function networkErrorMessage(domain) {
  if (domain != window.location.hostname) {
    return 'Test your connection to <a href="//' + domain +
        '/" target="_blank">' + domain + '</a>.';
  } else {
    return 'Network error.';
  }
}

// Returns true if the owner is the special user 'drive'.
function isGDrive(owner) {
  return owner == 'drive';
}

window.pencilcode.storage = {
  loadUserList: function(cb) {
    $.getJSON('http://' + window.pencilcode.domain + '/load/', function(m) {
      if (m && m.directory && m.list) {
        var result = [];
        for (var j = 0; j < m.list.length; ++j) {
          var reserved = (m.list[j].mode.indexOf('d') < 0);
          result.push({ name: m.list[j].name, reserved: reserved});
        }
        cb(result);
        return;
      }
      cb(null);
    });
  },
  // Given a filename (no owner, leading, or trailing slash),
  // attempts to load the file (or directory) and then calls callback
  // with the message.  Also automatically caches things in the backup store.
  loadFile: function(ownername, filename, ignoreBackup, callback) {
    if (!ownername && filename.indexOf('/') >= 0) {
      setTimeout(function() {
        callback({error: "Cannot load."});
      }, 0);
      return;
    }
    if (!ignoreBackup && !isOnline() && hasBackup(filename)) {
      // If the user is offline, then the cached backup is returned
      // marked with {offline:true}.
      setTimeout(function() {
        callback(loadBackup(filename, {offline:true}));
      }, 0);
      return;
    }
    if (isGDrive(ownername)) {
      // TODO (gdrive) - split filename into UID/fileid, then
      // use the gdrive API to load it.
      console.log('TODO: gdrive should load', filename);
      callback({error: 'Should load ' + filename + '. Not yet implemented.'});
    }
    $.getJSON((ownername ? '//' + ownername + '.' +
               window.pencilcode.domain : '') +
        '/load/' + filename, function(m) {
      // If there is no owner, we are not allowed to load directories
      if (!ownername && filename && m.directory) {
        callback({error: "Cannot load."});
      }
      if (m.error) {
        if (!ignoreBackup & hasBackup(filename)) {
          // If something failed in the load, fall back to the cached
          // backup {offline:true}.
          callback(loadBackup(filename, {offline:true}));
        }
        // If there was a failure without a cached backup, return the
        // error without caching it.
        callback(m);
        return;
      }
      if (!ignoreBackup && isBackupPreferred(filename, m, true)) {
        // If the backup is preferred (newer or unsaved), then return it
        // and mark it as a backup.
        callback(loadBackup(filename, {backup:true,offline:false}));
      } else {
        // Otherwise, return the network loaded file.  Note that we only
        // back up this loaded file if ignoreBackup is false.
        if (!ignoreBackup) {
          saveBackup(filename, m);
        }
        callback(m);
      }
    }).error(function() {
      if (!ignoreBackup & hasBackup(filename)) {
        // If something failed in the load, fall back to the cached
        // backup {offline:true}.
        callback(loadBackup(filename, {offline:true}));
      } else {
        // Unless there is no cached backup; then report a generic network
        // down error message.
        callback({error:"Network down.", down:true});
      }
    });
  },
  // Given the filename (no owner, leading, or trailing slash),
  // attempts to save the file and then calls callback with the success code.
  // 2. Otherwise we're online and the network save is attempted, conditional
  //    on not overwriting a file newer than the given overwriteMtime (if set).
  // 3. If the network save failed with newer:newtime or needauth:key,
  //    or some other reason, a backup is made with unsaved:true set, and
  //    the error message is returned.
  // 4. If the network save succeeded, the file is saved as a backup (without
  //    unsaved set) and success:true, mtime:mtime is the status.
  saveFile: function(ownername,
      filename, data, force, key, backupOnly, callback) {
    // Always stick the data in the backup immediately, marked as unsaved.
    var msg = $.extend({}, data);
    msg.unsaved = true;
    delete msg.offline;
    if (data == '' || data == '\n') {
      // If saving an empty file, delete the backup.
      deleteBackup(filename);
    } else {
      saveBackup(filename, msg);
    }
    if (backupOnly || !isOnline()) {
      // If the user is offline or the backupOnly flag is set, then we're done.
      // The return status is backup:true if backupOnly and offline:true
      // otherwise.
      setTimeout(function() { callback && callback(
        backupOnly ? {backup:true} : {offline:true}); }, 0);
      return;
    }
    // Attempt the network save: set up the conditional argument and the
    // weak authentication key.
    var payload = { data: msg.data };
    if (msg.mtime && !force) {
      payload.conditional = msg.mtime;
    }
    if (key) {
      payload.key = key;
    }
    var domain = (ownername ? ownername + '.' : '') + window.pencilcode.domain;
    var crossdomain = (window.location.hostname != domain);
    $.ajax({
      url: (ownername ? '//' + domain : '') +
          '/save/' + filename,
      data: payload,
      dataType: 'json',
      type: crossdomain ? 'GET' : 'POST',
      success: function(m) {
        var check;
        if (m.error) {
          // Pass errors on to calback.  Backup already done.
          console.log('got error ' + m.error);
        } else if (m.deleted) {
          // On a successful delete, also delete the backup
          // (if nothing new has since been entered in backup).
          check = loadBackup(filename);
          if (check && check.data === msg.data) {
            deleteBackup(filename);
          }
        } else {
          // On a successful save, re-commit the backup with the new
          // mtime and without the unsaved bit (if nothing new has since
          // been entered in the backup).
          check = loadBackup(filename);
          if (check && check.data === msg.data) {
            // Commit backup if it is still unchanged.
            delete msg.unsaved;
            delete msg.offline;
            if (m.mtime) { msg.mtime = m.mtime; }
            saveBackup(filename, msg);
          }
        }
        callback && callback(m);
      }
    }).error(function() {
      console.log('got error ' + domain);
      callback && callback({
        error: networkErrorMessage(domain),
        offline:true
      });
    });
  },
  moveFile: function(ownername, sourcefile, filename, key, copy, callback) {
    var payload = {
      source: ownername + '/' + sourcefile
    };
    if (!copy) { payload.mode = 'mv'; }
    if (key) { payload.key = key; }
    $.post('//' + ownername + '.' + window.pencilcode.domain + '/save/' +
        filename, payload, function(m) {
      var check;
      if (m.error) {
        // Pass errors on to calback.  Don't affect backup.
      } else {
        // On a successful move, just delete the backup of everything
        // in the source area.  TODO: move the backup tree instead.
        deleteBackupPrefix(sourcefile);
      }
      callback && callback(m);
    }, 'json').error(function() {
      callback && callback({
        error: networkErrorMessage(ownername + '.' + window.pencilcode.domain),
        offline:true
      });
    });
  },
  setPassKey: function(ownername, key, oldkey, callback) {
    $.post('//' + ownername + '.' + window.pencilcode.domain + '/save/',
        $.extend({ mode: 'setkey', data: key}, oldkey ? { key: oldkey } : {}),
        function(m) {
      callback && callback(m);
    }, 'json').error(function() {
      console.log('got error here');
      callback && callback({
         error: networkErrorMessage(ownername + '.' + window.pencilcode.domain),
         offline:true
      });
    });
  },
  deleteBackup: deleteBackup,
  deleteAllBackup: function() {
    deleteBackupPrefix('');
  },
  // TODO: cache-refreshing crawl.
  recrawlCache: function() {
    // Load dirtree URL
    // Then backup all directories
    // Then (breadthfirst) compare all file entry mtimes to backup mtimes.
  }
};

return window.pencilcode.storage;

});

