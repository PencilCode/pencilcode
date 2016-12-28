var path = require('path');
var fs = require('fs-ext');
var fsExtra = require('fs-extra');
var utils = require('./utils');
var filetype = require('../content/src/filetype');
var filemeta = require('./filemeta');
var DirLoader = require('./dirloader').DirLoader;

var globalDirCache = {};

// Do not serve cached content older than 5 minutes.
var maxDirCacheAge = 5 * 60 * 1000;

// Rebuild cache in background after serving data older than 1 minute.
var autoRebuildCacheAge = 1 * 60 * 1000;

// Serve at most 600 entries at a time from root directory or share site.
var MAX_DIR_ENTRIES = 600;

function getDirCache(dir) {
  var dircache = globalDirCache[dir]
  if (!dircache) {
    dircache = new DirLoader(dir);
    globalDirCache[dir] = dircache;
  }
  return dircache;
}

exports.handleLoad = function(req, res, app, format) {
  var filename = utils.filenameFromUri(req) || '';
  var callback = utils.param(req, 'callback');
  var user = res.locals.owner || '';
  var origfilename = filename;
  var prefix = utils.param(req, 'prefix', '');
  var count = Math.max(utils.param(req, 'count', MAX_DIR_ENTRIES), MAX_DIR_ENTRIES);

  try {
    // Check if the request is for root listing or share site.
    var isRootListing = !user && filename === '' && format === 'json';
    var isShareSite = user === 'share' && filename === '' && format === 'json';

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
        var m = filemeta.parseMetaString(
            fs.readFileSync(absfile)),
            data = m.data,
            meta = m.meta;

        var statObj = fs.statSync(absfile);

        var mimetype = filetype.mimeForFilename(filename);

        res.set('Cache-Control', 'must-revalidate');
        resp = {
          file: '/' + filename,
          data: data,
          auth: haskey,
          mtime: statObj.mtime.getTime(),
          mime: mimetype
        };
        if (meta != null) {
          resp.meta = meta;
        }
        res.jsonp(resp);
        return;
      }

      // Handle the case of a directory that's present
      if (utils.isPresent(absfile, 'dir')) {
        if (filename.length > 0 && filename[filename.length - 1] != '/') {
          filename += '/';
        }

        // Root listing and share site are cached.
        if (isRootListing || isShareSite) {
          // Grab the dir cache object for this root directory path.
          var dircache = getDirCache(absfile);
          if (dircache.age() > maxDirCacheAge) {
            // A very-old or never-built cache must be rebuilt before serving.
            dircache.rebuild(sendCachedResult);
          } else if (prefix) {
            // When a specific prefix is requested, probe for an exact match.
            dircache.update(prefix, sendCachedResult);
          } else {
            // Fresh cache without prefix: just send the cached result.
            sendCachedResult(true);
          }
          return;
          function sendCachedResult(ok) {
            var dir = path.join('/', user);
            var data;
            if (!ok) {
              data = { error: 'Could not read file ' + dir };
            } else {
              data = {
                directory: dir,
                list: dircache.readPrefix(prefix, count),
                auth: false
              };
              // If the cache was sort-of-old, kick off an early rebuild.
              if (dircache.age() > autoRebuildCacheAge) {
                // No callback needed.
                dircache.rebuild(null);
              }
            }
            res.set('Cache-Control', 'must-revalidate');
            res.set('Content-Type', 'text/javascript');
            res.jsonp(data);
          }
        }

        var dirloader = new DirLoader(absfile);
        dirloader.rebuild(function(ok) {
          var list = dirloader.readPrefix(prefix, count);
          var jsonRet = {
            directory: '/' + filename,
            list: list,
            auth: haskey
          };

          res.set('Cache-Control', 'must-revalidate');
          res.jsonp(jsonRet);
        });
        return;
      }

      // Handle the case of a new file create
      if (filename.length > 0 &&
          filename[filename.length - 1] != '/' &&
          isValidNewFile(absfile, app)) {
        res.set('Cache-Control', 'must-revalidate');
        res.jsonp({error: 'could not read file ' + filename,
                   data: '',
                   newfile: true,
                   file: '/' + filename,
                   auth: haskey,
                   info: absfile});
        return;
      }

      utils.errorExit('Could not read file ' + filename);
    }
    else if (format == 'code') { // For loading the code only
      var mt = filetype.mimeForFilename(filename),
          m = filemeta.parseMetaString(
              fs.readFileSync(absfile)),
          data = m.data,
          meta = m.meta;
      res.set('Cache-Control', 'must-revalidate');
      res.set('Content-Type', (meta && meta.type) ||
          mt.replace(/\bx-pencilcode\b/, 'cofeescript'));
      res.send(data);
      return;
    }
    else if (format == 'print') { // For printing the code
      var mt = filetype.mimeForFilename(filename),
          m = filemeta.parseMetaString(
              fs.readFileSync(absfile)),
          data = m.data,
          meta = m.meta,
          needline = false,
          out = [];
      if (mt.indexOf('text') !== 0) {
        res.set('Content-Type', mt);
        res.send(data);
        return;
      }
      res.set('Cache-Control', 'must-revalidate');
      res.set('Content-Type', 'text/html;charset=utf-8');
      out.push('<!doctype html>', '<html>', '<head>');
      // Add a title in the form username: file.
      out.push('<title>' + filename.replace('/', ': ') + '</title>');
      out.push('<style>');
      // For scrible - when the page is modified so that the pre is
      // the second element, insert some extra top-padding to make
      // space for scrible's overlay.
      out.push('pre:nth-child(2) { padding-top: 100px; }');
      // s for dotted-lines with columns
      out.push('s { border-right: 1px dotted skyblue; margin-right: -1; '+
               'text-decoration: none; }');
      out.push('</style>');
      out.push('</head>', '<body>', '<pre>');

      if (/\S/.test(data)) {
        out.push(addHTMLLineNumbers(data));
        needline = true;
      }
      if (meta && meta.css && /\S/.test(meta.css)) {
        if (needline)
           out.push('<br><hr style="border:none;height:1px;background:black">');
        out.push(addHTMLLineNumbers(meta.css));
        needline = true;
      }
      if (meta && meta.html && /\S/.test(meta.html)) {
        if (needline)
           out.push('<br><hr style="border:none;height:1px;background:black">');
        out.push(addHTMLLineNumbers(meta.html));
        needline = true;
      }
      out.push('</pre>');
      out.push('</body>', '</html>');
      res.send(out.join('\n'));
      return;
    }
    else if (format == 'run') { // File loading outside the editor
      if (utils.isPresent(absfile, 'file')) {
        var mt = filetype.mimeForFilename(filename),
            m = filemeta.parseMetaString(
                fs.readFileSync(absfile));

        // For turtle bits, assume it's coffeescript
        if (mt.indexOf('text/x-pencilcode') == 0) {
          data = filetype.wrapTurtle(m, res.locals.site);
          mt = mt.replace('x-pencilcode', 'html');
        } else {
          data = m.data;
        }

        res.set('Cache-Control', 'must-revalidate');
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

        res.set('Cache-Control', 'must-revalidate');
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
            link += ' <a href="/edit' + req.path + name +
                '" style="color:lightgray" rel="nofollow">edit</a>';
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
        res.set('Cache-Control', 'must-revalidate');
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
            text += '<a href="/edit/' + origfilename + '" rel="nofollow">Create /home/' + origfilename + '</a>\n';
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
        if (/ENOENT/.test(e.message)) {
          res.status(404);
          res.send('<html><body><plaintext>' +
                   '404: ' + filename.replace('/', ': ') + ' not found.');
        } else {
          res.send('<html><body><plaintext>' + e.message);
        }
      }
    }
    else {
      throw e;
    }
  }

};

function addIndentGuides(line) {
  var leading = /^(?:  )*/.exec(line)[0].length;
  return line.substring(0, leading).replace(/  /g, '<s>  </s>') +
         line.substring(leading);
}

function addHTMLLineNumbers(data) {
  var out = [],
      lines = data.replace(/\s*$/, '').split('\n'),
      spaces = Math.max(3, ('' + lines.length).length),
      j;
  for (j = 0; j < lines.length; ++j) {
    var line = '' + (j + 1);
    while (line.length < spaces) {
      line = ' ' + line;
    }
    line = line + '<s>  </s>' + addIndentGuides(escapeHTML(lines[j]));
    out.push(line);
  }
  return out.join('\n');
}

function escapeHTML(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
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

    var absthumb = utils.makeThumbPath(item);

    list.push({
      name: contents[i],
      thumbnail: fs.existsSync(absthumb),   // whether there is a thumbnail
      mode: modestr,
      size: statObj.size,
      mtime: mtime
    });
  }

  return list;
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

