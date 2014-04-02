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

var targetWindow = null;    // window object of the frame being debugged.
var nextDebugId = 1;        // a never-decreasing sequence of debug event ids.
var firstSessionId = 1;     // the first id of the current running session.
var debugIdException = {};  // map debug ids -> exception objects.
var debugIdRecord = {};     // map debug ids -> line execution records.
var lineRecord = {};        // map line numbers -> line execution records.
var everyRecord = [];       // a sequence of all records from the run.
var cachedSourceMaps = {};  // parsed source maps for currently-running code.
var cachedParsedStack = {}; // parsed stack traces for currently-running code.
var pollTimer = null;       // poll for stop button.
var stopButtonShown = 0;    // 0 = not shown; 1 = shown; 2 = stopped.
var throwNeeded = !(new Error).stack;

Error.stackTraceLimit = 20;

// Resets the debugger state:
// Remembers the targetWindow, and clears all logged debug records.
// Calling bindframe also resets firstSessionId, so that callbacks
// having to do with previous sessions are ignored.
function bindframe(w) {
  if (!targetWindow && !w || targetWindow === w) return;
  targetWindow = w;
  debugIdException = {};
  debugIdRecord = {};
  lineRecord = {};
  everyRecord = [];
  cachedSourceMaps = {};
  cachedParseStack = {};
  view.clearPaneEditorMarks(view.paneid('left'));
  view.notePaneEditorCleanLineCount(view.paneid('left'));
  firstSessionId = nextDebugId;
  startPollingWindow();
}

// Exported functions from the edit-debug module are exposed
// as the top frame's "ide" global variable.
var debug = window.ide = {
  nextId: function() {
    // The following line of code is hot under profile and is optimized:
    // By avoiding using createError()'s thrown exception when we can get
    // a call stack with a simple Error() constructor, we nearly double
    // speed of a fractal program.
    debugIdException[nextDebugId] = throwNeeded ? createError() : new Error();
    return nextDebugId++;
  },
  bindframe: bindframe,
  interruptable: function() {
    if (targetWindow && targetWindow.jQuery && targetWindow.jQuery.turtle &&
        typeof(targetWindow.jQuery.turtle.interrupt) == 'function') {
      return targetWindow.jQuery.turtle.interrupt('test');
    }
    return false;
  },
  reportEvent: function(name, data) {
    if (!targetWindow) {
      return;
    }
    // Based on profiling data, we dispatch by hand instead of with
    // jQuery.trigger.  (This speeds up fractals by 40%.)
    if (name == 'enter') { debugEnter.apply(null, data); }
    else if (name == 'exit') { debugExit.apply(null, data); }
    else if (name == 'appear') { debugAppear.apply(null, data); }
    else if (name == 'resolve') { debugResolve.apply(null, data); }
    else if (name == 'error') {
      debugError.apply(null, data);

      // data can't be marshalled fully due to circular references not
      // being supported by JSON.stringify(); copy over the essential bits
      var simpleData = {};
      try{
        if (toString.call(data) === "[object Array]" &&
            data.length > 0 && data[0].message) {
          simpleData.message = data[0].message;
        }
      } catch (error) {
        simpleData.message = 'Unknown error.';
      }
      view.publish('error', [simpleData]);
    }
  },
  flashStopButton: flashStopButton
};

// The "enter" event is triggered inside the call to a turtle command.
// There is exactly one enter event for each debugId, and each corresponds
// to exactly one call of the turtle method (with method and args as passed).
// Enter is the first event triggered, and it is always matched by one exit.
// Appear and resolve will appear between enter and exit if the action is
// synchronous.  The "length" parameter indicates the number of appear
// (and matching resolve) events that will be issued for this debugId.
function debugEnter(method, debugId, length, args) {
  var record = getDebugRecord(method, debugId, length, args);
  if (!record) { return; }
  updateLine(record);
}

