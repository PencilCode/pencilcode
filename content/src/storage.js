///////////////////////////////////////////////////////////////////////////
// STORAGE AND CACHE SERVICE
///////////////////////////////////////////////////////////////////////////

var $        = require('jquery'),
    see      = require('see'),
    filetype = require('filetype');


eval(see.scope('storage'));
function hasBackup(filename) {
  try {
    if (!window.localStorage) return false;
    return ('backup:' + filename) in window.localStorage;
  } catch (e) {
    return false;
  }
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
  try {
    if (!window.localStorage) return;
    if (msg == null) { msg = null; }
    window.localStorage['backup:' + filename] = JSON.stringify(msg);
  } catch(e) { }
}

function deleteBackup(filename) {
  try {
    if (!window.localStorage) return;
    delete window.localStorage['backup:' + filename];
  } catch(e) { }
}

function deleteBackupPrefix(filename) {
  try {
    if (!window.localStorage) return;
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
  try {
    if (!window.localStorage) return false;
    var backup = window.localStorage.getItem('backup:' + filename);
    if (!backup) return false;
    backup = JSON.parse(backup);
    // If backup is empty, then don't prefer the backup.
    if (!backup.data || /^\s*$/.test(backup.data)) {
      return false;
    }
    // If backup is identical to net file (ignoring extra blank lines),
    // then don't prefer the backup.
    if (backup.data.replace(/\s*($|\n)/g, '$1') ===
        m.data.replace(/\s*($|\n)/g, '$1')) {
      return false;
    }
    // If we have an unsaved backup, show it.
    if (preferUnsaved && backup.unsaved) { return true; }
    var btime = backup.btime || backup.btime;
    if (btime && m.mtime && btime > m.mtime) {
      // If the backup is newer than original file and still
      // less than 12 hours old then prefer it; otherwise discard it.
      if ((new Date - btime) / 1000 / 60 / 60 < 12) {
        return true;
      }
    }
  } catch(e) { console.log(e); }
  return false;
}

// When there is a problem posting cross-domain, display a link
// to the domain so that users can bring up firewall UI for an expln.
function networkErrorMessage(domain) {
  if (domain != window.location.hostname) {
    return 'Test your connection to <br><a href="//' + domain +
        '/" target="_blank">' + domain + '</a>.';
  } else {
    return 'Network error.';
  }
}

window.pencilcode.storage = {
  updateUserSet: function(prefix, set, cb) {
    prefix = prefix || '';
    if (set.hasOwnProperty(prefix)) {
      // If we already know about this username, do nothing.
      cb(set);
      return;
    }
    $.getJSON('//' + window.pencilcode.domain + '/load/',
        { prefix: prefix, count: 12 }, function(m) {
      if (m && m.directory && m.list) {
        for (var j = 0; j < m.list.length; ++j) {
          var reserved = (m.list[j].mode.indexOf('d') < 0);
          set[m.list[j].name] = reserved ? 'reserved' : 'user';
        }
        if (!set.hasOwnProperty(prefix)) {
          set[prefix] = 'nouser';
        }
        cb(set);
        return;
      }
      cb(set);
    }).fail(function() {
      if (!set.hasOwnProperty(prefix)) {
        set[prefix] = 'error';
      }
      cb(set);
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
    var preloaded = null;
    if (window.pencilcode.preloaded) {
      var data = window.pencilcode.preloaded,
          expect = (ownername ? '/' + ownername : '')  + '/' + filename;
      window.pencilcode.preloaded = null;
      if (data.directory == expect || data.file == expect) {
        console.log('Preloaded data', expect);
        preloaded = data;
      }
    }
    if (ownername == 'frame') {
      setTimeout(function() {
        callback({data: null, newfile: true});
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
    if (preloaded) {
      setTimeout(function() { handleNetworkLoad(preloaded); }, 0);
    } else {
      $.getJSON((ownername ? '//' + ownername + '.' +
                 window.pencilcode.domain : '') +
          '/load/' + filename, handleNetworkLoad).error(handleNetworkError);
    }

    function handleNetworkLoad(m) {
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
      if (!ignoreBackup && isBackupPreferred(filename, m)) {
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
    }

    function handleNetworkError() {
      if (!ignoreBackup & hasBackup(filename)) {
        // If something failed in the load, fall back to the cached
        // backup {offline:true}.
        callback(loadBackup(filename, {offline:true}));
      } else {
        // Unless there is no cached backup; then report a generic network
        // down error message.
        callback({error:"Network down.", down:true});
      }
    }
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
    var msg = $.extend({}, data), now = +(new Date);
    if (!/pencil/.test(filetype.mimeForFilename(filename)) ||
        filetype.isDefaultMeta(msg.meta)) {
      // Only 'pencil' type documents should save meta.
      msg.meta = null;
    }
    msg.unsaved = true;
    // When backupOnly is requested, it's not a network-save request.
    if (!backupOnly) {
      // The needsave flag will indicate that the user wanted to do a
      // full save.
      msg.needsave = true;
    } else {
      // When making a pure backup, stamp with the current backup time.
      msg.btime = now;
    }
    delete msg.offline;
    if (!msg.data || msg.data == '' || msg.data == '\n') {
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
    // Attempt the network save: pack up any metadata, and set up
    // the conditional argument and the weak authentication key.
    var payload = { data: msg.data, meta: JSON.stringify(msg.meta) };
    if (msg.thumbnail) {  // Send thumbnail data to server if it exists.
      payload.thumbnail = msg.thumbnail;
    }
    if (msg.mtime && !force) {
      payload.conditional = msg.mtime;
    }
    if (key) {
      payload.key = key;
    }
    var payloadsize = payload.data.length + payload.meta.length;

    // Do the network save.
    var domain = (ownername ? ownername + '.' : '') + window.pencilcode.domain;
    var crossdomain = (window.location.hostname != domain);
    $.ajax({
      url: (ownername ? '//' + domain : '') +
          '/save/' + filename,
      data: payload,
      dataType: 'json',
      // Use a GET if crossdomain and the payload is short.  Note that
      // a longer payload will fail on IE, and anecdotally a crossdomain
      // POST (even with CORS) will fail on mobile browsers.
      type: (crossdomain && payloadsize < 1024) ? 'GET' : 'POST',
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
            // Commit backup without 'unsaved' if it is still unchanged.
            delete msg.unsaved;
            delete msg.needsave;
            delete msg.btime;
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

module.exports = window.pencilcode.storage;

