//////////////////////////////////////////////////////////////////////////r
// DEBUGGER SUPPORT
///////////////////////////////////////////////////////////////////////////

define([
  'jquery',
  'editor-view',
  'see',
  'sourcemap/source-map-consumer'],
function($, view, see, sourcemap) {

eval(see.scope('debug'));

var debugIdRecord = {};
var lineRecord = {};
var nextDebugId = 1;
var firstSessionId = 1;
var cachedSourceMaps = {};
var cachedParsedStack = {};

// Exported functions from the edit-debug module are exposed
// as the top frame's "ide" global variable:
var debug = {
  init: function init() {
    window.ide = debug;
  },
  nextId: function() {
    return nextDebugId++;
  },
  bindframe: bindToWindow,
  highlight: highlight,
  reportEvent: function(name, data) {
    // console.log(name, data);
    if (name == 'start') {
      debugStart.apply(null, data);
    } else if (name == 'appear') {
      debugAppear.apply(null, data);
    } else if (name == 'resolve') {
      debugResolve.apply(null, data);
    }
  },
};

function bindToWindow(w) {
  scope = w;
  debugIdRecord = {};
  lineRecord = {};
  cachedSourceMaps = {};
  cachedParseStack = {};
  view.clearPaneEditorMarks(view.paneid('left'));
  firstSessionId = nextDebugId;
}

function debugStart(method, debugId, length, args) {
  var record = getDebugRecord(method, debugId, length, args);
  record.started = true;
  updateLine(record);
}

function getDebugRecord(method, debugId, length, args) {
  if (debugId in debugIdRecord) {
    return debugIdRecord[debugId];
  }
  if (debugId < firstSessionId) {
    return null;
  }
  var record = debugIdRecord[debugId] = {
    method: method,
    traced: false,
    started: false,
    line: editorLineNumberForError(createError()),
    debugId: debugId,
    totalCount: length,
    appearCount: 0,
    resolveCount: 0,
    startCoords: [],
    endCoords: [],
    args: args
  };
  return record;
}

function updateLine(record) {
  if (!record || record.debugId < firstSessionId) {
    return;
  }
  if (record.line != null) {
    var oldRecord = lineRecord[record.line];
    if (record.appearCount > record.resolveCount) {
      lineRecord[record.line] = record;
      if (!oldRecord || !oldRecord.traced) {
        traceLine(record.line);
      }
      record.traced = true;
    } else {
      if (!oldRecord || !oldRecord.appearCount || oldRecord === record) {
        lineRecord[record.line] = record;
        if (oldRecord && oldRecord.traced) {
          untraceLine(record.line);
        }
      }
      record.traced = false;
    }
  }
  // Should we garbage-collect?  Here we do:
  if (record.resolveCount >= record.totalCount &&
      record.resolveCount >= record.appearCount &&
      record.started) {
    delete debugIdRecord[record.debugId];
  }
}

function collectCoords(elem) {
  try {
    return {
      transform: elem.style[scope.jQuery.support.transform]
    };
  } catch (e) {
    return null;
  }
}

function debugAppear(method, debugId, length, index, elem, args) {
  var record = getDebugRecord(method, debugId, length, args);
  if (!record) {
    return;
  }
  record.appearCount += 1;
  record.startCoords[index] = collectCoords(elem);
  updateLine(record);
}

function debugResolve(method, debugId, length, index, elem) {
  var record = debugIdRecord[debugId];
  if (record == null) {
    console.trace('Error: got a resolve event without a corresponding start');
    return;
  }
  record.resolveCount += 1;
  record.endCoords[index] = collectCoords(elem);
  if (record.resolveCount > record.appearCount) {
    console.trace('Error: more resolve than appear events');
  }
  if (record.resolveCount > record.totalCount) {
    console.trace('Error: too many resolve events', record);
  }
  updateLine(record);
}

var scope = null;

function createError() {
  try {
    Error.stackTraceLimit = 20;
    (null)();
  } catch(e) {
    return e;
  }
  return new Error();
}

function highlight(err, cssClass) {
  var line = editorLineNumberForError(err);
  view.clearPaneEditorMarks(view.paneid('left'), cssClass);
  view.markPaneEditorLine(view.paneid('left'), line, cssClass);
}

function traceLine(line) {
  view.markPaneEditorLine(view.paneid('left'), line, 'debugtrace');
}

function untraceLine(line) {
  view.clearPaneEditorLine(view.paneid('left'), line, 'debugtrace');
}


// parsestack converts an Error or ErrorEvent object into the following
// JSON structure.  Starting from the deepest call, it returns an array
// of tuples, each one representing a call in the call stack:
// [
//   {
//     method: (methodname),
//     file: (filename),
//     line: (one-based-linenumber),
//     column: (one-based-columnnumber)
//   },...
// ]
// Fields that are unknown are present but with value undefined or null.
function parsestack(err) {
  if (!(err instanceof scope.Error) && err.error) {
    // As of 2013-07-24, the HTML5 standard specifies that ErrorEvents
    // contain an "error" property.  This test allows such objects
    // (and any objects with an error property) to be passed and unwrapped.
    // http://html5.org/tools/web-apps-tracker?from=8085&to=8086
    err = err.error;
  }
  var parsed = [], lines, j, line;
  // This code currently only works on Chrome.
  // TODO: add support for parsing other browsers' call stacks.
  if (err.stack) {
    var cached = cachedParseStack[err.stack];
    if (cached) {
      return cached;
    }
    lines = err.stack.split('\n');
    for (j = 0; j < lines.length; ++j) {
      line = lines[j];
      // We are interested only in lines starting with "at "
      if (!/^\s*at\s/.test(line)) continue;
      line = line.replace(/^\s*at\s+/, '');
      // Parse the call as printed by CallSiteToString(message.js) in Chrome.
      // Example: "Type.method (filename.js:43:1)"
      var methodname = null;
      // First, strip off filename/line number if present in parens.
      var parenpat = /\s+\((.*?)(?::(\d+)(?::(\d+))?)?\)$/;
      var locationmatch = parenpat.exec(line);
      if (locationmatch) {
        methodname = line.replace(parenpat, '');
      } else {
        locationmatch = /\s*(.*?)(?::(\d+)(?::(\d+))?)?$/.exec(line);
      }
      parsed.push({
        method: methodname,
        file: locationmatch[1],
        line: locationmatch[2] && parseInt(locationmatch[2]),
        column: locationmatch[3] && parseInt(locationmatch[3])
      });
    }
    cachedParseStack[err.stack] = parsed;
  }
  return parsed;
}

function sourceMapConsumerForFile(file) {
  var result = cachedSourceMaps[file];
  if (!result) {
    var map = scope.CoffeeScript.code[file].map;
    if (!map) return null;
    result = cachedSourceMaps[file] = new sourcemap.SourceMapConsumer(map);
  }
  return result;
}

// Returns the (1-based) line number for an error object, if any;
// or returns null if none can be figured out.
function editorLineNumberForError(error) {
  if (!error) return null;
  var parsed = parsestack(error);
  if (!parsed) return null;
  if (!scope || !scope.CoffeeScript || !scope.CoffeeScript.code) return null;
  // Find the innermost call that corresponds to compiled CoffeeScript.
  var frame = null;
  for (var j = 0; j < parsed.length; ++j) {
    if (parsed[j].file in scope.CoffeeScript.code) {
      frame = parsed[j];
      break;
    }
  }
  // console.log(JSON.stringify(parsed), '>>>>', JSON.stringify(frame));
  if (!frame) return null;
  var smc = sourceMapConsumerForFile(frame.file);
  /*
  var lines = scope.CoffeeScript.code[frame.file].js.split('\n');
  for (var j = 0; j < lines.length; ++j) {
    console.log(j + 2, lines[j]);
  }
  smc.eachMapping(function(m) {
    console.log(JSON.stringify(m));
  });
  */

  // The CoffeeScript source code mappings are empirically a bit inaccurate,
  // but it seems if we scan forward to find a line number that isn't pinned
  // to the starting boilerplate, we can get a line number that seems
  // to be fairly accurate.
  var line = null;
  for (var col = Math.max(frame.column - 1, 0);
       col < Math.max(frame.column + 80, 80); col++) {
    var mapped = smc.originalPositionFor({line: frame.line, column: col});
    if (mapped && mapped.line && mapped.line >= 4) {
      line = mapped.line;
      break;
    }
  }

  if (!line || line < 4) return null;
  // Subtract a few lines of boilerplate from the top of the script.
  return line - 3;
}

return debug;

});
