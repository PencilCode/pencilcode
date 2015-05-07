var path = require('path');
var fs = require('fs-ext');
var lb = require('binary-search-bounds').ge;

// DirCache represents a cache of the directory listing at
// a specific path.
exports.DirCache = function DirCache(path) {
  this.path = path;
  // List is sorted by-modification-date (newest first).
  this.list = [];
  // Map is indexed by-name.
  this.map = {};
  // Array of callbacks to call if there is a rebuilding going on.
  this.rebuilding = null;
  // When was the last rebuild?
  this.rebuildTime = 0;
  // How long did it take?
  this.rebuildMs = 0;
}

// Encode the stat object for a file as a json record to be
// returned from our public API.
function encodeStat(name, statObj) {
  var modestr = '';
  if (statObj.isDirectory()) {
    modestr += 'd';
  }
  if (statObj.mode & 00400) {
    modestr += 'r';
  }
  if (statObj.mode & 00200) {
    modestr += 'w';
  }
  if (statObj.mode & 00100) {
    modestr += 'x';
  }
  var mtime = statObj.mtime.getTime();

  return {
    name: name,
    mode: modestr,
    size: statObj.size,
    mtime: mtime
  };
}

// Predicate to sort by modification-time.  If two entries have
// the same mtime, they are sorted alphabetically.
function byMtime(a, b) {
  if (a.mtime < b.mtime) {
    return -1
  }
  if (a.mtime > b.mtime) {
    return 1
  }
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}

