//////////////////////////////////////////////////////////////////////////r
// DEBUGGER SUPPORT
///////////////////////////////////////////////////////////////////////////

var $         = require('jquery'),
    view      = require('view'),
    see       = require('see'),
    sourcemap = require('sourcemap');


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

    if (name === "seeeval"){ reportSeeeval.apply(null, data); }

    if (name === "appear"){ reportAppear.apply(null, data); }

    if (name === "resolve"){ reportResolve.apply(null, data); }

    if (name === "error"){
      reportError.apply(null, data);
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
   // come back and update this reportEvent
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
  trace: function(event,data) {
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
// ERROR MESSAGE HINT SUPPORT
//////////////////////////////////////////////////////////////////////
function getTextOnLine(text, line) {
  var lines = text.split('\n'), index = line - 1;
  if (index >= 0 && index < lines.length) return lines[index];
  return '';
}

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

function errorAdvice(msg, text) {
  var advice, m, msg;
  advice = '<p>Oops, the computer got confused.';
  if (msg) {
    msg = msg.replace(/^Uncaught [a-z]*Error: /i, '');
    if (msg !== "Cannot read property '0' of null") {
      advice += '<p>It says: "' + msg + '"';
    }
  }
  m = /(\w+) is not defined/.exec(msg);
  if (m) {
    if (/^[a-z]{2,}[0-9]+$/i.test(m[1])) {
      advice += "<p>Is there a missing space in '<b>" + m[1] + "</b>'?";
    } else if (/[A-Z]/.test(m[1]) && (m[1].toLowerCase() in {
        'dot':1, 'pen':1, 'fd':1, 'bk':1, 'lt':1, 'rt':1, 'write':1,
        'type':1, 'menu':1, 'play':1, 'speed':1, 'ht':1, 'st':1,
        'cs':1, 'cg':1, 'ct':1, 'fill':1, 'rgb':1, 'rgba':1, 'hsl':1,
        'hsla':1, 'red':1, 'blue':1, 'black':1, 'green':1, 'gray':1,
        'orange':1, 'purple':1, 'pink':1, 'yellow':1, 'gold':1,
        'aqua':1, 'tan':1, 'white':1, 'violet':1, 'snow':1, 'true':1,
        'false':1, 'null':1, 'for':1, 'if':1, 'else':1, 'do':1, 'in':1,
        'return':1})) {
      advice += ("<p>Did you mean '<b>" + (m[1].toLowerCase()) + "</b>' ") +
                ("instead of '<b>" + m[1] + "</b>'?");
    } else if (m[1].toLowerCase().substring(0, 3) === "inf") {
      advice += "<p><b>Infinity</b> is spelled like this with a capital I.";
    } else {
      if (m[1].length > 3) {
        advice += "<p>Is <b>" + m[1] + "</b> spelled right?";
      } else {
        advice += ("<p>Is '<b>" + m[1] + " = </b><em>something</em>' ") +
                  "needed first?";
      }
      advice += "<p>Or are quotes needed around <b>\"" + m[1] + "\"</b>?";
    }
  } else if (/object is not a function/.test(msg)) {
    advice += "<p>Is there missing punctuation like a dot?";
  } else if (/undefined is not a function/.test(msg)) {
    advice += "<p>Is a command misspelled here?";
  } else if (/indentation/.test(msg)) {
    advice += "<p>Is the code lined up neatly?";
    advice += "<p>Or is something unfinished before this?";
  } else if (/not a function/.test(msg)) {
    advice += "<p>Is there a missing comma?";
  } else if (/octal literal/.test(msg)) {
    advice += "<p>Avoid extra 0 digits before a number.";
  } else if (/unexpected when/.test(msg)) {
    advice += "<p>Is the 'when' indented correctly?";
  } else if (/unexpected newline/.test(msg)) {
    advice += "<p>Is something missing on the previous line?";
  } else if (/unexpected ,/.test(msg)) {
    m = /^.*?\b(\w+)\s+\((?:[^()]|\((?:[^()]|\([^()]*\))*\))+,.+\)/.exec(text);
    if (m) {
      advice += '<p>You might need to remove the space after ' +
                '<b>' + m[1] + '</b>.';
    } else if (/(^[^'"]*,\s*['"])|(['"],[^'"]*$)/.test(text)) {
      advice += '<p>You might want to use <b>+</b> instead of <b>,</b> ' +
                'to combine strings.';
    } else {
      advice += "<p>You might not need a comma here.";
    }
  } else if (/unexpected ->/.test(msg)) {
    advice += "<p>Is a comma or '=' missing before the arrow?";
  } else if (/unexpected end of input/.test(msg)) {
    advice += "<p>Is there some unfinished code around here?";
  } else if ((m = /unexpected (\S+)/.exec(msg))) {
    advice += "<p>Is something missing before " + m[1] + "?";
  } else if (/missing ["']/.test(msg) ||
      (msg === "Cannot read property '0' of null")) {
    advice += "<p>Is there a string with an unmatched quote?";
    advice += "<p>It might be on an higher line.";
  } else if (/missing [\])}]/.test(msg)) {
    advice += "<p>It might be missing on an higher line.";
  } else if ((m = /unexpected (\w+)$/.exec(msg))) {
    advice += "<p>You might try removing '" + m[1] + "'";
  } else if (/interrupt\('hung'\)/.test(msg)) {
    advice = '<p>Oops, the computer got stuck in calculations.' +
             '<p>The program was stopped so you can edit it.' +
             '<p>Maybe reduce the number of repeats?';
  }
  return advice;
}


// The error event is triggered when an uncaught exception occurs.
// The err object is an exception or an Event object corresponding
// to the error.
function reportError(err) {
  var line = editorLineNumberForError(err);
  view.markPaneEditorLine(view.paneid('left'), line, 'debugerror');
  var m = view.getPaneEditorData(view.paneid('left'));
  var text = getTextOnLine(m && m.data || '', line);
  var advice = errorAdvice(err.message, text);
  showDebugMessage(advice);
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
