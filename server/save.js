var path = require('path');
var fs = require('fs');
var fsExtra = require('fs-extra');
var utils = require('./utils');
var filemeta = require('./filemeta');
var filetype = require('../content/src/filetype');

exports.handleSave = function(req, res, app) {
  var THUMB_DIR = '.thumbs/';

  var data = utils.param(req, 'data');
  var meta = utils.param(req, 'meta');
  var thumbnail = utils.param(req, 'thumbnail');
  var sourcefile = utils.param(req, 'source');
  var mode = utils.param(req, 'mode');
  var conditional = utils.param(req, 'conditional');
  var key = utils.param(req, 'key');
  var sourcekey = utils.param(req, 'sourcekey', key);

  try {
    var user = res.locals.owner;
    var filename = utils.param(req, "file", utils.filenameFromUri(req));
    var thumbname = path.join(path.dirname(filename), THUMB_DIR,
                              path.basename(filename) + '.png');

    /*
    console.log({
      user: user,
      key: key,
      filename: filename,
      mode: mode,
      data: data,
      sourcefile: sourcefile,
      conditional: conditional});
    */

    try {
      fsExtra.removeSync(utils.getRootCacheName(app));
    }
    catch (e) { }

    //
    // Validate parameters
    //

    if (data && sourcefile) {
      utils.errorExit('Cannot supply both data and source');
    }

    if (mode) {
      switch (mode) {
        case 'mv':
          if (!sourcefile) {
            utils.errorExit('No source specified for mv');
          }
          break;
        case 'setkey':
          if (!data && sourcefile) {
            utils.errorExit('Invalid parameters specified for setkey');
          }
          break;
        case 'rmtree':
          if (data || sourcefile) {
            utils.errorExit('Either data or source specified for rmtree');
          }
          break;
        default:
          utils.errorExit('Unknown mode type');
      }
    }

    if (conditional) {
      conditional = new Date(conditional);
    }

    // validate username
    var userdir = null;
    if (user) {
      utils.validateUserName(user);
      filename = path.join(user, filename);
      thumbname = path.join(user, thumbname);
      userdir = utils.getUserHomeDir(user, app);
    }

    var topdir = false;
    if (!utils.isFileNameValid(filename, true)) {
      if (mode == 'setkey' ||
          (!data && (mode == 'rmtree' || mode == 'mv' || !sourcefile)) &&
          /^[\w][\w\\-]*\/?$/.test(filename)) {
        topdir = true;
      }
      else {
        utils.errorExit('Bad filename ' + filename);
      }
    }

    // Parse and validate meta.
    if (meta != null) {
      try {
        meta = JSON.parse(meta);
      } catch (e) {
        utils.errorExit('Malformed json meta: ' + meta);
      }
    }

    if (filetype.isDefaultMeta(meta)) {
      meta = null;
    }


    var absfile = utils.makeAbsolute(filename, app);
    var absthumb = utils.makeAbsolute(thumbname, app);

    //
    // Validate that users key matches the supplied key
    //

    if (!isValidKey(user, key, app)) {
      var msg = (key) ? 'Incorrect password.' : 'Password protected.';
      res.json({error: msg, 'needauth': 'key'});
      return;
    }

    //
    // Handle setkey
    //

    if (mode == 'setkey') {
      if (!topdir) {
        utils.errorExit('Can only set key on a top-level user directory.');
      }

      doSetKey(user, key, data, res, app);
      res.json((data) ? {keyset: user} : {keycleared: user});
      return;
    }

    //
    // Handle the copy/move case
    //

    if (sourcefile) {
      if (!/^(?:[\w][\w\.\-]*)(?:\/[\w][\w\.\-]*)*\/?$/.test(sourcefile)) {
        utils.errorExit('Bad source filename: ' + sourcefile);
      }

      sourceuser = filenameuser(sourcefile);

      var absSourceFile = utils.makeAbsolute(sourcefile, app);
      if (!fs.existsSync(absSourceFile)) {
        utils.errorExit('Source file does not exist. ' + sourcefile);
      }

      // Only directories can be copied or moved to the top
      if (topdir && !fs.statSync(absSourceFile).isDirectory()) {
        utils.errorExit('Bad filename. ' + filename);
      }

      // mv requires authz on the source dir
      if (mode == 'mv') {
        if (!isValidKey(sourceuser, sourcekey, app)) {
          var msg = (!key) ?
              'Source password protected.' : 'Incorrect source password.';
          res.json({error: msg, 'auth': 'key'});
          return;
        }
      }

      // Create target parent directory if needed
      if (!fs.existsSync(path.dirname(absfile)) ||
          !fs.statSync(path.dirname(absfile)).isDirectory()) {
        checkReservedUser(user, app);
        tryToMkdirsSync(absfile);
      }

      // move case
      if (mode == 'mv') {
        if (fs.existsSync(absfile)) {
          utils.errorExit('Cannot replace existing file: ' + filename);
        }

        try {
          fs.renameSync(absSourceFile, absfile);

          // Cleanup directories if necessary
          removeDirsSync(path.dirname(absSourceFile));

          // Remove .key if present, because we don't want to
          // propagate password data
          if (utils.isPresent(path.join(absfile, '.key'))) {
            fsExtra.removeSync(path.join(absfile, '.key'));
          }
        }
        catch (e) {
          utils.errorExit('Could not move ' + sourcefile + ' to ' + filename);
        }
      }
      else {
        // Copy case
        try {
          // Are we copying a directory?
          if (utils.isPresent(absSourceFile, 'dir')) {
            if (fs.existsSync(absfile)) {
              utils.errorExit(
                  'Cannot overwrite existing directory ' + filename);
            }

            fsExtra.copySync(absSourceFile, absfile);

            // Remove .key if present, because we don't want to
            // propagate password data.
            if (utils.isPresent(path.join(absfile, '.key'))) {
              fsExtra.removeSync(path.join(absfile, '.key'));
            }
          }
          else {
            fsExtra.copySync(absSourceFile, absfile);
          }
        }
        catch (e) {
          utils.errorExit('Could not copy ' + sourcefile + ' to ' + filename);
        }
      }

      touchUserDir(userdir);
      res.json({saved: '/' + filename});
      return;
    }

    //
    // Enforce the conditional request if present
    //

    if (conditional) {
      if (fs.existsSync(absfile)) {
        mtime = fs.statSync(absfile).mtime.getTime();
        if (mtime > conditional) {
            res.json({error: 'Did not overwrite newer file.',
                      newer: mtime});
            return;
        }
      }
    }

    //
    // Handle the delete case
    //

    if (!data && !(meta && (meta.html || meta.css))) {
        //if (!req.body.hasOwnProperty('data')) {
        //utils.errorExit('Missing data= form field argument.');
        //}

      if (fs.existsSync(absthumb)) {
        tryToRemoveSync(absthumb);
      }

      if (fs.existsSync(absfile)) {
        tryToRemoveSync(absfile);
      }

      if (userdir != absfile) {
        touchUserDir(userdir);
      }

      res.json({'deleted' : filename});
      return;
    }

    // Validate data
    if (data.length > 1024 * 1024) {
      utils.errorExit('Data too large.');
    }

    //
    // Finally handle the create/replace case
    //

    if (!fs.existsSync(path.dirname(absfile)) ||
        !fs.statSync(path.dirname(absfile)).isDirectory()) {
      checkReservedUser(user, app);
      tryToMkdirsSync(absfile);
    }

    var content = filemeta.printMetaString(data, meta);
    fd = tryToWriteFileSync(absfile, content);

    // If thumbnail exists and it is valid, remove the data url header.
    // and then save as png.
    if (thumbnail && /^data:image\/png;base64,/.test(thumbnail)) {
      var base64data = thumbnail.replace(/^data:image\/png;base64,/, '');
      tryToMkdirsSync(absthumb);
      tryToWriteFileSync(absthumb, base64data, { encoding: 'base64' });
    }

    var statObj = fs.statSync(absfile);
    touchUserDir(userdir);
    res.json({
      saved: '/' + filename,
      mtime: statObj.mtime.getTime(),
      size: statObj.size
    });
  }
  catch (e) {
    if (e instanceof utils.ImmediateReturnError) {
      res.json(e.jsonObj);
    }
    else {
      throw e;
    }
  }
}

