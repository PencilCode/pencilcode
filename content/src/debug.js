//////////////////////////////////////////////////////////////////////////r
// DEBUGGER SUPPORT
///////////////////////////////////////////////////////////////////////////

var $         = require('jquery'),
    view      = require('view'),
    advisor   = require('advisor'),
    see       = require('see'),
    sourcemap = require('source-map');


eval(see.scope('debug'));

var targetWindow = null;      // window object of the frame being debugged.
var currentEventIndex = 0;    // current index into traceEvents.
var currentDebugId = 0;       // id used to pair jquery-turtle events with trace events.
var debugRecordsByDebugId = {}; // map debug ids -> line execution records.
var debugRecordsByLineNo = {};  // map line numbers -> line execution records.
var cachedParseStack = {};    // parsed stack traces for currently-running code.
var pollTimer = null;         // poll for stop button.
var stopButtonShown = 0;      // 0 = not shown; 1 = shown; 2 = stopped.
var currentSourceMap = null;  // v3 source map for currently-running instrumented code.
var traceEvents = [];         // list of event location objects created by tracing events
var stuckTime = null;         // timestmp to detect stuck programs
// verification of complexity of stuck loop
var stuckComplexity = {
  lines: 0,
  calls: 0,
  moves: 0
};
var stuckTrivialTime = 4000;   // stuck time in a loop with no library calls
var stuckCallingTime = 8000;   // stuck time in a loop making library calls
var stuckMovingTime = 15000;   // stuck time in a loop moving elements


Error.stackTraceLimit = 20;


// Resets the debugger state:
// Remembers the targetWindow, and clears all logged debug records.
// Calling bindframe also resets firstSessionId, so that callbacks
// having to do with previous sessions are ignored.
function bindframe(w) {
  if (!targetWindow && !w || targetWindow === w) return;
  targetWindow = w;
  cachedParseStack = {};
  debugRecordsByDebugId = {};
  debugRecordsByLineNo = {};
  view.clearPaneEditorMarks(view.paneid('left'));
  view.notePaneEditorCleanLineCount(view.paneid('left'));
  stuckTime = null;
  stuckComplexity = {
    lines: 0,
    calls: 0,
    moves: 0
  };
  startPollingWindow();
}