exports.DirCache.prototype = {
  // Synchronous initialization.  To be used once, at the beginning.
  initSync: function() {
    var names = fs.readdirSync(this.path);
    var list = [];
    var map = {};
    for (var j = 0; j < names.length; ++j) {
      // Skip over names starting with .
      if (names[i][0] == '.') {
        continue;
      }
      var itempath = path.join(this.path, names[i]);
      try {
        var obj = encodeStat(names[i], fs.statSync(itempath));
        list.push(obj);
        map[names[i]] = obj;
      } catch (e) {
        // Ignore races, where a file disappears between dir and stat.
        continue;
      }
    }
    list.sort(byMtime);
    this.list = list;
    this.map = map;
  },

  // Async rebuild.  Does the work, then refreshes atomically at the
  // end, then calls the callback.
  rebuild: function(callback) {
    var batch = 32;             // Do work in 32 parallel async tasks.
    var timeLimit = 60 * 1000;  // Timeout after 60 seconds.

    // If requested a rebuild while a rebuild is in progress, just
    // queue up with the rebuild-in-progress.
    if (this.rebuilding) {
      if (callback) { this.rebuilding.push(callback); }
      return;
    }

    // We're the first: queue up our callback and note the start time.
    var self = this;
    var notify = self.rebuilding = [];
    if (callback) { notify.push(callback); }
    var startTime = (new Date).getTime();

    // Set up an abort (signalled by timeout === true) after 60 seconds.
    var timeout = setTimeout(function() {
      timeout = true;
      notifyAll(false);
    }, timeLimit);

    // Kick off an async readdir.
    fs.readdir(self.path, function(err, names) {
      // On error, we notify false and finish up.
      if (err) {
        clearTimeout(timeout);
        notifyAll(false);
        return;
      }

      // Set up data structures to receive work in progress.
      var list = [];
      var map = {};
      var next = 0;
      var inprogress = 0;
      var finished = false;

      // Kick off parallel work tasks.
      while (inprogress < batch && next < names.length) {
        loopTask();
      }
      function loopTask() {
        if (timeout === true) {
          // When aborted, tasks stop looping.
          return;
        } else if (next < names.length) {
          // If there is still more work, tasks loop via doWork.
          doWork(names[next++], loopTask);
        } else if (inprogress == 0) {
          // If there is no more work, and nothing in progress, we complete.
          completeWork();
        }
      }

      // An individual item of work is to stat a single file.
      function doWork(name, next) {
        inprogress += 1;
        var itempath = path.join(self.path, name);
        fs.stat(itempath, function(err, statobj) {
          // Errors are treated as non-existent files.
          if (!err) {
            // Accumulate the results of the stat into list and map.
            var result = encodeStat(name, statobj);
            list.push(result);
            map[name] = result;
          }
          inprogress -= 1;
          next();
        });
      }

      // When work is done, save it and notify callbacks.
      function completeWork() {
        if (!finished) {
          finished = true;
          clearTimeout(timeout);
          list.sort(byMtime);
          self.list = list;
          self.map = map;
          self.rebuildTime = (new Date).getTime();
          self.rebuildMs = self.rebuildTime - startTime;
          notifyAll(true);
        }
      }
    });

    function notifyAll(ok) {
      if (notify && notify === self.rebuilding) {
        self.rebuidling = null;
        while (notify.length) {
          notify.pop().call(null, ok);
        }
      }
    }
  },

  // Get the time since the last rebuildTime.
  age: function() {
    return (new Date).getTime() - this.rebuildTime;
  },

  // Synchronous update of a specific name.
  updateSync: function(name) {
    var itempath = path.join(this.path, name);
    var obj = null;
    try {
      encodeStat(names[i], fs.statSync(itempath));
    } catch (e) {
      // File is gone: let obj be null.
    }
    this.updateObject(name, obj);
  },

  // Async update of a specific name.
  update: function(name, callback) {
    var itempath = path.join(this.path, name);
    var obj = null;
    var self = this;
    fs.stat(itempath, function(err, statObj) {
      if (!err) {
        obj = encodeStat(name, statObj);
      }
      self.updateObject(name, obj);
      callback(true);
    });
  },

  // Updates the object for 'name' with obj (may be null)
  updateObject: function(name, obj) {
    var oldindex = -1;
    if (this.map.hasOwnProperty(name)) {
      var oldobj = this.map[name];
      // Already up to date: nothing to do!
      if (obj !== null && oldobj.mtime == obj.mtime) {
        return;
      }
      oldindex = lb(this.list, oldobj, byMtime);
      if (obj === null) {
        // Remove the item at its old position
        this.list.splice(oldindex, 1);
        delete this.map[name];
        return;
      }
    }
    if (obj == null) {
      // If the file doesn't exist, there is nothing to insert.
      return;
    }
    // Insert the item at its new position
    this.map[name] = obj;
    var index = lb(this.list, obj, byMtime);
    if (oldindex == -1) {
      // It's a new item: insert it.
      this.list.splce(index, 0, obj);
    } else {
      // It's moving in the list: shift the old items over, then set it.
      if (index < oldindex) {
        for (var j = oldindex; j > index; --j) {
          this.list[j] = this.list[j - 1];
        }
      } else if (index > oldindex) {
        for (var j = oldindex; j < index; ++j) {
          this.list[j] = this.list[j + 1];
        }
      }
      this.list[index] = obj;
    }
  },

  // Reads an array of at most "count" items that include an exact
  // matched name (if any) and the most recent prefix matches.
  readPrefix: function(prefix, count) {
    var result = [];
    // ex is 1 if we need to reserve space for an exact match.
    var ex = this.map.hasOwnProperty(prefix) ? 1 : 0;
    // fill result with all objects matching the requested prefix.
    for (var j = 0; result.length + ex < count && j < this.list.length; ++j) {
      var obj = this.list[j];
      var name = obj.name;
      if (name == prefix) {
        // If the exact match is included due to recency, set ex to zero.
        ex = 0;
        result.push(obj);
      } else if (name.length > prefix.length &&
          name.substr(0, prefix.length) == prefix) {
        // Include prefix matches by recency.
        result.push(obj);
      }
    }
    if (ex) {
      // If an exact match wasn't included due to recency, include it now.
      result.push(this.map[prefix]);
    }
    return result;
  }
};
