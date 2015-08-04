//////////////////////////////////////////////////////////////////////////
// DEBUGGER SUPPORT
///////////////////////////////////////////////////////////////////////////

var $         = require('jquery'),
    view      = require('view'),
    advisor   = require('advisor'),
    see       = require('see'),
    jqueryui  = require('jquery-ui'),
    sourcemap = require('source-map'),
    util      = require('util');

eval(see.scope('debug'));

var targetWindow = null;       // window object of the frame being debugged.
var currentRecordID = 1;          // current index into traceEvents.
var prevIndex = -1;            // previous index of prior traceEvent.
var currentDebugId = 0;        // id used to pair jquery-turtle events with trace events.
var debugRecordsByDebugId = {};// map debug ids -> line execution records.
var debugRecordsByLineNo = {}; // map line numbers -> line execution records.
var variablesByLineNo = {};    // map line numbers -> tracked variables.
var cachedParseStack = {};     // parsed stack traces for currently-running code.
var pollTimer = null;          // poll for stop button.
var stopButtonShown = 0;       // 0 = not shown; 1 = shown; 2 = stopped.
var currentSourceMap = null;   // v3 source map for currently-running instrumented code.
var traceEvents = [];          // list of event location objects created by tracing events             
var stuckTime = null;          // timestmp to detect stuck programs
var sliderTimer = null;        // detect if there is existing timer
var arrows = {};               // keep track of arrows that appear in the program
var programChanged = false;    // whether user edited program while running
var debugMode = true;          // user has debug mode turned on
var slidercurrLine = 0;
var sliderprevLine = 0;
var linenoList = [];

// verification of complexity of stuck loop
var stuckComplexity = {
  lines: 0,
  calls: 0,
  moves: 0
};
var stuckTrivialTime = 2000;   // stuck time in a loop with no library calls
var stuckCallingTime = 8000;   // stuck time in a loop making library calls
var stuckMovingTime = 15000;   // stuck time in a loop moving elements

var linesRun = 0; 
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
  variablesByLineNo = {};
  traceEvents = [];
  screenshots = [];
  linenoList = [];
  arrows = {};
  programChanged = false;
  currentRecordID = 1;
  currentDebugId = 0;
  prevIndex = -1; 
  slidercurrLine = 0;
  sliderprevLine = 0;
  view.clearPaneEditorMarks(view.paneid('left'));
  view.notePaneEditorCleanLineCount(view.paneid('left'));
  view.removeSlider();
  view.removeVariables();
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

    if (name === "enter") { reportEnter.apply(null, data); }

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

    if (event.type === 'before' || event.type === 'enter') {
      currentDebugId += 1;
      var record = {line: 0, eventIndex: null, startCoords: [], endCoords: [], method: "", 
          data: "", seeeval:false};
      traceEvents.push(event);
      currentEventIndex = traceEvents.length - 1;
      record.eventIndex = currentEventIndex;
      var lineno = traceEvents[currentEventIndex].location.first_line;
      linenoList.push(lineno);
      if (debugMode) {
        setupSlider();
      }
      record.line = lineno;
      debugRecordsByDebugId[currentDebugId] = record;
      debugRecordsByLineNo[lineno] = record;
      updateVariables(event.location.first_line, currentEventIndex, event.vars, []);
    } else if (event.type === 'after') {
      updateVariables(event.location.first_line, currentEventIndex, event.vars, event.functionCalls);
    }
  },
  setSourceMap: function (map) {
    currentSourceMap = map;
  }
};

//////////////////////////////////////////////////////////////////////
// STUCK PROGRAM SUPPORT
//////////////////////////////////////////////////////////////////////
function setupSlider() {
  if (sliderTimer) {
    clearTimeout(sliderTimer);
    sliderTimer = null;
  }
  sliderTime = setTimeout(function() {view.createSlider(linenoList)}, 1000);
 
}


