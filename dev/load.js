var path = require('path');
var fs = require('fs-ext');
var fsExtra = require('fs.extra');
var utils = require('./utils');

exports.handleLoad = function(req, res, app) {
  var filename = req.param('file', utils.filenameFromUri(req));
  var callback = req.param('callback', null);
  var tail = req.param('tail', null);
  var user = utils.getUser(req, app);
  var origfilename = filename;

  tail = parseInt(tail);
  if (Number.isNaN(tail)) {
    tail = null;
  }

  if (filename == null) {
    filename = '';
  }

  try {
    var isrootlisting = !user && filename == '';

    //console.log({filename: filename, user: user, isroot: isrootlisting});

    if (isrootlisting) {
      try {
        // Try the cache first if it exists
        var data = fsExtra.readJsonSync(utils.getRootCacheName(app));

        res.set('Cache-Control', 'no-cache, must-revalidate');
        res.set('Content-Type', 'text/javascript');

        //console.log(data);
        res.jsonp(data);
        return;
      }
      catch (e) { }
    }

    // Validate username
    if (user) {
      utils.validateUserName(user);
      if (filename.length > 0) {
        filename = path.join(user, filename);
      }
      else {
        filename = user + '/';
      }
    }

    // Validate filename
    if (filename.length > 0) {
      if (!utils.isFileNameValid(filename, false)) {
        utils.errorExit('Bad filename: ' + filename);
      }
    }

    var absfile = utils.makeAbsolute(filename, app);

    var haskey = userhaskey(user, app);

    // Handle the case of a file that's present
    if (utils.isPresent(absfile, 'file')) {
      var data = (tail != null) ?
        readtail(absfile, tail) : fs.readFileSync(absfile, {encoding: 'utf8'});

      var statObj = fs.statSync(absfile);

      var mimetype =
        getMimeType(filename.substring(filename.lastIndexOf('.')));

      res.set('Cache-Control', 'no-cache, must-revalidate');
      res.jsonp({file: '/' + filename,
                 data: data,
                 auth: haskey,
                 mtime: statObj.mtime.getTime(),
                 mime: mimetype});
      return;
    }

    // Handle the case of a directory that's present
    if (utils.isPresent(absfile, 'dir')) {
      if (filename.length > 0 && filename[filename.length - 1] != '/') {
        filename += '/';
      }

      var list = buildDirList(absfile, fs.readdirSync(absfile).sort());

      var jsonRet =
        {directory: '/' + filename, list: list, auth: haskey};

      // Write to cache if this is a top dir listing
      if (isrootlisting) {
        fsExtra.outputJsonSync(utils.getRootCacheName(app), jsonRet);
      }
      res.set('Cache-Control', 'no-cache, must-revalidate');
      res.jsonp(jsonRet);
      return;
    }

    // Handle the case of a new file create
    if (filename.length > 0 &&
        filename[filename.length - 1] != '/' &&
        isValidNewFile(absfile, app)) {
      res.set('Cache-Control', 'no-cache, must-revalidate');
      res.jsonp({error: 'could not read file ' + filename,
                 newfile: true,
                 auth: haskey,
                 info: absfile});
      return;
    }

    utils.errorExit('Could not read file ' + filename);
  }
  catch (e) {
    if (e instanceof utils.ImmediateReturnError) {
      res.jsonp(e.jsonObj);
    }
    else {
      throw e;
    }
  }

};

function wrapTurtle(text, app) {
  return (
    '<!doctype html>\n<html>\n<head>\n' +
    '<script src="http://' + app.locals.config.host +
    '/turtlebits.js"></script>\n' +
    '</head>\n<body><script type="text/coffeescript">\neval $.turtle()\n\n' +
    text + '\n</script></body></html>');
}

function isValidNewFile(newAbsFileName, app) {
  var dir = path.dirname(newAbsFileName);
  while (true) {
    if (dir.indexOf(app.locals.config.dirs.datadir) != 0) {
      return false;
    }

    try {
      if (fs.statSync(dir).isDirectory()) {
        return true;
      }
    }
    catch (e) { }
    dir = path.dirname(dir);
  }
}

function buildDirList(absdir, contents) {
  var list = new Array();

  for (var i = 0; i < contents.length; i++) {
    // Skip over any entries starting with .
    if (contents[i][0] == '.') {
      continue;
    }

    var item = path.join(absdir, contents[i]);
    var statObj = fs.statSync(item);
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
    // If its an empty file, then reset mtime
    if (statObj.isFile() && statObj.size == 0) {
      mtime = 0;
    }

    list.push({name: contents[i],
         mode: modestr,
         size: statObj.size,
         mtime: mtime});
  }

  return list;
}

function readtail(filename, lines) {
  if (lines <= 0) {
    return '';
  }

  var fd = fs.openSync(filename, 'r');
  // seek to the end
  fd.seekSync(fd, 0, 2);

  // TODO : Implement this
}

function userhaskey(user, app) {
  if (!user) {
    return false;
  }

  var keydir = utils.getKeyDir(user, app);

  if (!utils.isPresent(keydir, 'dir')) {
    return false;
  }

  var keys = fs.readdirSync(keydir);
  if (!keys || keys.length == 0) {
    return false;
  }

  return true;
}

function getMimeType(ext) {
  var mimeTypeTable = {
      'jpg'  : 'image/jpeg',
      'jpeg' : 'image/jpeg',
      'gif'  : 'image/gif',
      'png'  : 'image/png',
      'bmp'  : 'image/x-ms-bmp',
      'ico'  : 'image/x-icon',
      'htm'  : 'text/html',
      'html' : 'text/html',
      'txt'  : 'text/plain',
      'text' : 'text/plain',
      'css'  : 'text/css',
      'coffee' : 'text/coffeescript',
      'js'   : 'text/javascript',
      'xml'  : 'text/xml'
  };
  var result = mimeTypeTable[ext];
  if (!result) {
    result = 'text/x-turtlebits';
  }

  if (result.indexOf('text') == 0) {
    result = result + ';charset=utf-8';
  }

  return result;
}
