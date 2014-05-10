var path = require('path');
var fs = require('fs-ext');
var fsExtra = require('fs.extra');
var utils = require('./utils');

exports.handleLoad = function(req, res, app, format) {
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
    var isrootlisting = !user && filename == '' && format == 'json';

    //console.log({'filename': filename, 'user': user, 'isroot': isrootlisting});

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

    if (format == 'json') {
      var haskey = userhaskey(user, app);

      // Handle the case of a file that's present
      if (utils.isPresent(absfile, 'file')) {
        var data = (tail != null) ? 
            readtail(absfile, tail) : fs.readFileSync(absfile, {'encoding': 'utf8'});

        var statObj = fs.statSync(absfile);

        var mimetype = 
            getMimeType(filename.substring(filename.lastIndexOf('.')));

        res.set('Cache-Control', 'no-cache, must-revalidate');
        res.jsonp({'file': '/' + filename, 
                   'data': data,
                   'auth': haskey,
                   'mtime': statObj.mtime.getTime(), 
                   'mime': mimetype});
        return;
      }
    
      // Handle the case of a directory that's present
      if (utils.isPresent(absfile, 'dir')) {
        if (filename.length > 0 && filename[filename.length - 1] != '/') {
          filename += '/';
        }

        var list = buildDirList(absfile, fs.readdirSync(absfile).sort());

        var jsonRet = 
          {'directory': '/' + filename, 'list': list, 'auth': haskey};

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
        res.jsonp({'error': 'could not read file ' + filename,
                   'newfile': true,
                   'auth': haskey,
                   'info': absfile});
        return;
      }

      utils.errorExit('Could not read file ' + filename);
    }
    else if (format == 'execute') { // File loading outside the editor
      if (utils.isPresent(absfile, 'file')) {
        var mt = 
            getMimeType(filename.substring(filename.lastIndexOf('.')));
        var data = fs.readFileSync(absfile, {'encoding': 'utf8'});

        //For turtle bits, assume it's coffeescript
        if (mt.indexOf('text/x-turtlebits') == 0) {
          data = wrapTurtle(data, app);
          mt = mt.replace('x-turtlebits', 'html');
        }

        res.set('Cache-Control', 'no-cache');
        res.set('Content-Type', mt);
        res.send(data);
        return;
      }
      else if (utils.isPresent(absfile, 'dir') || 
               filename.indexOf('/') == filename.length) {
        if (filename.length > 0 && filename[filename.length - 1] != '/') {
          res.redirect(301, '/home' + req.path + '/');
          return;
        }

        res.set('Cache-Control', 'no-cache');
        res.set('Content-Type', 'text/html;charset=utf-8');

        var text = '<title>' + req.path + '</title>';
        text += '<style>\n';
        text += 'body { font-family:Arial,sans-serif; }\n';
        text += 'pre {\n';
        text += '-moz-column-count:3;\n';
        text += '-webkit-column-count:3;\n';
        text += 'column-count:3;\n';
        text += '}\n';
        text += '</style>\n';
        text += '<h3>' + req.host + req.path + '</h3>\n';
        text += '<pre>\n';

        var lastIndex = req.path.lastIndexOf('/');
        if (lastIndex > 0) {
          var prevIndex = req.path.substring(0, lastIndex).lastIndexOf('/');
          if (prevIndex >= 0) {
            var parentDir = req.path.substring(0, prevIndex + 1);
            text += '<a href="/home' + parentDir;
            text += '" style="background:yellow">Up to ' + parentDir;
            text += '</a>\n';
          }
        }
        
        var contents = (utils.isPresent(absfile, 'dir')) ? 
          fs.readdirSync(absfile).sort() : new Array();
        for (var i = 0; i < contents.length; i++) {
          if (contents[i][0] == '.') {
            // Skip past any dirs starting with a '.'
            continue;
          }
          
          var name = contents[i];
          var af = path.join(absfile, name);
          if (utils.isPresent(af, 'dir') && 
              name.charAt(name.length - 1) != '/') {
            name += '/';
          }
          var link = '<a href="/home' + req.path + name + '">' + name + '</a>';
          if (utils.isPresent(af, 'file')) {
            link += ' <a href="/edit' + req.path + name + '" style="color:lightgray" rel="nofollow">edit</a>';
          }
          text += link + '\n';
        }
        text += '</pre>\n';
        if (contents.length == 0) {
          text += '(directory is empty)<br>\n';
        }

        res.send(text);
        return;
      }
      else if (filename.charAt(filename.length - 1) == '/') {
        res.redirect(301, 
                     path.dirname(filename.substring(0, filename.length-1)) + '/');
        return;
      }
      else {
        res.set('Cache-Control', 'no-cache');
        res.set('Content-Type', 'text/html;charset=utf-8');

        var text = '<pre>\n';
        text += 'No file ' + origfilename + ' found.\n\n';
        var strip = (req.path.charAt(req.path.length - 1) == '/') ?
          req.path.substring(0, req.path.length - 1) : req.path;
        var parentDir = path.dirname(strip) + '/';
        text += '<a href="' + parentDir + '">Up to ' + parentDir + '</a>\n';
        
        var extIdx = filename.lastIndexOf('.');
        if (extIdx > 0) {
          var ext = filename.substring(extIdx + 1);
          if (ext == 'htm' || ext == 'html' || ext == 'js' || ext == 'css') {
            text += '<a href="/edit/' + origfilename + '"> rel="nofollow">Create /home/' + origfilename + '</a>\n';
          }
        }
        text += '</pre>\n';
        res.send(text);
        return;
      }
    }
  }
  catch (e) {
    if (e instanceof utils.ImmediateReturnError) {
      if (format == 'json') {
        res.jsonp((e.jsonObj) ? e.jsonObj : {'error': e.toString()});
      }
      else {
        res.set('Content-Type', 'text/html');
        res.send('<html><body><plaintext>' + e.message);
      }
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

    list.push({'name': contents[i], 
               'mode': modestr, 
               'size': statObj.size,
               'mtime': mtime});
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
  var mimeTypeTable = { 'jpg'  : 'image/jpeg',
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
                        'xml'  : 'text/xml' };
  var result = mimeTypeTable[ext];
  if (!result) {
    result = 'text/x-turtlebits';
  }

  if (result.indexOf('text') == 0) {
    result = result + ';charset=utf-8';
  }

  return result;
}