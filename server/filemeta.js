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

function parseMetaString(buf) {
  var j, d, limit, start, end, meta, enc, str = buf.toString('binary');
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
      // Redecode.  Meta part is always encoded as utf8.
      meta = JSON.parse(buf.toString('utf8', start, end));
      // Data part is usually encoded as binary but can be overridden.
      if (meta && meta.encoding && Buffer.isEncoding(meta.encoding)) {
        enc = meta.encoding;
      } else {
        enc = 'binary';
      }
      return {
        data: buf.toString(enc, 0, limit),
        meta: meta
      }
    } catch (e) { }
  }
  return { data: str, meta: null };
}

function printMetaString(data, meta) {
  if (meta == null &&
      (data.lastIndexOf('META@') == -1 || data.lastIndexOf('@META') == -1) &&
      /^[\0-\xff]*$/.test(data)) {
    return new Buffer(data, 'binary');
  }
  var d = delimiter[0];
  if (meta && meta.type) {
    for (var j = 1; j < delimiter.length; ++j) {
      if (delimiter[j].type.test(meta.type)) { d = delimiter[j]; break; }
    }
  }
  var enc = 'binary';
  if (meta && meta.encoding && Buffer.isEncoding(meta.encoding)) {
    enc = meta.encoding;
  } else if (!/^[\0-\xff]*$/.test(data)) {
    // High characters default to utf8; otherwise binary/latin1.
    if (!meta) { meta = {}; };
    enc = meta.encoding = 'utf8';
  }
  return Buffer.concat([
    new Buffer(data, enc),
    new Buffer(d.start + d.escape(JSON.stringify(meta)) + d.end, 'utf8')
  ]);
}

exports.parseMetaString = parseMetaString;
exports.printMetaString = printMetaString;