function tryToWriteFileSync(absfilename, data, options) {
  try {
    return fs.writeFileSync(absfilename, data, options);
  } catch (e) {
    utils.errorExit('Error writing file: '  absfilename);
  }
}

function tryToMkdirsSync(absfilename) {
  try {
    fsExtra.mkdirsSync(path.dirname(absfilename));
  } catch (e) {
    utils.errorExit('Could not create dir: '  path.dirname(absfilename));
  }
}

function tryToRemoveSync(absfilename) {
  try {
    fsExtra.removeSync(absfilename);
  } catch (e) {
    utils.errorExit('Could not remove: '  absfilename);
  }

  try {
    removeDirsSync(path.dirname(absfilename));
  } catch (e) { }
}

function touchUserDir(userdir) {
  try {
    var now = new Date;
    fs.utimesSync(userdir, now, now);
  }
  catch (e) { }
}

function filenameuser(filename) {
  var m = filename.match(/^([\w][\w\.\-]*)(?:\/.*)?$/);

  return (m) ? m[1] : null;
}

function removeDirsSync(dirStart) {
  for (var dir = dirStart; ; dir = path.dirname(dir)) {
    try {
      fs.rmdirSync(dir);
    } catch (e) {
      // Failed to remove dir, assume not empty.
      break;
    }
  }
}

