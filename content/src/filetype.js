(function(module, define) {

function inferScriptType(filename) {
  var mime = mimeForFilename(filename);
  if (/^text\/x-pencilcode/.test(mime)) {
    mime = 'text/coffeescript';
  }
  // Script type attributes do not understand encoding.
  return mime.replace(/;.*$/, '');
}

function wrapTurtle(doc, domain, pragmasOnly, setupScript) {
  var result, j, scripts = [], script_pattern =
    /(?:^|\n)#[^\S\n]*@script[^\S\n<>]+(\S+|"[^"\n]*"|'[^'\n]*')/g,
    text = doc.data,
    meta = effectiveMeta(doc.meta), src;
  // Add the default scripts.
  for (j = 0; j < meta.libs.length; ++j) {
    var src = meta.libs[j].src;
    if (/{site}/.test(src)) {
      src = src.replace(/{site}/g, domain);
      // Note that for local scripts we use crossorigin="anonymous" so that
      // we can get // more detailed error information (e.g., CoffeeScript
      // compilation // errors, using CORS rules.)  More discussion:
      // http://blog.errorception.com/2012/12/catching-cross-domain-js-errors.html
      scripts.push(
        '<script src="' + src + '" crossorigin="anonymous"><\057script>');
    } else {
      scripts.push(
        '<script src="' + src + '"><\057script>');
    }
  }
  // Then add any setupScript supplied.
  if (setupScript) {
    for (j = 0; j < setupScript.length; ++j) {
      if (setupScript[j].src) {
        scripts.push(
          '<script src="' + setupScript[j].url + '" type="' +
          (setupScript[j].type || inferScriptType(setupScript[j].url)) +
          '">\n<\057script>');
      } else if (setupScript[j].code) {
        scripts.push(
          '<script' +
          (setupScript[j].type ? ' type="' + setupScript[j].type + '"' : '') +
          '>\n' +
          setupScript[j].code +
          '\n<\057script>');
      }
    }
  }
  while (null != (result = script_pattern.exec(text))) {
    scripts.push(
      '<script src=' + result[1] +
      ' type="' + inferScriptType(result[1]) +
      '">\n<\057script>');
  }
  var maintype = 'text/coffeescript';
  if (doc.meta && doc.meta.type) {
    maintype = doc.meta.type;
  }
  var seeline = '\n\n';
  var trailing = '\n';
  if (/javascript/.test(maintype)) {
    seeline = 'eval(this._start_ide_js_);setTimeout(function(){\n\n';
    trailing = '\n},0);';
  } else if (/coffeescript/.test(maintype)) {
    seeline = 'eval(this._start_ide_cs_)\n\n';
  }
  result = (
    '<!doctype html>\n<html>\n<body>' +
    scripts.join('') +
    '<script type="' + maintype + '">\n' +
    seeline +
    (pragmasOnly ? '' : text) + trailing + '<\057script></body></html>');
  return result;
}

function modifyForPreview(doc, domain,
       filename, targetUrl, pragmasOnly, sScript) {
  var mimeType = mimeForFilename(filename), text = doc.data;
  if (mimeType && /^text\/x-pencilcode/.test(mimeType)) {
    text = wrapTurtle(doc, domain, pragmasOnly, sScript);
    mimeType = mimeType.replace(/\/x-pencilcode/, '/html');
  } else if (pragmasOnly) {
    // For now, we don't support inserting startup script in anything
    // other than a pencil-code file.
    return '';
  }
  if (!text) return '';
  if (mimeType && !/^text\/html/.test(mimeType)) {
    return '<PLAINTEXT>' + text;
  }
  if (targetUrl && !/<base/i.exec(text)) {
    // Insert a <base href="target_url" /> in a good location.
    var firstLink = text.match(
          /(?:<link|<script|<style|<body|<img|<iframe|<frame|<meta|<a)\b/i),
        insertLocation = [
          text.match(/(?:<head)\b[^>]*>\n?/i),
          text.match(/<html\b[^>]*>\n?/i),
          text.match(/<\!doctype\b[^>]*>\n?/i)
        ],
        insertAt = 0, j, match;
    for (j = 0; j < insertLocation.length; ++j) {
      match = insertLocation[j];
      if (match && (!firstLink || match.index < firstLink.index)) {
        insertAt = match.index + match[0].length;
        break;
      }
    }
    return text.substring(0, insertAt) +
             '<base href="' + targetUrl + '" />\n' +
             text.substring(insertAt);
  }
  return text;
}


function mimeForFilename(filename) {
  var result = filename && filename.indexOf('.') > 0 && {
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
  }[filename.replace(/^.*\./, '')]
  if (!result) {
    result = 'text/x-pencilcode';
  }
  if (/^text\//.test(result)) {
    result += ';charset=utf-8';
  }
  return result;
}

function effectiveMeta(meta) {
  if (meta && meta.type && meta.lib) { return meta; }
  meta = (meta && 'object' == typeof meta) ?
    JSON.parse(JSON.stringify(meta)) : {};
  if (!meta.type) {
    meta.type = 'text/coffeescript';
  }
  if (!meta.libs) {
    meta.libs = [
      {name: 'turtle', src: '//{site}/turtlebits.js'}
    ];
  }
  return meta;
}

function isDefaultMeta(meta) {
  if (meta == null) return true;
  if (JSON.stringify(effectiveMeta(meta)) ==
      '{"type":"text/coffeescript","libs":' +
      '["name":"turtle","src":"//{site}/turtlebits.js"]}') return true;
  return false;
}

var impl = {
  mimeForFilename: mimeForFilename,
  modifyForPreview: modifyForPreview,
  effectiveMeta: effectiveMeta,
  isDefaultMeta: isDefaultMeta,
  wrapTurtle: wrapTurtle
};

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
}

})(
  (typeof module) == 'object' && module,
  (typeof define) == 'function' && define
);