// Exported functions from the edit-debug module are exposed
// as the top frame's "ide" global variable.
var debug = window.ide = {
  nextId: function() {
    return currentDebugId;
  },
  bindframe: bindframe,
  interruptable: function() {
    if (targetWindow && targetWindow.jQuery && targetWindow.jQuery.turtle &&
        typeof(targetWindow.jQuery.turtle.interrupt) === 'function') {
      return targetWindow.jQuery.turtle.interrupt('test');
    }
    return false;
  },
  reportEvent: function(name, data) {

    if (!targetWindow) {
      return;
    }

    if (name === "pulse") { stuckTime = null; }

    if (name === "seeeval") { reportSeeeval.apply(null, data); }

    if (name === "enter") { stuckComplexity.calls += 1; }

    if (name === "appear") { reportAppear.apply(null, data); }

    if (name === "resolve") { reportResolve.apply(null, data); }

    if (name === "error") {
      reportError.apply(null, data);
      // data can't be marshalled fully due to circular references not
      // being supported by JSON.stringify(); copy over the essential bits
      var simpleData = {};
      try {
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

  stopButton: stopButton,

  getEditorText: function() {
    var doc = view.getPaneEditorData(view.paneid('left'));
    if (doc) {
      return doc.data;
    }
    return '';
  },
  setEditorText: function(text) {
    view.changePaneEditorText(view.paneid('left'), text);
  },
  getOptions: function() {
    // To reduce clutter, do not show 'Test panel' UI within the run
    // frame when the whole IDE is framed.
    var embedded = /^frame\./.test(location.hostname);
    return {
      panel: embedded ? 'auto' : true
    };
  },
  trace: function(event, data) {
    detectStuckProgram();
    // This receives events for the new debugger to use.
    currentDebugId += 1;
    var record = {line: 0, eventIndex: null, startCoords: [], endCoords: [], method: "", data: "", seeeval:false};
    traceEvents.push(event);
    currentEventIndex = traceEvents.length - 1;
    record.eventIndex = currentEventIndex;
    var lineno = traceEvents[currentEventIndex].location.first_line;
    record.line = lineno;
    debugRecordsByDebugId[currentDebugId] = record;
    debugRecordsByLineNo[lineno] = record;
  },
  setSourceMap: function (map) {
    currentSourceMap = map;
  }
};

//////////////////////////////////////////////////////////////////////
// STUCK PROGRAM SUPPORT
//////////////////////////////////////////////////////////////////////
function detectStuckProgram() {
  stuckComplexity.lines += 1;
  if (stuckComplexity.lines % 100 != 1) return;
  var currentTime = +(new Date);
  if (!stuckTime) {
    stuckTime = currentTime;
    targetWindow.eval(
      'setTimeout(function() { ide.reportEvent("pulse"); }, 100);'
    );
  }
  var limit = stuckTrivialTime;
  if (stuckComplexity.moves / stuckComplexity.lines > 0.01) {
    limit = stuckMovingTime;
  } else if (stuckComplexity.calls / stuckComplexity.lines > 0.01) {
    limit = stuckCallingTime;
  }
  if (currentTime - stuckTime > limit) {
    var inTurtle = false;
    try {
      inTurtle = ('function' == typeof targetWindow.$.turtle.interrupt);
    } catch(e) { }
    if (inTurtle) {
      targetWindow.$.turtle.interrupt('hung');
    } else {
      targetWindow.eval('throw new Error("Stuck program interrupted")');
    }
  }
}

//////////////////////////////////////////////////////////////////////
// ERROR MESSAGE HINT SUPPORT
//////////////////////////////////////////////////////////////////////
var showPopupErrorMessage = function (msg) {
  var center = document.getElementById('error-advice') ||
      document.createElement('center');
  center.id = "error-advice";
  document.body.insertBefore(center, document.body.firstChild);
  center.style.background = 'rgba(240,240,240,0.8)';
  center.style.position = 'absolute';
  center.style.top = 0;
  center.style.right = 0;
  center.style.left = 0;
  center.style.fontFamily = 'Arial';
  center.style.margin = '5px 15%';
  center.style.padding = '8px';
  center.style.borderRadius = '8px';
  center.style.boxShadow = '0 0 5px dimgray';
  center.innerHTML = msg;
}

function reportSeeeval(method, debugId, length, coordId, elem, args){
  currentDebugId += 1;
  record = {seeeval: true};
  debugRecordsByDebugId[currentDebugId] = record;
}

function reportAppear(method, debugId, length, coordId, elem, args){
  stuckComplexity.moves += 1;
  var recordD = debugRecordsByDebugId[debugId];
  if (recordD) {
    if (!recordD.seeeval) {
      var recordL = debugRecordsByLineNo[recordD.line];
      recordD.method = method;
      recordL.method = method;
      recordD.args = args;
      recordL.args = args;
      var index = recordD.eventIndex;
      var location = traceEvents[index].location.first_line;
      recordD.startCoords[coordId] = collectCoords(elem);
      recordL.startCoords[coordId] = collectCoords(elem);
      traceLine(location);
    }
  }
}

function reportResolve(method, debugId, length, coordId, elem, args){
  var recordD = debugRecordsByDebugId[debugId];
  if (recordD) {
    if (!recordD.seeeval) {
      var recordL = debugRecordsByLineNo[recordD.line];
      recordD.method = method;
      recordL.method = method;
      var index = recordD.eventIndex;
      var location = traceEvents[index].location.first_line
      recordD.endCoords[coordId] = collectCoords(elem);
      recordL.endCoords[coordId] = collectCoords(elem);
      untraceLine(location);
    }
  }
}

// The error event is triggered when an uncaught exception occurs.
// The err object is an exception or an Event object corresponding
// to the error.
function reportError(err) {
  var line = editorLineNumberForError(err);
  var m = view.getPaneEditorData(view.paneid('left'));
  var advice = advisor.errorAdvice(err.message, line, m.data);
  view.markPaneEditorLine(view.paneid('left'), advice.line, 'debugerror');
  showDebugMessage(advice.message);
}

function showDebugMessage(m) {
  var script = (
    '(' + showPopupErrorMessage.toString() + '(' + JSON.stringify(m) + '));');
  view.evalInRunningPane(view.paneid('right'), script, true);
}


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
};

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
  }
  var parsed = parsestack(error);
  if (!parsed) return null;
  // Find the innermost call that corresponds to compiled CoffeeScript
  // or inline Javascript.
  var ownurl = targetWindow.location.href;
  var frame = null;
  for (var j = 0; j < parsed.length; ++j) {
    if (parsed[j].file === ownurl) {
      frame = parsed[j];
      break;
    }
  }
  // For debugging:
  //console.log(JSON.stringify(parsed), '>>>>', JSON.stringify(frame));
  if (!frame) {
    if (error instanceof targetWindow.SyntaxError) {
      if (error.location) {
        return error.location.first_line - 2;
      }
    }
    return null;
  }

  if (!currentSourceMap) return null;
  var smc = new sourcemap.SourceMapConsumer(currentSourceMap);
  var mapped = smc.originalPositionFor({
    line: frame.line - 3,
    column: frame.column - 1
  });

  return mapped.line;
}

