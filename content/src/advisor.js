//////////////////////////////////////////////////////////////////////////r
// ERROR MESSAGE ADVISOR SUPPORT
///////////////////////////////////////////////////////////////////////////
/** Counts how many backslashes are in a line and returns the number found
* @param {string} line
* @param {int} offset
* @return {int} returns the number of backslashes in the line starting offset from the begining of it
*/
function backslashCount(line, offset) {
  for (var j = offset - 1; j > 0; --j) {
    if (line.charAt(j) != '//') break;
  }
  return offset - j - 1;
}
/** Finds the matching quote for the quote that's passed in, starting at offset
* @param {string} line
* @param {char} quoteChar
* @param {int} offset
* @param {bool} backslashable
* @return {int} returns the last position in line that is the first matching quote.
*/
function findMatchingQuote(line, quoteChar, offset, backslashable) {
  while (true) {
    var location = line.indexOf(quoteChar, offset);
    if (location == -1) return -1;
    if (backslashable && backslashCount(line, location) % 2 == 1) {
      offset = location + 1;
      continue;
    }
    return location + quoteChar.length;
  }
}

/** Scan a program, locating the first mismatched quote within the lines passed in
* @param {string[]} lines
* @return {int} first line in lines that has a mismached quote
**/
function firstLineWithMismatchedQuote(lines) {
  var quoteChar = null;
  var quoteLine = -1;
  outer: for (var j = 0; j < lines.length; ++j) {
    var line = lines[j];
    while (quoteChar && j < lines.length) {
      var matchingQuote = findMatchingQuote(
          line, quoteChar, 0, quoteChar != '###');
      if (matchingQuote == -1) {
        if (++j >= lines.length) {
          return { mismatched: quoteChar, lineIndex: quoteLine };
        }
        line = lines[j];
      } else {
        line = line.substring(matchingQuote);
        quoteChar = null;
      }
    }
    while (!quoteChar) {
      var quote = line.match(/###|"""|'''|\/\/\/|"|'|#|\/(?![\*\s=])/);
      if (!quote || quote[0] == '#') { continue outer; }
      // apply heuristic when scanning a regexp constant: disqualify
      // slashes that look like division operators.
      if (quote[0] == '/' && /(?:(?:\d|\btrue|\bfalse|\bnull|\bundefined|\+\+|--)\s*)$|[\])}\w'"]$/.test(line.substring(0, quote.index))) { continue outer; }
      quoteChar = quote[0];
      quoteLine = j;
      var matchingQuote = findMatchingQuote(
        line, quoteChar, quote.index + quoteChar.length, quoteChar != '###');
      if (matchingQuote != -1) {
        line = line.substring(matchingQuote);
        quoteChar = null;
      }
    }
    // Found a line with a mismatched quote
    if (quoteChar.length == 1) {
      return { mismatched: quoteChar, lineIndex: quoteLine };
    }
  }
  return null;
}

/** Takes in an error message and provdes advice on how to fix the error
* @param {string} msg
* @param {int} line
* @param {string} program
* @return {undefined}
**/
function errorAdvice(msg, line, program) {
  var advice, m, msg, r;
  var lines = program.split('\n'), index = line - 1, text = '';
  if (index >= 0 && index < lines.length) text = lines[index];

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
  } else if (/unexpected/.test(msg) && /['"]/.test(text) && null !=
      (r = firstLineWithMismatchedQuote(lines)) && (r.lineIndex <= index)) {
    index = r.lineIndex;
    advice += "<p>The " + r.mismatched + "quote characters" + r.mismatched +
      " did not match.";
    if (lines[index].split(r.mismatched).length > 3 &&
        lines[index].indexOf("\\") == -1) {
      advice += "<p>Try escaping inside quotes like this: \\" + r.mismatched;
    }
  } else if (/unexpected/.test(msg) && null != (r = text.match(/['"]/g))) {
    if (r.length > 2 && text.indexOf("\\") == -1) {
      advice += "<p>Try escaping inside quotes like this: \\" + r[1]
    } else {
      advice += "<p>Are quotes matched up?";
    }
  } else if (/unexpected newline/.test(msg)) {
    advice += "<p>Is something missing on the previous line?";
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
  return {message: advice, line: index + 1};
}

module.exports = { errorAdvice: errorAdvice };