// The exit event is triggered when the call to the turtle command is done.
function debugExit(method, debugId, length, args) {
  var record = getDebugRecord(method, debugId, length, args);
  if (!record) { return; }
  record.exited = true;
  updateLine(record);
}

// The appear event is triggered when the visible animation for a turtle
// command begins.  If the animation happens asynchronously, appear is
// triggered after exit; but if the animation happens synchronously,
// it can precede exit.  Arguments are the same as for start, except
// the "index" and "element" arguments indicate the element which is
// being animated, and its index in the list of animated elements.
function debugAppear(method, debugId, length, index, elem, args) {
  var record = getDebugRecord(method, debugId, length, args);
  if (!record) { return; }
  record.appearCount += 1;
  record.startCoords[index] = collectCoords(elem);
  updateLine(record);
}

// The resolve event is triggered when the visible animation for a turtle
// command ends.  It always happens after the corresponding "appear"
// event, but may occur before or after "exit".
function debugResolve(method, debugId, length, index, elem) {
  var record = debugIdRecord[debugId];
  if (!record) { return; }
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

// The error event is triggered when an uncaught exception occurs.
// The err object is an exception or an Event object corresponding
// to the error.
function debugError(err) {
  var line = editorLineNumberForError(err);
  view.markPaneEditorLine(view.paneid('left'), line, 'debugerror');
}

// Retrieves (or creates if necessary) the debug record corresponding
// to the given debugId.  A debug record tracks everything needed for
// rendering information about a snapshot in time in the debugger:
// which function was called, the location of the elements being
// affected, and so on.  This function only deals with the table
// debugIdRecord.
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
    exited: false,
    exception: debugIdException[debugId],
    line: null,
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

// After a debug record has been created or updated, updateLine
// determines whether the corresponding line of source code should
// be highlighted or unhighlighted, and if so, it does the highlighting.
// This function maintains the record.traced bit and the lineRecord map.
function updateLine(record) {
  if (!record || record.debugId < firstSessionId) {
    return;
  }
  // Optimization: only compute line number when there is a visible
  // async animation, OR, if it's one of the first 100 debug events.
  if (record.line == null && record.exception &&
      ((record.exited && record.appearCount > record.resolveCount) ||
       record.debugId - firstSessionId < 100)) {
    record.line = editorLineNumberForError(record.exception);
  }
  // TODO: schedule background computation of line numbers for debug
  // events after the first 100.
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
  // The idea is this: we will only need to look up records by debugId
  // in the future when there is a future event pending.  If all the
  // expected "resolves" have occurred and all the expected "appears"
  // have matching "resolves", and there has been an "exit" (matching
  // the initial "enter", then there should be no further events for
  // this debugId.
  if (record.resolveCount >= record.totalCount &&
      record.resolveCount >= record.appearCount &&
      record.exited) {
    delete debugIdRecord[record.debugId];
  }
}

// Used while logging animations (during the 'appear' and 'resolve'
// events) to grab information off an element that allows us to later
// compute the coordinates.
function collectCoords(elem) {
  try {
    // TODO: when the element is not a turtle with the standard
    // parent element positioning, we should do a slower operation to
    // grab the absolute position and direction.
    return {
      transform: elem.style[targetWindow.jQuery.support.transform]
    };
  } catch (e) {
    return null;
  }
}

// Creates an error object in order to collect a stack trace.
function createError() {
  try {
    Error.stackTraceLimit = 20;
    (null)();
  } catch(e) {
    return e;
  }
  return new Error();
}

// Highlights the given line number as a line being traced.
function traceLine(line) {
  view.markPaneEditorLine(
      view.paneid('left'), line, 'guttermouseable', true);
  view.markPaneEditorLine(view.paneid('left'), line, 'debugtrace');
}

// Unhighlights the given line number as a line no longer being traced.
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

// Constructs a SourceMapConsumer object that can map from
// Javascript (stack trace) line numbers to CoffeeScript (user code)
// line numbers.  Since it takes some time to parse and construct
// this mapping, the results are cached.
function sourceMapConsumerForFile(file) {
  var result = cachedSourceMaps[file];
  if (!result) {
    var map = targetWindow.CoffeeScript &&
        targetWindow.CoffeeScript.code[file].map;
    if (!map) return null;
    result = cachedSourceMaps[file] = new sourcemap.SourceMapConsumer(map);
  }
  return result;
}

// Returns the (1-based) line number for an error object, if any;
// or returns null if none can be figured out.
function editorLineNumberForError(error) {
  if (!error || !targetWindow) return null;
  if (!(error instanceof targetWindow.Error)) {
    // As of 2013-07-24, the HTML5 standard specifies that ErrorEvents
    // contain an "error" property.  This test allows such objects
    // (and any objects with an error property) to be passed and unwrapped.
    // http://html5.org/tools/web-apps-tracker?from=8085&to=8086
    if (error.error) {
      error = error.error;
    }
    // If we have a syntax error that doesn't get passed through the
    // event object, then try to pull it from the CoffeeScript.
    if (targetWindow.CoffeeScript && targetWindow.CoffeeScript.code) {
      for (var anyfile in targetWindow.CoffeeScript.code) {
        if (targetWindow.CoffeeScript.code[anyfile].syntaxError) {
          error = targetWindow.CoffeeScript.code[anyfile].syntaxError;
          break;
        }
      }
    }
  }
  var parsed = parsestack(error);
  if (!parsed) return null;
  if (!targetWindow || !targetWindow.CoffeeScript ||
      !targetWindow.CoffeeScript.code) return null;
  // Find the innermost call that corresponds to compiled CoffeeScript.
  var frame = null;
  for (var j = 0; j < parsed.length; ++j) {
    if (parsed[j].file in targetWindow.CoffeeScript.code) {
      frame = parsed[j];
      break;
    }
  }
  // For debugging:
  // console.log(JSON.stringify(parsed), '>>>>', JSON.stringify(frame));
  if (!frame) {
    if (error instanceof targetWindow.SyntaxError) {
      if (error.location) {
        return error.location.first_line - 2;
      }
    }
    return null;
  }
  var smc = sourceMapConsumerForFile(frame.file);
  /* For debugging:
  var lines = targetWindow.CoffeeScript.code[frame.file].js.split('\n');
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

//////////////////////////////////////////////////////////////////////
// GUTTER HIGHLIGHTING SUPPORT
//////////////////////////////////////////////////////////////////////
view.on('entergutter', function(pane, lineno) {
  if (pane != view.paneid('left')) return;
  if (!(lineno in lineRecord)) return;
  view.clearPaneEditorMarks(view.paneid('left'), 'debugfocus');
  view.markPaneEditorLine(view.paneid('left'), lineno, 'debugfocus');
  displayProtractorForRecord(lineRecord[lineno]);
});

view.on('leavegutter', function(pane, lineno) {
  view.clearPaneEditorMarks(view.paneid('left'), 'debugfocus');
  view.hideProtractor(view.paneid('right'));
});

function convertCoords(origin, astransform) {
  if (!origin) { console.log('reason 1'); return null; }
  if (!astransform || !astransform.transform) { return null; }
  var parsed = parseTurtleTransform(astransform.transform);
  if (!parsed) return null;
  return {
    pageX: origin.left + parsed.tx,
    pageY: origin.top + parsed.ty,
    direction: parsed.rot,
    scale: parsed.sy
  };
}

function displayProtractorForRecord(record) {
  // TODO: generalize this for turtles that are not in the main field.
  var origin = targetWindow.jQuery('#field').offset();
  var step = {
    startCoords: convertCoords(
      origin, record.startCoords[record.startCoords.length - 1]),
    endCoords: convertCoords(
      origin, record.endCoords[record.endCoords.length - 1]),
    command: record.method,
    args: record.args
  };
  view.showProtractor(view.paneid('right'), step);
}

// The canonical 2D transforms written by this plugin have the form:
// translate(tx, ty) rotate(rot) scale(sx, sy) rotate(twi)
// (with each component optional).
// This function quickly parses this form into a canonicalized object.
function parseTurtleTransform(transform) {
  if (transform === 'none') {
    return {tx: 0, ty: 0, rot: 0, sx: 1, sy: 1, twi: 0};
  }
  // Note that although the CSS spec doesn't allow 'e' in numbers, IE10
  // and FF put them in there; so allow them.
  var e = /^(?:translate\(([\-+.\de]+)(?:px)?,\s*([\-+.\de]+)(?:px)?\)\s*)?(?:rotate\(([\-+.\de]+)(?:deg)?\)\s*)?(?:scale\(([\-+.\de]+)(?:,\s*([\-+.\de]+))?\)\s*)?(?:rotate\(([\-+.\de]+)(?:deg)?\)\s*)?$/.exec(transform);
  if (!e) { return null; }
  var tx = e[1] ? parseFloat(e[1]) : 0,
      ty = e[2] ? parseFloat(e[2]) : 0,
      rot = e[3] ? parseFloat(e[3]) : 0,
      sx = e[4] ? parseFloat(e[4]) : 1,
      sy = e[5] ? parseFloat(e[5]) : sx,
      twi = e[6] ? parseFloat(e[6]) : 0;
  return {tx:tx, ty:ty, rot:rot, sx:sx, sy:sy, twi:twi};
}

///////////////////////////////////////////////////////////////////////////
// STOP BUTTON SUPPORT
///////////////////////////////////////////////////////////////////////////

// Flashes the stop button for half a second.
function flashStopButton() {
  if (pollTimer) { clearTimeout(pollTimer); pollTimer = null; }
  if (!stopButtonShown) {
    view.showMiddleButton('stop');
    stopButtonShown = 1;
  }
  // Within one second, startPollingWindow should be called,
  // cancelling this timer.  If it is not (for example, if we
  // are running a plain HTML file or something else that does
  // not bind to the IDE debugger API), then we just clear
  // the stop button ourselves.
  pollTimer = setTimeout(function() {
    if (stopButtonShown) {
      view.showMiddleButton('run');
      stopButtonShown = 0;
    }
  }, 1000);
}


function startPollingWindow() {
  if (pollTimer) { clearTimeout(pollTimer); pollTimer = null; }
  if (!targetWindow || !targetWindow.jQuery || !targetWindow.jQuery.turtle ||
      typeof(targetWindow.jQuery.turtle.interrupt) != 'function') {
    if (stopButtonShown) {
      view.showMiddleButton('run');
      stopButtonShown = 0;
    }
    return;
  }
  pollTimer = setTimeout(pollForStop, 100);
}

function pollForStop() {
  pollTimer = null;
  if (!targetWindow || !targetWindow.jQuery || !targetWindow.jQuery.turtle ||
      typeof(targetWindow.jQuery.turtle.interrupt) != 'function') {
    return;
  }
  var stoppable = targetWindow.jQuery.turtle.interrupt('test');
  if (stoppable) {
    if (!stopButtonShown) {
      stopButtonShown = 1;
      view.showMiddleButton('stop');
    }
  } else {
    if (stopButtonShown) {
      stopButtonShown = 0;
      view.showMiddleButton('run');

      view.publish('execute');
    }
  }
  pollTimer = setTimeout(pollForStop, 100);
}

view.on('stop', function() {
  if (!targetWindow || !targetWindow.jQuery || !targetWindow.jQuery.turtle ||
      typeof(targetWindow.jQuery.turtle.interrupt) != 'function') {
    // Do nothing if the program is not something that we can interrupt.
    return;
  }
  targetWindow.jQuery.turtle.interrupt();
});

///////////////////////////////////////////////////////////////////////////
// DEBUG EXPORT
///////////////////////////////////////////////////////////////////////////

return debug;

});
