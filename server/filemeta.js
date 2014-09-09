// File delimiters for appending metadata to a file.  Should all
// include the string @META and META@, and should attempt to be a
// no-op in the language.
var delimiter = [
  {
    start: "###@META\n",
    end: "\nMETA@###",
    escape: function(s) { return s.replace(/###/g, '##\\u0023'); }
  },
  {
    type: /\bjava(?:script)?\b/i,
    start: "/**@META\n",
    end: "\nMETA@**/",
    escape: function(s) { return s.replace(/\*\//g, '*\\/'); }
  },
  {
    type: /\bpython\b/i,
    start: "'''@META\n",
    end: "\nMETA@'''",
    escape: function(s) { return s.replace(/'''/g, "''\\'"); }
  }
];

function parseMetaString(str) {
  var j, d, limit, start, end;
  for (j = 0; j < delimiter.length; ++j) {
    d = delimiter[j];
    end = str.lastIndexOf(d.end);
    if (end < 0) continue;
    limit = str.lastIndexOf(d.start);
    if (limit < 0) continue;
    start = limit + d.start.length;
    if (start >= end) continue;
    if (str.substring(end + d.end.length).trim()) continue;
    try {
      return {
        data: str.substring(0, limit),
        meta: JSON.parse(str.substring(start, end))
      }
    } catch (e) { }
  }
  return { data: str, meta: null };
}

function printMetaString(data, meta) {
  if (meta == null &&
      (data.lastIndexOf('META@') == -1 || data.lastIndexOf('@META') == -1)) {
    return data;
  }
  var d = delimiter[0];
  if (meta && meta.type) {
    for (var j = 1; j < delimiter.length; ++j) {
      if (delimiter[j].type.test(meta.type)) { d = delimiter[j]; break; }
    }
  }
  return (data + d.start + d.escape(JSON.stringify(meta)) + d.end);
}

exports.parseMetaString = parseMetaString;
exports.printMetaString = printMetaString;
