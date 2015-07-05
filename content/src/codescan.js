///////////////////////////////////////////////////////////////////////////
// SIMPLISTIC CODE SCANNING
// This textual code scan just scans coffeescript and javascript code,
// looking for object names and
///////////////////////////////////////////////////////////////////////////

function stripCSMultiline(code) {
  // Really simple heuristic for coffeescript:
  // Just scan the multiline quote and comment delimeters, and
  // omit parts of the code within those when scanning.
  var parts = code.split(/(###|\/\/\/|"""|'''|#|\n)/);
  var keep = [],
    inside = null,
    hadline = false,
    ignoreline = false;
  for (var j = 0; j < parts.length; ++j) {
    var part = parts[j];
    if (ignoreline) {
      if (part === '\n') {
        ignoreline = false;
      } else {
        continue;
      }
    }
    if (inside) {
      if (part === '\n' && !hadline) {
        hadline = true;
        keep.push(part);
      }
      if (part === inside) {
        hadline = false;
        part = null;
      }
      continue;
    }
    if (part === '#') {
      ignoreline = true;
      continue;
    }
    if (/^(?:###|"""|'''|\/\/\/)$/.test(part)) {
      inside = part;
      continue;
    }
    keep.push(part);
  }
  return keep.join('');
}

function coffeeObjects(code) {
  code = stripCSMultiline(code);
  var lines = code.split('\n');
  var result = [];
  for (var j = 0; j < lines.length; ++j) {
    var match = /^\s*(\w+)\s*=\s*new\s+(\w+)(.*)$/.exec(lines[j]);
    if (match) {
      result.push({
        name: match[1],
        class: match[2],
        args: (match[3] || '').replace(/\((.*)\)\s*/, '$1').split(',').map(
          function(t) { return t.trim(); })
      });
    }
  }
  return result;
}

function jsObjects(code) {
  var lines = code.split('\n');
  var result = [];
  for (var j = 0; j < lines.length; ++j) {
    var match = /^\s*(\w+)\s*=\s*new\s+(\w+)(.*)$/.exec(lines[j]);
    if (match) {
      result.push({
        name: match[1],
        class: match[2],
        args: (match[3] || '').replace(/\((.*)\)\s*/, '$1').split(',').map(
          function(t) { return t.trim(); })
      });
    }
  }
  return result;
}

function scanObjects(language, code) {
  var objects;
  if (/coffee/.test(language)) {
    objects = coffeeObjects(code);
  } else if (/js|javascript/.test(language)) {
    objects = jsObjects(code);
  } else {
    return [];
  }
  var deduped = {};
  for (var j = 0; j < objects.length; ++j) {
    var obj = objects[j];
    if (/^(?:Turtle|Sprite|Piano|Webcam|Pencil)$/.test(obj.class) &&
      !(obj.name in deduped)) {
      deduped[obj.name] = obj;
    }
  }
  var result = [];
  for (var n in deduped) {
    var obj = deduped[n];
    result.push({
      label: obj.class + ' ' + obj.name,
      name: obj.name
    });
  }
  return result;
}

window.pencilcode.codescan = {
  scanObjects: scanObjects
};

module.exports = window.pencilcode.codescan;

