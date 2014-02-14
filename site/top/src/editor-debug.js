///////////////////////////////////////////////////////////////////////////
// DEBUGGER SUPPORT
///////////////////////////////////////////////////////////////////////////

define([
  'jquery',
  'editor-view',
  'see',
  'sourcemap/source-map-consumer'],
function($, view, see, sourcemap) {

eval(see.scope('debug'));

// Exported functions from the edit-debug module are exposed
// as the top frame's "ide" global variable:
var debug = {
  init: function init() { window.ide = debug; },
  bindframe: bindToWindow,
  highlight: highlight,
  history: [],
  scope: null,
  resetHistory: function() {
    debug.history = [];
  },
  reportEvent: function(name, data) {
    var debugId = data[0];
    var line = debugIdToLine[debugId];
    if (line == null) {
      line = editorLineNumberForError(Error());
      debugIdToLine[debugId] = line;
    }
    if (name == 'appear') {
      debug.history.push(data);
      highlightLine(line, 'debugerror');
    } else if (name == 'resolve') {
      // A little memory cleanup.
      debugIdToLine[debugId] = null;
      // If we decide to clear the highlighted line here:
      // highlightLine(null, 'debugerror');
    }
  }
};

function bindToWindow(w) {
  debug.scope = w;
}

var debugIdToLine = { };

function highlight(err, cssClass) {
  var line = editorLineNumberForError(err);
  highlightLine(line, cssClass);
}

function highlightLine(line, cssClass) {
  view.clearPaneEditorMarks(view.paneid('left'), cssClass);
  if (line != null) {
    view.markPaneEditorLine(view.paneid('left'), line, cssClass);
  }
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
  if (!(err instanceof debug.scope.Error) && err.error) {
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
  }
  return parsed;
}

// Returns the (1-based) line number for an error object, if any;
// or returns null if none can be figured out.
function editorLineNumberForError(error) {
  if (!error) return null;
  var parsed = parsestack(error);
  if (!parsed) return null;
  if (!debug.scope || !debug.scope.CoffeeScript || !debug.scope.CoffeeScript.code) return null;
  // Find the innermost call that corresponds to compiled CoffeeScript.
  var frame = null;
  for (var j = 0; j < parsed.length; ++j) {
    if (parsed[j].file in debug.scope.CoffeeScript.code) {
      frame = parsed[j];
    }
  }
  if (!frame) return null;
  var map = debug.scope.CoffeeScript.code[frame.file].map;
  if (!map) return null;
  var smc = new sourcemap.SourceMapConsumer(map);

  // The CoffeeScript source code mappings are empirically a bit inaccurate,
  // but it seems if we look for the maximum original line number for any
  // column in the generated line, that seems to be fairly accurate.
  var line = null;
  for (var col = 0; col < 80; col++) {
    var mapped = smc.originalPositionFor({line: frame.line, column: col});
    if (mapped && mapped.line) {
      line = line == null ? mapped.line : Math.max(line, mapped.line);
    }
  }

  if (!line || line < 4) return null;
  // Subtract a few lines of boilerplate from the top of the script.
  return line - 3;
}

return debug;

});
