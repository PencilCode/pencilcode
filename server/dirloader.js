var path = require('path');
var fs = require('fs');
var lb = require('binary-search-bounds').ge;
var utils = require('./utils');

// A DirLoader represents a listing of a specific directory.
// In Pencil Code, we use it to load directories.
// It supports a few actions:
//   rebuild(callback) - reads the directory on disk (which may take
//       a sequence of async operations), then update the cache atomically
//       at the end, calling callback with "true" if successful, "false"
//       if not.  Importantly, if rebuild is requested when a rebuild
//       is already in progress, it just shares the work and notifies
//       all callbacks when the single job is done.
//   update(name, callback) - updates a single entry (with one single
//       async call to "stat"), then updates that single directory
//       entry (adding, removing, or reordering it).

exports.DirLoader = function DirLoader(path) {
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
  // Configuration: do work in 64 parallel async tasks.
  this.batchSize = 64;
  // Configuration: one callback gives up after 10 seconds.
  this.timeLimit = 10 * 1000;
  // Configuration: the whole batch gives up after 10 minutes.
  this.batchTimeLimit = 10 * 60 * 1000;
}

// Encode the stat object for a file as a json record to be
// returned from our public API.
function encodeStat(name, statObj, itempath) {
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

  var absthumb = utils.makeThumbPath(itempath);

  return {
    name: name,
    thumbnail: fs.existsSync(absthumb),   // whether there is a thumbnail
    mode: modestr,
    size: statObj.size,
    mtime: mtime
  };
}

// Predicate to sort by modification-time.  If two entries have
// the same mtime, they are sorted alphabetically.
function byMtime(a, b) {
  if (a.mtime > b.mtime) {
    // later first.
    return -1
  }
  if (a.mtime < b.mtime) {
    // earlier last.
    return 1
  }
  if (a.name < b.name) {
    // a first.
    return -1;
  }
  if (a.name > b.name) {
    // z last.
    return 1;
  }
  return 0;
}

exports.DirLoader.prototype = {
  // Async rebuild.  Does the work, then refreshes atomically at the
  // end, then calls the callback.
  rebuild: function(callback) {
    var batch = this.batchSize;
    var startTime = (new Date).getTime();
    var expTime = startTime + this.timeLimit;

    // If requested a rebuild while a rebuild is in progress, just
    // queue up with the rebuild-in-progress.
    if (this.rebuilding) {
      if (callback) {
        this.rebuilding.push({cb: callback, exp: expTime});
      }
      return;
    }

    // We're the first: queue up our callback and note the start time.
    var self = this;
    var notify = self.rebuilding = [];
    var failTime = startTime + this.batchTimeLimit;
    if (callback) { notify.push({cb: callback, exp: expTime}); }

    // When we need to abort early, we do the following incremental processing.
    var dirlisted = null;
    var list = [];
    var map = {};
    var timeout = null;

    function newest(r1, r2) {
      if (!r1) return r2;
      if (!r2) return r1;
      if (r2.mtime > r1.mtime) return r2;
      return r1;
    }

    function mergeUpdate() {
      // Before a dir listing, we have nothing to merge.
      if (!dirlisted) {
        return;
      }
      // After a dir listing, we can merge the lists.
      var mergedlist = [];
      var mergedmap = {};
      for (var n of dirlisted) {
        var latest = newest(map[n], self.map[n]);
        if (latest) {
          mergedmap[n] = latest;
          mergedlist.push(latest);
        }
      }
      // Do not delete records that are newer than startTime.
      for (var rec of self.list) {
        if (!(mergedmap.hasOwnProperty(rec.name)) && rec.mtime > startTime) {
          mergedmap[n] = rec;
          mergedlist.push(rec);
        }
      }
      // Sort and commit the merged information.
      mergedlist.sort(byMtime);
      self.list = mergedlist;
      self.map = mergedmap;
    }

    // Check for expired callbacks at timeLimit intervals.
    function notifyExpiredCallbacks() {
      if (notify !== self.rebuilding) {
        clearInterval(timeout);
        timeout = true;
        return;
      }
      // Sweep up expried callbacks.
      var now = (new Date).getTime()
      var curNotify = notify.filter(r => r.exp <= now);
      var newNotify = notify.filter(r => r.exp > now);
      // If the whole batch is expired, sweep up all remaining callbacks.
      if (now > failTime) {
        curNotify = notify;
        newNotify = null;
        clearInterval(timeout);
        timeout = true;
      }
      notify = self.rebuilding = newNotify;
      mergeUpdate();
      // Merge any updates processed so far, and notify about them.
      if (curNotify.length) {
        for (var cbr of curNotify) {
          cbr.cb.call(null, true);
        }
      }
    }
    timeout = setInterval(notifyExpiredCallbacks, this.timeLimit);

    // When work is done, stop timer and notify all callbacks right away.
    function completeWork() {
      clearInterval(timeout);
      mergeUpdate();
      self.rebuildTime = (new Date).getTime();
      self.rebuildMs = self.rebuildTime - startTime;
      notifyAll(true);
    }
    function notifyAll(ok) {
      if (notify && notify === self.rebuilding) {
        self.rebuilding = null;
        while (notify.length) {
          notify.pop().cb.call(null, ok);
        }
      }
    }

    // Kick off an async readdir.
    fs.readdir(self.path, function(err, names) {
      // On error, we notify and error right away and finish up.
      if (err) {
        clearInterval(timeout);
        timeout = true;
        notifyAll(false);
        return;
      }

      // Set up data structures to receive work in progress.
      dirlisted = names;
      var next = 0;
      var inprogress = 0;

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
        if (name[0] == '.') {
          // Skip past any dirs starting with a '.'
          next();
          return;
        }
        inprogress += 1;
        var itempath = path.join(self.path, name);
        fs.stat(itempath, function(err, statobj) {
          // Errors are treated as non-existent files.
          if (!err) {
            // Accumulate the results of the stat into list and map.
            var result = encodeStat(name, statobj, itempath);
            list.push(result);
            map[name] = result;
          }
          inprogress -= 1;
          next();
        });
      }

    });

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
      obj = encodeStat(names[i], fs.statSync(itempath), itempath);
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
        obj = encodeStat(name, statObj, itempath);
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
      this.list.splice(index, 0, obj);
    } else {
      // It's moving in the list: shift the old items over, then set it.
      if (index < oldindex) {
        for (var j = oldindex; j > index; --j) {
          this.list[j] = this.list[j - 1];
        }
      } else if (index > oldindex) {
        // If shifting right, our target index is off-by-one because
        // we ourselves are to the left of our destination index.
        index -= 1;
        for (var j = oldindex; j < index; ++j) {
          this.list[j] = this.list[j + 1];
        }
      }
      this.list[index] = obj;
    }
  },

  // Reads an array of at most "count" items that include an exact
  // matched name (if any) and the most recent prefix matches.
  // Items will be returned in modification order (most recent first),
  // except that any exact match will be listed first.
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
        result.unshift(obj);
      } else if (name.length > prefix.length &&
          name.substr(0, prefix.length) == prefix) {
        // Include prefix matches by recency.
        result.push(obj);
      }
    }
    if (ex) {
      // If an exact match wasn't included due to recency, include it now.
      result.unshift(this.map[prefix]);
    }
    return result;
  }
};