//////////////////////////////////////////////////////////////////////
// PARSE ERROR HIGHLIGHTING
//////////////////////////////////////////////////////////////////////

view.on('parseerror', function(pane, err) {
  if (err.loc) {
    // The markPaneEditorLine function uses 1-based line numbering.
    var line = err.loc.line + 1;
    view.markPaneEditorLine(pane, line, 'debugerror');
  }
  if (err.message){
    showDebugMessage(
      "<p>Oops, the computer could not show blocks." +
      "<p>It says:" + err.message.replace(/^.*Error:/i, ''));
  }
});

//////////////////////////////////////////////////////////////////////
// PARSE ERROR HIGHLIGHTING
//////////////////////////////////////////////////////////////////////

view.on('parseerror', function(pane, err) {
  if (err.loc) {
    // The markPaneEditorLine function uses 1-based line numbering.
    var line = err.loc.line + 1;
    view.markPaneEditorLine(pane, line, 'debugerror');
  }
  if (err.message){
    showDebugMessage(
      "<p>Oops, the computer could not show blocks." +
      "<p>It says:" + err.message.replace(/^.*Error:/i, ''));
  }
});


//////////////////////////////////////////////////////////////////////
// GUTTER HIGHLIGHTING SUPPORT
//////////////////////////////////////////////////////////////////////
view.on('entergutter', function(pane, lineno) {
  if (pane != view.paneid('left')) return;
  view.clearPaneEditorMarks(view.paneid('left'), 'debugfocus');
  view.markPaneEditorLine(view.paneid('left'), lineno, 'debugfocus');
  displayProtractorForRecord(debugRecordsByLineNo[lineno]);
});

view.on('leavegutter', function(pane, lineno) {
  view.clearPaneEditorMarks(view.paneid('left'), 'debugfocus');
  view.hideProtractor(view.paneid('right'));
});

view.on('icehover', function(pane, ev) {
  view.clearPaneEditorMarks(view.paneid('left'), 'debugfocus');
  view.hideProtractor(view.paneid('right'));

  if (ev.line === null) return;

  var lineno = ev.line + 1;

  if (pane != view.paneid('left')) return;

  view.markPaneEditorLine(view.paneid('left'), lineno, 'debugfocus');
  if (debugRecordsByLineNo[lineno]) {
    displayProtractorForRecord(debugRecordsByLineNo[lineno]);
  }
});

function convertCoords(origin, astransform) {
  if (!origin) { return null; }
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

var lastRunTime = 0;
function stopButton(command) {
  if (command === 'flash') {
    lastRunTime = +new Date;
    if (pollTimer) { clearTimeout(pollTimer); pollTimer = null; }
    if (!stopButtonShown) {
      view.showMiddleButton('stop');
      stopButtonShown = 1;
    }
    // Within 1.5 seconds, startPollingWindow should be called,
    // cancelling this timer.  If it is not (for example, if we
    // are running a plain HTML file or something else that does
    // not bind to the IDE debugger API), then we just clear
    // the stop button ourselves.
    pollTimer = setTimeout(function() {
      if (stopButtonShown) {
        view.showMiddleButton('run');
        stopButtonShown = 0;
      }
    }, 2000);
  }
  return stopButtonShown;
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

function stopPollingWindow() {
  if (pollTimer) { clearTimeout(pollTimer); pollTimer = null; }
  if (stopButtonShown) {
    view.showMiddleButton('run');
    stopButtonShown = 0;
  }
}

function pollForStop() {
  pollTimer = null;
  if (!targetWindow || !targetWindow.jQuery || !targetWindow.jQuery.turtle ||
      typeof(targetWindow.jQuery.turtle.interrupt) != 'function' ||
      document.hidden) {
    return;
  }
  try {
    var stoppable = targetWindow.jQuery.turtle.interrupt('test');
  } catch (e) {
    stoppable = false;
  }
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

document.addEventListener('visibilityChange', function() {
  if (!document.hidden) { pollForStop(); }
});

view.on('stop', function() {
  // Avoid stop for the first 0.5 s after a user just clicked run.
  if ((new Date) - lastRunTime < 500) {
    return;
  }
  if (!targetWindow || !targetWindow.jQuery || !targetWindow.jQuery.turtle ||
      typeof(targetWindow.jQuery.turtle.interrupt) != 'function') {
    // Do nothing if the program is not something that we can interrupt.
    return;
  }
  try {
    targetWindow.jQuery.turtle.interrupt();
  } catch(e) { }
  stopPollingWindow();
});

///////////////////////////////////////////////////////////////////////////
// DEBUG EXPORT
///////////////////////////////////////////////////////////////////////////

module.exports = debug;
