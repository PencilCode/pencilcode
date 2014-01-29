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
  bind: bindToWindow,
  highlight: highlight
};

var scope = null;

function bindToWindow(w) {
  scope = w;
}

var highlighted = { };

function highlight(err, reason) {
  var line = editorLineNumberForError(err);
  if (line) {
    view.markPaneEditorLine(view.paneid('left'), line, reason);
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
    return parsed;
  }
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
    }
  }
  if (!frame) return null;
  var map = scope.CoffeeScript.code[frame.file].map;
  if (!map) return null;
  var smc = new sourcemap.SourceMapConsumer(map);
  var mapped = smc.originalPositionFor(frame);
  if (!mapped) return null;
  if (!mapped.line || mapped.line < 4) return null;
  // Subtract a few lines of boilerplate from the top of the script.
  return mapped.line - 3;
}

return debug;

});