function isValidKey(user, key, app) {
  //
  // keydir is the directory containing the hashed user password.
  // It's a subdir off the user home directory called '.key'.
  // Contents of this directory are files that are named
  // with the hashed user password
  //

  var keydir = utils.getKeyDir(user, app);
  var statObj = null;

  if (!utils.isPresent(keydir, 'dir')) {
    return true;
  }

  // Now we know its a directory
  var keys = fs.readdirSync(keydir);
  if (!keys || keys.length == 0) {
    // No key files, must mean no password for user.
    // So assume that this is valid.
    return true;
  }

  if (key) {
    for (var i = 0; i < keys.length; i++) {
      //
      // Password files are named with 'k' + the hashed password.
      // See doSetKey() for implementation.  So check the substring
      // offset with 1 to ignore the starting 'k'
      //
      if (key.indexOf(keys[i].substring(1)) == 0) {
        return true;
      }
    }
  }
}

//
// Create a file with the hashed user password in the
// user key dir.  This is called when the user sets or changes
// their password.
//
function doSetKey(user, oldkey, newkey, res, app) {
  if (oldkey == newkey) {
    return;
  }

  var keydir = utils.getKeyDir(user, app);

  try {
    // Create directory if not present
    if (!fs.existsSync(keydir)) {
      checkReservedUser(user, app);
      fsExtra.mkdirsSync(keydir);
    }

    if (oldkey) {
      //
      // Delete old password file if present
      //

      var keys = fs.readdirSync(keydir);

      for (var i = 0; i < keys.length; i++) {
        if (oldkey.indexOf(keys[i].substring(1)) == 0) {
          fs.unlink(path.join(keydir, keys[i]));
        }
      }
    }

    if (newkey) {
      // Now create new password file
      keyfile = path.join(keydir, 'k' + newkey);
      fs.closeSync(fs.openSync(keyfile, 'w'));
    }
  }
  catch (e) {
    if (e instanceof utils.ImmediateReturnError) {
      throw e;
    }
    utils.errorExit('Could not set password.');
  }
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

function checkReservedUser(user, app) {
  var datadirAbs = path.resolve(app.locals.config.dirs.datadir);

  if (fs.existsSync(path.join(datadirAbs, user))) {
    return;
  }

  if (user != user.toLowerCase()) {
    utils.errorExit('Username should be lowercase.');
  }

  var normalized = user.toLowerCase();
  if (fs.existsSync(path.join(datadirAbs, normalized))) {
    utils.errorExit('Username is reserved.');
  }

  // Prohibit low-complexity usernames (like "aaaaaa")
  if (letterComplexity(normalized) <= 1) {
    utils.errorExit('Username is reserved.');
  }

  // Also check possible variations of badwords
  var normalizedi = translate(normalized, '013456789', 'oieasbtbg');
  if (normalized != normalizedi &&
      fs.existsSync(path.join(datadirAbs, normalizedi))) {
    utils.errorExit('Username is reserved.');
  }

  var normalizedl = translate(normalized, '013456789', 'oleasbtbg');
  if (normalizedl != normalized &&
      fs.existsSync(path.join(datadirAbs, normalizedl))) {
    utils.errorExit('Username is reserved.');
  }

  var checkwords = [normalized, normalizedi, normalizedl];
  var badwords =
      fs.readFileSync(path.join(__dirname, 'bad-words.txt'), 'utf8').
          split(/\n/);
  var badsubstrings =
      fs.readFileSync(path.join(__dirname, 'bad-substrings.txt'), 'utf8').
          split(/\n/);

  for (var i = 0; i < checkwords.length; i++) {
    for (var j = 0; j < badwords.length; j++) {
      if (badwords[j].length > 0 && checkwords[i] == badwords[j]) {
        utils.errorExit('Username is reserved.');
      }
    }
    for (var j = 0; j < badsubstrings.length; j++) {
      if (badsubstrings[j].length > 0 &&
          checkwords[i].indexOf(badsubstrings[j]) != -1) {
        utils.errorExit('Username is reserved.');
      }
    }
  }
}

function translate(source, from, to) {
  var fromArr = from.split('');
  var toArr = to.split('');
  var copy = new String(source);

  if (fromArr.length != toArr.length) {
    utils.errorExit('Uh oh, parameters to translate are incorrect.');
  }

  for (var i = 0; i < fromArr.length; i++) {
    var x = copy.indexOf(fromArr[i]);
    if (x != -1) {
      // Match found, so replace it
      copy[x] = toArr[i];
    }
  }
  return copy;
}
