(function(module, define) {

function inferScriptType(filename) {
  var mime = mimeForFilename(filename);
  if (/^text\/x-pencilcode/.test(mime)) {
    mime = 'text/coffeescript';
  }
  // Script type attributes do not understand encoding.
  return mime.replace(/;.*$/, '');
}

// Scans for HTML HEAD content at the top, remembering the positions
// after any start-tags seen and before any legal end-tags.
// Returns {
//   pos: { map of tagname -> [index, length] }
//   hasbody: true if <body> tag starts the content.
//   bodypos: index of the <body> tag or first content text.
//
function scanHtmlTop(html) {
  var sofar = html, len, match, seen = {}, endpat, scanned = false,
      result = { pos: {} };
  for (;;) {
    len = sofar.length;
    // Trim leading space.
    sofar = sofar.replace(/^\s*/, '');
    if (sofar.length < len) { continue; }
    // Trim leading comment.
    sofar = sofar.replace(/^<!--[^-]*(?:-(?:[^-]|-[^>])[^-]*)*-*-->/, '');
    if (sofar.length < len) { scanned = true; continue; }
    // Detect acceptable tags within the HEAD.
    match = /^<([^\s>]+\b)\s*(?:[^\s=>]+\s*=\s*(?:[^\s>]+|'[^']*'|"[^"]")\s*)*\s*>/.exec(sofar);
    if (match && /^(?:!doctype|html|head|link|meta|base|title|script|style|\/\w+)$/i.test(match[1])) {
      scanned = true;
      if (!result.pos.hasOwnProperty(match[1].toLowerCase())) {
        result.pos[match[1].toLowerCase()] = {
          index: html.length - sofar.length,
          length: match[0].length
        };
      }
      sofar = sofar.substr(match[0].length);
      if (!/^(?:title|style|script)$/i.test(match[1])) {
        continue;
      }
      // Special cases: title, style, and script: skip any content text.
      endpat = new RegExp('</(' + match[1] + '\\b)[^>]*>', 'i');
      match = endpat.exec(sofar);
      if (match) {
        if (!result.pos.hasOwnProperty(match[1].toLowerCase())) {
          result.pos[match[1].toLowerCase()] = {
            index: html.length - sofar.length,
            length: match[0].length
          };
        }
        sofar = sofar.substr(match.index + match[0].length);
      }
      continue;
    }
    // The head ends here: notice if there is a body tag.
    if (match && /^body$/i.test(match[1])) {
      scanned = true;
      result.hasbody = true;
    }
    result.bodypos = scanned ? (html.length - sofar.length) : 0;
    return result;
  }
}

// The job of this function is to take: HTML, CSS, and script content,
// and merge them into one HTML file. (Changed signature to allow generalization of languages)
function wrapTurtle(doc, domain, pragmasOnly, setupScript, instrumenter) {
  // Construct the HTML for running a program.
  var meta = effectiveMeta(doc);
  var html = meta.html || '';
  // pragmasOnly should never run dangerous script, so do not run
  // meta.html if the HTML has script.
  if (pragmasOnly && /<\/?script/i.test(html)) {
    html = '';
  }
  var topinfo = scanHtmlTop(html);
  var prefix = [], suffix = [];
  if (topinfo.pos['!doctype'] == null) {
    prefix.push('<!doctype html>');
    if (topinfo.pos['html'] == null) {
      prefix.push('<html>');
      suffix.unshift('</html>');
    }
  }
  // If any head items are required, find a location for them.
  if (meta.css) {
    var headneeded = (topinfo.bodypos == 0);
    if (headneeded) {
      // Create a head tag if the HTML has no leading items.
      prefix.push('<head>');
    }
    else {
      var splithead = topinfo.bodypos, newline = 0;
      if (topinfo.pos['/head']) {
        splithead = Math.min(splithead, topinfo.pos['/head'].index);
      }
      if (splithead > 0) {
        if (html.substr(splithead, 1) == '\n') { newline = 1; }
        prefix.push(html.substr(0, splithead - newline));
        html = html.substr(splithead);
      }
    }
    // Now insert the head items.
    prefix.push.apply(prefix, ['<style>', meta.css, '</style>']);
    if (headneeded) {
      prefix.push('</head>');
      if (!topinfo.hasbody) {
        prefix.push('<body>');
        suffix.unshift('</body>');
      }
    }
  } else if (topinfo.bodypos == 0 && !topinfo.hasbody) {
    // Surround by a body if no head content was present, and no body tag.
    prefix.push('<body>');
    suffix.unshift('</body>');
  } else if (html.substr(topinfo.bodypos).trim() == '') {
    // Append an empty body if the HTML is all head.
    suffix.unshift('<body></body>');
  }

  // Add the default scripts.
  var j, scripts = [], src, text = doc.data;
  for (j = 0; j < meta.libs.length; ++j) {
    addScriptSrc(meta.libs[j].src, null, meta.libs[j].attrs);
  }
  function addScriptSrc(src, type, attrdict) {
    var attrs = '';
    if (attrdict) {
      for (var att in attrdict) {
        attrs += ' ' + att + '="' + escapeHtml(meta.libs[j].attrs[att]) + '"';
      }
    }
    if (/{site}/.test(src)) {
      src = src.replace(/{site}/g, domain);
      // Note that for local scripts we use crossorigin="anonymous" so that
      // we can get // more detailed error information (e.g., CoffeeScript
      // compilation // errors, using CORS rules.)  More discussion:
      // http://blog.errorception.com/2012/12/catching-cross-domain-js-errors.html
      scripts.push(
        '<script src="' + src + '" crossorigin="anonymous"' +
        ' type="' + (type || inferScriptType(src)) + '"' +
        attrs + '><\057script>');
    } else {
      scripts.push(
        '<script src="' + src + '"' +
        ' type="' + (type || inferScriptType(src)) + '"' +
        attrs + '><\057script>');
    }
  }
  // Then add any setupScript supplied.
  if (setupScript) {
    for (j = 0; j < setupScript.length; ++j) {
      if (setupScript[j].src) {
        addScriptSrc(setupScript[j].src, setupScript[j].type, null);
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

    // Finally assemble the main script.
  var maintype = null;
  var originalLanguage = null;
  var seeline = '\n\n';
  if (meta.type == "text/x-python") {
    maintype = "text/x-python"
    seeline = '# Initialization / clearing goes here\n\n';
    originalLanguage = 'python'
  }
  else {
    maintype = 'text/coffeescript';
    if (doc.meta && doc.meta.type) {
      maintype = doc.meta.type;
    }
    if (/javascript/i.test(maintype)) {
      seeline = 'eval(this._start_ide_js_);\n\n';
      originalLanguage = 'javascript';
    } else if (/coffeescript/.test(maintype)) {
      seeline = 'eval(this._start_ide_cs_);\n\n';
      originalLanguage = 'coffeescript';
    }
  }
  var instrumented = false;
  if (instrumenter) {
    // Instruments the code for debugging, always producing javascript.
    var newText = instrumenter(text, originalLanguage);
    if (newText !== false) {
      text = newText;
      maintype = 'text/javascript';
      instrumented = true;
    }
  }
  var mainscript = seeline;
  if (!pragmasOnly) {
    mainscript += text;
  }
  if (instrumented && originalLanguage === 'coffeescript') {
    // Wrap instrumented + compiled coffeescript in a closure, since that's how
    // coffeescript programs are normally compiled. (We didn't compile it to be
    // in a closure because the seeline needs to be in the same scope as the
    // user's program.)
    mainscript = '(function(){\n' + mainscript + '\n})();';
  }
  mainscript = '<script type="' + maintype + '">\n' + mainscript + '\n<\057script>';
  var result = (
    prefix.join('\n') +
    html +
    scripts.join('') +
    mainscript +
    suffix.join(''));
  return result;
}

function escapeHtml(s) {
  return ('' + s).replace(/"/g, '&quot;').replace(/</g, '&lt;')
                 .replace(/>/g, '&gt;').replace(/\&/g, '&amp;');
}

function modifyForPreview(doc, domain, filename, targetUrl, pragmasOnly, sScript, instrumenter) {
	if (doc){
		console.log(doc.data)
	var mimeType = mimeForFilename(filename), text = doc.data;
	
    if (mimeType && /^text\/x-pencilcode/.test(mimeType)) text = wrapTurtle(doc, domain, pragmasOnly, sScript, instrumenter), 
    mimeType = mimeType.replace(/\/x-pencilcode/, "/html"); else if (mimeType && /^text\/x-python/.test(mimeType)) text = wrapTurtle(doc, domain, pragmasOnly, null, null), 
    mimeType = mimeType.replace(/\/x-python/, "/html"); else if (pragmasOnly) {
        var safe = !1;
        // For now, we don't support inserting startup script in anything
        // other than the types above.
        if (mimeType && /^text\/html/.test(mimeType) && !text.match(/<script|<i?frame|<object/i) && (// Only preview HTML if there is no script.
        safe = !0), mimeType && /^image\/svg/.test(mimeType) && (// SVG preview is useful.
        safe = !0), !safe) return "";
    }
    if (!text) return "";
    if (mimeType && /image\/svg/.test(mimeType) && !/<(?:[\w]+:)?svg[^>]+xmlns/.test(text)) // Special case svg-without-namespace support.
    return text + '<pre>To use this svg as an image, add xmlns:\n&lt;svg <mark>xmlns="http://www.w3.org/2000/svg"</mark>&gt;</pre>';
    if (mimeType && /^image\//.test(mimeType)) {
        // For other image types, generate a document with nothing
        // but an image tag.
        var result = [ "<!doctype html>", '<html style="min-height:100%">', "<body>", '<img src="data:' + mimeType.replace(/\s/g, "") + ";base64," + btoa(text) + '" style="position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;background:url(/image/checker.png)">', "</body>", "</html>" ];
        return result.join("\n");
    }
    if (mimeType && !/^text\/html/.test(mimeType)) return "<PLAINTEXT>" + text;
    if (targetUrl && !/<base/i.exec(text)) {
        // Insert a <base href="target_url" /> in a good location.
        var j, match, firstLink = text.match(/(?:<link|<script|<style|<body|<img|<iframe|<frame|<meta|<a)\b/i), insertLocation = [ text.match(/<head\b[^>]*>\n?/i), text.match(/<html\b[^>]*>\n?/i), text.match(/<\!doctype\b[^>]*>\n?/i) ], insertAt = 0;
        for (j = 0; j < insertLocation.length; ++j) if (match = insertLocation[j], match && (!firstLink || match.index < firstLink.index)) {
            insertAt = match.index + match[0].length;
            break;
        }
        return text.substring(0, insertAt) + '<base href="' + targetUrl + '" />\n' + text.substring(insertAt);
    }
    return text;
	}
}


function mimeForFilename(filename) {
  var result = filename && filename.indexOf('.') > 0 && {
    'jpg'  : 'image/jpeg',
    'jpeg' : 'image/jpeg',
    'gif'  : 'image/gif',
    'png'  : 'image/png',
    'svg'  : 'image/svg+xml',
    'bmp'  : 'image/x-ms-bmp',
    'ico'  : 'image/x-icon',
    'py'   : 'text/x-python',
    'htm'  : 'text/html',
    'html' : 'text/html',
    'csv'  : 'text/csv',
    'txt'  : 'text/plain',
    'text' : 'text/plain',
    'css'  : 'text/css',
    'coffee' : 'text/coffeescript',
    'js'   : 'text/javascript',
    'xml'  : 'text/xml',
    'json' : 'text/json'
  }[filename.replace(/^.*\./, '')]
  if (!result) {
    result = 'text/x-pencilcode';
  }
  if (/^text\//.test(result)) {
    result += ';charset=utf-8';
  }
  return result;
}

function effectiveMeta(input) {
  var doc;
  var meta;

  if (input && input.meta !== undefined)
  {
    doc = input;
    meta = input.meta;
  }
  else
  {
    doc = null;
    meta = input;
  }

  if (meta && meta.type && meta.lib) { return meta; }
  meta = (meta && 'object' == typeof meta) ?
    JSON.parse(JSON.stringify(meta)) : {};
  if (!meta.type) {
    // If there's a doc here, we can try to pull a mimetype from it.
    if (doc && doc.mime) {
      if (doc.mime.lastIndexOf('text/x-python', 0) === 0) {
        meta.type = 'text/x-python';
        meta.libs = [{name: 'turtle', src: './turtlebits.js'},
                     {name: 'skulpt.min', src: './lib/skulpt.min.js'},
                     {name: 'skulpt-stdlib', src: './lib/skulpt-stdlib.js'},
                     {name: 'python-script', src: './lib/python-script.js'}
        ];
      }
      else {
        meta.type = 'text/coffeescript';
      }
    }
    else {
      meta.type = 'text/coffeescript';
    }
  }
  if (!meta.libs) {
    meta.libs = [
      {name: 'turtle', src: './turtlebits.js'}
    ];
  }
  return meta;
}

function isDefaultMeta(meta) {
  if (meta == null) return true;
  if (JSON.stringify(effectiveMeta(meta)) ==
      '{"type":"text/coffeescript","libs":' +
      '[{"name":"turtle","src":"./turtlebits.js"}]}') return true;
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