function detectStuckProgram() {
  stuckComplexity.lines += 1;
  var currentTime = +(new Date);
  if (!stuckTime) {
    stuckTime = currentTime;
    targetWindow.eval(
      'setTimeout(function() { ide.reportEvent("pulse"); }, 100);'
    );
  }
  if (stuckComplexity.lines % 100 != 1) return;
  var limit = stuckTrivialTime;
  if (stuckComplexity.moves / stuckComplexity.lines > 0.01) {
    limit = stuckCallingTime;
  } else if (stuckComplexity.calls / stuckComplexity.lines > 0.01) {
    limit = stuckMovingTime;
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
// VARIABLE & FUNCTION CALL TRACKING
//////////////////////////////////////////////////////////////////////

var untrackedVariables = [
  // Colors
  "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige",
  "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown",
  "burlywood", "cadetblue", "chartreuse", "chocolate", "coral",
  "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan",
  "darkgoldenrod", "darkgray", "darkgrey", "darkgreen", "darkkhaki",
  "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred",
  "darksalmon", "darkseagreen", "darkslateblue", "darkslategray",
  "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue",
  "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite",
  "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod",
  "gray", "grey", "green", "greenyellow", "honeydew", "hotpink",
  "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush",
  "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan",
  "lightgoldenrodyellow", "lightgray", "lightgrey", "lightgreen",
  "lightpink", "lightsalmon", "lightseagreen", "lightskyblue",
  "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow",
  "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine",
  "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen",
  "mediumslateblue", "mediumspringgreen", "mediumturquoise",
  "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin",
  "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange",
  "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise",
  "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum",
  "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue",
  "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna",
  "silver", "skyblue", "slateblue", "slategray", "slategrey", "snow",
  "springgreen", "steelblue", "tan", "teal", "thistle", "tomato",
  "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow",
  "yellowgreen", "transparent",

  // Other special strings
  "none", "erase", "path", "up", "down", "color", "position", "normal", "touch"
];

var untrackedFunctions = [
  "fd", "bk", "rt", "lt", "slide", "jump", "moveto", "jumpto", "turnto", "play",
  "home", "pen", "pu", "pd", "pe", "fill", "dot", "label", "speed", "ht", "st",
  "wear", "scale", "twist", "mirror", "reload", "done", "plan", "cs", "cg", "ct",
  "defaultspeed", "timer", "tick", "done", "remove", "write", "read", "readnum",
  "readstr", "button", "table", "send", "recv"
];

function mergeVars(oldVars, curVars, areFunctionCalls) {
  var newVars = oldVars.slice();
  var anyChanges = false;
  for (var i = 0; i < curVars.length; i++) {
    // Filter out function definitions.
    if (curVars[i].functionDef) continue;

    // Filter out special turtle variables.
    if (!areFunctionCalls && untrackedVariables.indexOf(curVars[i].name) !== -1) continue;

    // Filter out common turtle functions.
    if (areFunctionCalls && untrackedFunctions.indexOf(curVars[i].name) !== -1) continue;

    var curVarName = curVars[i].name;
    if (areFunctionCalls) {
      curVarName += "(" + curVars[i].argsString + ")";
    }

    // TODO: keep arrays sorted to prevent the inner loop?
    var found = false;
    for (var j = 0; j < oldVars.length; j++) {
      if (oldVars[j].name === curVarName) {
        found = true;
        if (oldVars[j].value !== curVars[i].value) {
          newVars[j] = {name: curVarName, value: valueToString(curVars[i].value)};
          anyChanges = true;
        }
        break;
      }
    }
    if (!found) {
      newVars.push({name: curVarName, value: valueToString(curVars[i].value)});
      anyChanges = true;
    }
  }

  if (anyChanges) {
    return newVars;
  } else {
    return false;
  }
}

function updateVariables(lineNum, eventIndex, vars, functionCalls) {
  variablesByLineNo[lineNum] = variablesByLineNo[lineNum] || [];

  var oldVars = [];
  var oldFunctionCalls = [];
  if (variablesByLineNo[lineNum].length > 0) {
    var last = variablesByLineNo[lineNum][variablesByLineNo[lineNum].length - 1];
    oldVars = last.vars;
    oldFunctionCalls = last.functionCalls;
  }

  // Merge vars with this line's previously displayed vars.
  var newVars = mergeVars(oldVars, vars, false);
  var newFunctionCalls = mergeVars(oldFunctionCalls, functionCalls, true);

  // If nothing changed, don't do anything.
  if (newVars !== false || newFunctionCalls !== false) {
    if (newVars === false) { newVars = oldVars; }
    if (newFunctionCalls === false) { newFunctionCalls = oldFunctionCalls; }
    variablesByLineNo[lineNum].push({eventIndex: eventIndex, vars: newVars, functionCalls: newFunctionCalls});
  }
}

function valueToString(value) {
  if (typeof value === 'function') {
    return '<function>';
  } else if (typeof value === 'object') {
    return '<object>';
  } else {
    return util.inspect(value);
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

function reportEnter(method, debugId, length, coordId, elem, args){
  stuckComplexity.calls += 1;
  var recordD = debugRecordsByDebugId[debugId];
  var recordL = debugRecordsByLineNo[recordD.line];
  recordD.animated = false;
  recordL.animated = false;
}


function reportAppear(method, debugId, length, coordId, elem, args){
if (!programChanged) { 
  var recordD = debugRecordsByDebugId[debugId];
  var recordL = debugRecordsByLineNo[recordD.line];
  recordD.method = method;
  recordL.method = method;
  recordD.args = args;
  recordL.args = args;

  var currentRecord = debugRecordsByDebugId[currentRecordID];
  var currentIndex = currentRecord.eventIndex;
  var currentLocation = traceEvents[currentIndex].location;
  var currentLine = currentLocation.first_line;

  var prevLine = 0;

  stuckComplexity.moves += 1;

  if (recordD) { 
    if (!recordD.seeeval){ 
      var index = recordD.eventIndex;
      var line = traceEvents[index].location.first_line;
      var appear_location = traceEvents[index].location;
      var tracedIndex = -1; 

      //trace lines that are not animation.
      while (currentRecordID < debugId) {
        if (prevIndex != -1) {
          var prevLocation = traceEvents[prevIndex].location;
          prevLine = prevLocation.first_line;
        }
        else {
          var prevLocation = null;
          prevLine = -1;
        }

        if (tracedIndex!= -1) {
          untraceLine(tracedIndex);
          tracedIndex = -1;
        }

        if(currentLine < prevLine && currentIndex == prevIndex + 1) {

          if (arrows[prevIndex] != null) {
            arrows[prevIndex]['after'] =  {first: currentLocation, second: prevLocation};
          }
          else {
            arrows[prevIndex] = {before: null, after: {first: currentLocation, second: prevLocation}};
          }
          if (arrows[currentIndex] != null) {
            arrows[currentIndex]['before'] =  {first: currentLocation, second: prevLocation};
          }
          else{
            arrows[currentIndex] = {before: {first: currentLocation, second: prevLocation}, after : null};
          }
          view.arrow(view.paneid('left'), arrows, currentIndex, false);
          debugRecordsByLineNo[prevLine].eventIndex = prevIndex;
          debugRecordsByLineNo[currentLine].eventIndex = currentIndex;
        }
        traceLine(currentIndex);
        tracedIndex = currentIndex;
        prevLine = currentLine;
        prevIndex = debugRecordsByDebugId[currentRecordID].eventIndex;
        currentRecordID += 1;
        currentRecord = debugRecordsByDebugId[currentRecordID];
        currentIndex = currentRecord.eventIndex
        currentLine = traceEvents[currentIndex].location.first_line;
        currentLocation = traceEvents[currentIndex].location;
      }
      if (tracedIndex != -1) {
        untraceLine(tracedIndex);
        tracedIndex = -1;
      }
      if (line < prevLine && index == prevIndex + 1){

        prevLocation = traceEvents[prevIndex].location;
          
        if (arrows[prevIndex] != null){
          arrows[prevIndex]['after'] =  {first: currentLocation, second: prevLocation};
        }
        else{
          arrows[prevIndex] = {before: null, after: {first: currentLocation, second: prevLocation}};
        }
        if (arrows[index] != null){
          arrows[index]['before'] =  {first: currentLocation, second: prevLocation};
        }
        else{
          arrows[index] = {before: {first: currentLocation, second: prevLocation}, after : null};
        }
        view.arrow(view.paneid('left'), arrows, currentIndex, false);
        debugRecordsByLineNo[prevLine].eventIndex = prevIndex;
        debugRecordsByLineNo[currentLine].eventIndex = currentIndex;
      }
      traceLine(index);
      currentRecordID = debugId;
      recordD.startCoords[coordId] = collectCoords(elem);
      recordL.startCoords[coordId] = collectCoords(elem);
      view.showAllVariablesAt(index, variablesByLineNo);
    }
  }
}
}

function reportResolve(method, debugId, length, coordId, elem, args){
  
  var recordD = debugRecordsByDebugId[debugId];
  if (recordD) {
    if (!recordD.seeeval){
      view.arrow(view.paneid('left'), arrows, -1, false);
      var recordL = debugRecordsByLineNo[recordD.line];
      recordD.method = method;
      recordL.method = method;
      recordD.animated = true;
      recordL.animated = true;
      var index = recordD.eventIndex;
      var line = traceEvents[index].location.first_line
      if (index > 0){
        var prevLine = traceEvents[index -1].location.first_line;
      }
      else{
        var prevLine = -1;
      }
      recordD.endCoords[coordId] = collectCoords(elem);
      recordL.endCoords[coordId] = collectCoords(elem);
      untraceLine(index);
    }          
  }
}

function end_program(){
  //goes back and traces unanimated lines at the end of programs.
  var currentLine = -1; 
  var tracedIndex = -1;
  var justEnded = (currentRecordID <= currentDebugId);
  var prevLine =  -1;
  if (traceEvents[prevIndex]){
    prevLine = traceEvents[prevIndex].location.first_line; 
  } 
  while (currentRecordID <= currentDebugId){

    var currentRecord = debugRecordsByDebugId[currentRecordID];
    var currentIndex = currentRecord.eventIndex;
    var currentLocation = traceEvents[currentIndex].location;
    currentLine = currentLocation.first_line;

   if (prevIndex != -1) {
      var prevLocation = traceEvents[prevIndex].location;
      var prevLine = prevLocation.first_line;
    }
    else{
      var prevLocation = null;
      var prevLine = -1;
    }
    
    if (tracedIndex != -1){
        untraceLine(tracedIndex);
        tracedIndex = -1;
    }
    if(currentLine < prevLine && currentIndex == prevIndex + 1){
          
        if (arrows[prevIndex] != null){
          arrows[prevIndex]['after'] =  {first: currentLocation, second: prevLocation};
        }
        else{
          arrows[prevIndex] = {before: null, after: {first: currentLocation, second: prevLocation}};
        }
        if (arrows[currentIndex] != null){
          arrows[currentIndex]['before'] =  {first: currentLocation, second: prevLocation};
        }
        else{
          arrows[currentIndex] = {before: {first: currentLocation, second: prevLocation}, after : null};
        }
        debugRecordsByLineNo[prevLine].eventIndex = prevIndex;
        debugRecordsByLineNo[currentLine].eventIndex = currentIndex;
        view.arrow(view.paneid('left'), arrows, currentIndex, false);//should I pass in prevIndex and currentRecordID or?
    }
    traceLine(currentIndex);
    tracedIndex = currentIndex;
    prevLine = currentLine;
    prevIndex = currentIndex;
    currentRecordID += 1;
  }
  if (tracedIndex != -1){
        untraceLine(tracedIndex);
        view.arrow(view.paneid('left'), arrows, -1, false);
        tracedIndex = -1;
  }
  prevLine = -1;
  if (justEnded) {
    view.showAllVariablesAt(currentIndex + 1, variablesByLineNo);
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
function traceLine(lineIndex) {
  var line = traceEvents[lineIndex].location.first_line;
  var prevLine = -1;
  var block_mode = true;

  if (!view.getPaneEditorBlockMode(view.paneid("left"))){block_mode = false;}
 
  if (traceEvents[lineIndex-1]){
    prevLine = traceEvents[lineIndex-1].location.first_line;
  }
  $('debugtraceprev').removeClass('inactive').addClass('active');
  view.markPaneEditorLine(
      view.paneid('left'), line, 'guttermouseable', true);
  view.markPaneEditorLine(view.paneid('left'), line, 'debugtrace');
  if (!block_mode) {
    view.markPaneEditorLine(view.paneid('left'), prevLine, 'debugtraceprev');
  }

}

// Unhighlights the given line number as a line no longer being traced.
function untraceLine(lineIndex) {
  var line = traceEvents[lineIndex].location.first_line;
  var prevLine = -1;
  var block_mode = true;

  if (!view.getPaneEditorBlockMode(view.paneid("left"))){block_mode = false;}
 
  if (traceEvents[lineIndex-1]){
    prevLine = traceEvents[lineIndex-1].location.first_line;
  }
  view.clearPaneEditorLine(view.paneid('left'), line, 'debugtrace');
  if (!block_mode){
    view.clearPaneEditorLine(view.paneid('left'), prevLine, 'debugtraceprev');
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
  //(JSON.stringify(parsed), '>>>>', JSON.stringify(frame));
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
  if (debugRecordsByLineNo[lineno]){
    var eventIndex = debugRecordsByLineNo[lineno].eventIndex;
    view.arrow(view.paneid('left'), arrows, eventIndex, true);
    view.clearPaneEditorMarks(view.paneid('left'), 'debugfocus');
    view.markPaneEditorLine(view.paneid('left'), lineno, 'debugfocus');
    displayProtractorForRecord(debugRecordsByLineNo[lineno]);
  }
  
});

view.on('leavegutter', function(pane, lineno) {
  view.clearPaneEditorMarks(view.paneid('left'), 'debugfocus');
  view.hideProtractor(view.paneid('right'));
  $(".editor").remove("arrow");
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
    var eventIndex = debugRecordsByLineNo[lineno].eventIndex;
    view.arrow(view.paneid('left'), arrows, eventIndex, true);
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

    currentRecordID = 0;
    prevIndex = -1;
    prevLocation = null;
    prevLine = -1;

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
    end_program();
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

view.on('delta', function(){ 
  $(".arrow").remove();
  view.removeVariables();
  //need to add code that stops animation!!!
  programChanged = true;
});

///////////////////////////////////////////////////////////////////////////
// SLIDER SUPPORT
///////////////////////////////////////////////////////////////////////////

$('.panetitle').on('click', '.debugtoggle', function () {
  debugMode = !debugMode;
  if(!debugMode) {
    view.removeSlider();
    $(".debugtoggle").text('debug off');
  }
  else {
    setupSlider();
    $(".debugtoggle").text('debug on');
  }
})

function sliderResponse (event, ui) {
  slidercurrLine = ui.value;
  sliderToggle();
}

function sliderToggle() {

  var prevno = debugRecordsByDebugId[sliderprevLine + 1].line;

  view.clearPaneEditorLine(view.paneid('left'), prevno, 'debugtrace');
  sliderprevLine = slidercurrLine;

  var lineno = debugRecordsByDebugId[slidercurrLine + 1].line;

  view.arrow(view.paneid('left'), arrows, slidercurrLine, true);
  view.showAllVariablesAt(slidercurrLine, variablesByLineNo);
  view.hideProtractor(view.paneid('right'));
  
  if (targetWindow.jQuery != null) {
    displayProtractorForRecord(debugRecordsByDebugId[slidercurrLine + 1]);
  }
 
  view.markPaneEditorLine(view.paneid('left'), lineno, 'guttermouseable', true);
  view.markPaneEditorLine(view.paneid('left'), lineno, 'debugtrace');

  $('#label').text('Step ' + ($("#slider").slider("value") + 1) + ' of ' + traceEvents.length + ' Steps');

}

$(document).on('slide', '#slider', function(event, ui) {
  sliderResponse(event, ui);
})

$(document).on('click', '#backButton', function() {
    if (slidercurrLine != 0) {
      slidercurrLine--;
      $("#slider").slider("value", slidercurrLine);
      sliderToggle();
    }
  });

$(document).on('click', '#forwardButton', function() {
  if (slidercurrLine != traceEvents.length - 1) {
    slidercurrLine++
    $("#slider").slider("value", slidercurrLine);
    sliderToggle();
  }
});
///////////////////////////////////////////////////////////////////////////
// DEBUG EXPORT
///////////////////////////////////////////////////////////////////////////

module.exports = debug;
