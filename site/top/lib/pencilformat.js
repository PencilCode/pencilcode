/*

pencilformat.js

Defines the PencilCode class, which knows how to
deal with Pencil Code base templates and so on.

c = PencilCode(code);
c.resolveBase(urlResolver, whendone);

function whendone() {
  if (c.baseTemplate()) {
    alert('Executable code: ' + c.executable());
  }
}

funciton urlResolver(url, callback) = {
  $.ajax({
    url: url,
    done: function(text) { callback(text); },
    fail: function() { callback(null); }
  });
}


Pencil Code files start with an optional #!pencil line that
specifies how they are expanded to HTML files.  The form of
the #!pencil line is as follows:

#!pencil [template] [URL|turtle|html]

The word "template" is only present if the pencil file is
a template.

A URL, if specified, points to a base template.
Otherwise, the words "turtle" and "html" specify
the built-in base turtle and html templates.

A template describes how to expand the file to an HTML
file.  It contains HTML text interspersed with lines
with section markers {{#sectionname}} {{/sectionname}}.

Sections may not be nested, nor may the names be
duplicated.  Lines containing the section markers
themselves are stripped when processing, so those
lines may contain comments or other decoration to
be ignored.  The location of the special section
{{#code}} is where the template expansion occurs.

For example, given this file A:

  #!pencil http://somedomain.com/drawpoints
  [10, 20]
  [40, 30]

Suppose that http://somedomain.com/drawpoints points
to this file:

  #!pencil template turtle
  list = [
  # {{#code}} - example code below
    [0, 0]
    [0, 1]
  # {{/code}}
  ]
  pen red
  for p in list
    moveto p

Then the expansion of A would turn into the
turtle code:

  #!pencil turtle
  list = [
    [10, 20]
    [40, 30]
  ]
  pen red
  for p in list
    moveto p

The turtle template is built-in, so this in turn would be
expanded to the HTML file (for execution) based on
the built-in turtle template, someething like this:

  <!doctype html>
  <html>
  <script src="/turtlebits.js"></script>
  <body><script type="text/coffeescripot">
  eval $.turtle()

  list = [
    [10, 20]
    [40, 30]
  ]
  pen red
  for p in list
    moveto p
  </script></body></html>

Besides {{#code}, the template system supports meanings for
other sections such as {{#help}} and {{#options}}, not
documented here.

*/


(function(global, module, define) {

// A map from URLs to PencilCode instances for built-in
// base templates.
var registeredBaseTemplate = {};


// Given a raw text file, returns an object with:
//   code: the file without the leading hashbang line.
//   isTemplate: true if it is a template file.
//   baseTemplateUrl: the url of the template to use.
function parseHashbang(data) {
  var firstLineEnd = data.indexOf('\n') + 1,
      hbMatch = firstLineEnd &&
      /^#!pencil(?:[ \t]+(template))?(?:[ \t]+(?!template\b)(\S+))?/.
        exec(data);
  if (hbMatch) {
    return {
      code: data.substr(firstLineEnd),
      isTemplate: !!(hbMatch[1]),
      baseTemplateUrl: hbMatch[2] || 'turtle'
    };
  } else {
    return {
      code: data,
      isTemplate: false,
      baseTemplateUrl: null
    };
  }
}

// Strips a pair of matching single or double quotes surrounding a
// string, if present.
function unquote(s) {
  if (s == null) {
    return null;
  }
  if (s.length >= 2) {
    if (s.charAt(0) == s.charAt(s.length - 1) &&
        (s.charAt(0) == "'" || s.charAt(0) == '"')) {
      return s.substring(1, s.length - 1);
    }
  }
  return s;
}

// Parses an HTML-style argument list a=b c ='d' e= "f" g
function parseArgString(argstring) {
  var argpattern = /\b(\w+)(?:\s*=\s*(\w+|'[^']*'|"[^"]"))?/g,
      argmatch, result = {};
  while (null != (argmatch = argpattern.exec(argstring))) {
    result[argmatch[1]] = unquote(argmatch[2]);
  }
  return result;
}

// Parses a segmented file.
// A segmented file has delimiter lines containing the forms:
//
// {{#sectionname arg1=value1 arg2=value2}}
//
// {{/sectionname}}
//
// Delimiters must have unique names.  They must be matched and
// may not be nested.  Other text on delimiter lines is ignored.
//
// A segmented file can be queried to get the contents or the
// argument values for a section.  It can also be processed
// to substitute text in for any section.
function parseSegmentedFile(code) {
  var segmentpattern =
    /{{([#\/])([a-z]\w*)(\s*\b\w+(?:\s*=\s*(?:\w+|'[^']*'|"[^"]"))?)*\s*}}/,
      errors = [],
      lines = code.split('\n'),
      segment = {},
      result = {
        chunks: [],
        segment: segment
      },
      j, match, seg,
      currentSegment = null,
      currentStart = 0;
  for (j = 0; j < lines.length; ++j) {
    match = segmentpattern.exec(lines[j]);
    if (match && match[1] == '#') {
      if (currentSegment) {
        errors.push('Segment {{#' + currentSegment + '}} not closed.')
      }
      if (j > currentStart) {
        result.chunks.push(lines.slice(currentStart, j).join('\n'));
      }
      currentSegment = match[2];
      seg = {
        name: currentSegment,
        args: parseArgString(match[3]),
        text: ''
      };
      if (segment.hasOwnProperty(match[2])) {
        errors.push('Duplicate segment {{#' + match[2] + '}}.');
      } else {
        segment[currentSegment] = seg;
        result.chunks.push(seg);
      }
      currentSegment = match[2];
      currentStart = j + 1;
    } else if (match && match[1] == '/') {
      if (!currentSegment) {
        errors.push('Unmatched {{/' + match[2] + '}}.');
      } else {
        if (currentSegment != match[2]) {
          errors.push('Mistmatched {{#' + currentSegment +
              '}} and {{/' + match[2] + '}}.');
        }
        if (match[3]) {
          errors.push('Unexpected arguments on {{/' + match[2] + '}}.');
        }
        if (j > currentStart) {
          segment[currentSegment].text =
            lines.slice(currentStart, j).join('\n');
        }
        currentSegment = null;
        currentStart = j + 1;
      }
    }
  }
  if (currentSegment) {
    errors.push('Unmatched {{#' + currentSegment + '}}');
  } else if (j > currentStart) {
    result.chunks.push(lines.slice(currentStart, j).join('\n'));
  }
  if (errors.length) {
    result.errors = errors;
  }
  return result;
}

// Strips a trailing newline off the given string, if any.
function withoutTrailingNewline(s) {
  if (s.length > 0 && s.charAt(s.length - 1) == '\n') {
    return s.substring(0, s.length - 1);
  }
  return s;
}

// Produces an expanded string which concatentes the given
// segmented file, with sections omitted and replaced by
// values (if any) given in the values map.  Sections are
// always started and terminated on a new line; but empty
// values are not given any lines.
function substituteSegments(segmented, values) {
  var j, chunks = segmented.chunks, output = [], val;
  for (j = 0; j < chunks.length; ++j) {
    if (typeof chunks[j] == 'string') {
      output.push(chunks[j]);
    } else {
      if (values.hasOwnProperty(chunks[j].name)) {
        val = values[chunks[j].name];
        if (val) {
          output.push(withoutTrailingNewline(val));
        }
      }
    }
  }
  return output.join('\n');
}

// Determines the number of leading space characters in front
// of every nonempty line of the code, or zero if undetermined.
function detectIndent(code) {
  if (!code) {
    return 0;
  }
  var lines = code.split('\n'), j, minSpaces = Infinity;
  for (j = 0; j < lines.length; ++j) {
    var firstNS = /\S/.exec(lines[j]);
    if (firstNS) {
      minSpaces = Math.min(firstNS.index, minSpaces);
    }
  }
  if (minSpaces == Infinity) {
    return 0;
  }
  return minSpaces;
}

// Removes the given number of leading space chracters (if present)
// from every line of the given code.
function removeIndent(indent, code) {
  var lines = code.split('\n'), j, minSpaces = Infinity;
  for (j = 0; j < lines.length; ++j) {
    var firstNS = /\S/.exec(lines[j]),
        clip = Math.min(lines[j].length, indent);
    if (firstNS) {
      clip = Math.min(firstNS.index, clip);
    }
    lines[j] = lines[j].substr(clip);
  }
  return lines.join('\n');
}

// Inserts the given number of leading space chracters in front of
// every nonspace-containing line of the given code.
function applyIndent(indent, code) {
  indent = indent && parseInt(indent) || 0;
  if (indent) {
    var spaces = '',
        lines = code.split('\n'),
        j;
    while (indent-- > 0) {
      spaces += ' ';
    }
    for (j = 0; j < lines.length; ++j) {
      if (/\S/.test(lines[j])) {
        lines[j] = spaces + lines[j];
      }
    }
    code = lines.join('\n');
  }
  return code;
}

// Creates an HTML-formatted error document.
function errorExecutable(errorList) {
  var output = ['<!doctype html>\n<plaintext>'];
  output.push.apply(output, errorList);
  return output.join('\n');
}

// PencilCode class
//
// obj.data() - the actual serialized data of the program,
//     including the #! at the top.
// obj.code() - the template text with with the #! stripped:
//     the text that appears inside the editor.
// obj.isTemplate() - true if it is a template.
// obj.baseTemplateUrl() - the url of the base template to use,
//     which may be 'turtle' or 'html'.
// obj.errors() - an array of error messages.
// obj.addError(msg) - invalidate the code and adds an error.
// obj.resolveBase(resolver, callback) - instantiates
//     the base template using the $.get-like url resolver,
//     and calls the callback when completed (when either successful
//     or not).
//
// The following may only be run after the base template is
// resolved via resolveBase:
//
// obj.baseTemplate() - non-null if the base template has been
//     filled in successfully.
// obj.expansion() - returns the one-level expansion using the
//     base template (which must be resolved).
// obj.executable() - returns the executable HTML.
// obj.getValue(name) - reads a value from the base template.
//
// Only templates can do the following:
//
// obj.templateValue(name) - returns the value of a template property.
// obj.templateExpansion(instance) - expand a Pencil Code instance once only.
// obj.templateExecutable(instance) - expand a Pencil Code instance to HTML.

function PencilCode(data) {
  if (!this) throw new Error('Use "new PencilCode".');
  this._hashbang = parseHashbang(data);
  this.options = {};
  if (this._hashbang.isTemplate) {
    this._reparseTemplate();
  }
}

// An internal method to reparse the code (if it is a template file).
PencilCode.prototype._reparseTemplate = function _reparseTemplate() {
  var errors = [];
  if (this.baseTemplateUrl() != 'html' &&
      !registeredBaseTemplate.hasOwnProperty(this.baseTemplateUrl())) {
    errors.push('Unsupported base pencil type ' +
        this.baseTemplateUrl() + '.');
  }
  this._template = parseSegmentedFile(this._hashbang.code);
  if (this._template.errors) {
    errors.push.apply(errors, this._template.errors);
  }
  if (this._template.segment.hasOwnProperty('options') &&
      this._template.segment.options.text) {
    try {
      this.options = JSON.parse(this._template.segment.options.text);
    } catch(e) {
      errors.push('Could not parse {{#options}} section: ' + e.message);
    }
  }
  if (!this._template.segment.hasOwnProperty('code')) {
    errors.push('Template missing {{#code}} sections.');
  }
  if (this.errorMessages) {
    delete this.errorMessges;
  }
  if (errors.length) {
    this.errorMessages = errors;
  }
}

// Build a hashbanged PencilCode file.  A new PencilCode instance
// with modified code can be constructed as follows:
//
// new PencilCode(PencilCode.assembleData(
//   old.isTemplate(),
//   old.baseTemplateUrl(),
//   newCode));
PencilCode.assembleData =
function assembleData(isTemplate, baseTemplateUrl, code) {
  if (!isTemplate && !baseTemplateUrl) {
    return code;
  }
  var hbline = '#!pencil';
  if (isTemplate) {
    hbline += ' template';
  }
  if (baseTemplateUrl) {
    hbline += ' ' + baseTemplateUrl;
  }
  return hbline + '\n' + code;
}

PencilCode.resolveTemplate = function(templateUrl, urlResolver, callback) {
  if (registeredBaseTemplate.hasOwnProperty(templateUrl)) {
    callback(registeredBaseTemplate[templateUrl]);
    return;
  }
  urlResolver(templateUrl, function(data) {
    var result = null;
    if (data != null) {
      result = new PencilCode(data);
    }
    callback(result);
    return;
  });
}

// Registered a built-in base template name (e.g., 'turtle', 'html')
// that will not need to be resolved via the URL resolver.
PencilCode.registerBaseTemplate =
function registerBaseTemplate(name, theTemplate) {
  if (!theTemplate.isTemplate()) {
    throw new Error('Base template is not a template.');
  }
  registeredBaseTemplate[name] = theTemplate;
  theTemplate.resolveBase(null, function(){});
  console.log('resolved base for',  theTemplate);
}

// Returns the original data text for the code, including hashbang.
PencilCode.prototype.data = function() {
  return PencilCode.assembleData(
    this._hashbang.isTemplate,
    this._hashbang.baseTemplateUrl,
    this._hashbang.code);
}

// Returns the code to be displayed in the editor, without hashbang.
PencilCode.prototype.code = function() {
  return this._hashbang.code;
}

// Alter the code for this instance (e.g., the user edited it).
PencilCode.prototype.setCode = function setCode(code) {
  this._hashbang.code = code;
  if (this.isTemplate()) {
    this._reparseTemplate();
  }
}

// True if the code is a template.
PencilCode.prototype.isTemplate = function() {
  return this._hashbang.isTemplate;
}

// The base template URL (may be 'turtle' or 'html').
PencilCode.prototype.baseTemplateUrl = function() {
  return this._hashbang.baseTemplateUrl || 'turtle';
}

// null if everything is OK; or an array of parsing error messages.
PencilCode.prototype.errors = function() {
  if (this.errorMessages) {
    return this.errorMessages;
  }
  return null;
}

// null if everything is OK; or an array of parsing error messages.
PencilCode.prototype.addError = function(msg) {
  if (msg) {
    if (!this.errorMessages) {
      this.errorMessages = [];
    }
    this.errorMessages.push(msg);
  }
}

// obj.resolveBase(urlResolver, callback) - instantiates
//     the base template using the $.get-like url resolver,
//     and calls the callback when completed (when either successful
//     or not).
PencilCode.prototype.resolveBase =
function resolveBase(urlResolver, callback) {
  var outer = this;
  if (this._baseTemplate) {
    callback();
    return;
  }
  PencilCode.resolveTemplate(this.baseTemplateUrl(), urlResolver,
  function(template) {
    if (outer._baseTemplate) {
      callback();
      return;
    }
    if (!template) {
      outer.addError('Could not load base template ' +
          outer.baseTemplateUrl() + '.');
    } else {
      outer._baseTemplate = template
    }
    callback();
    return;
  });
}

// non-null if the base template has been filled in
// successfully using resolveTemplate.
PencilCode.prototype.baseTemplate = function() {
  return this._baseTemplate;
}

PencilCode.prototype.expansion = function() {
  if (!this._baseTemplate) {
    return 'Unresolved base template ' + this.baseTemplateUrl() + '.';
  }
  return this._baseTemplate.templateExpansion(this.code());
}

PencilCode.prototype.executable = function() {
  if (this.errorMessages) {
    return errorExecutable(this.errorMessages);
  }
  if (!this._baseTemplate) {
    return errorExecutable([
      'Unresolved base template ' + this.baseTemplateUrl() + '.']);
  }
  return this._baseTemplate.templateExecutable(this.code());
}

PencilCode.prototype.getValue = function(name) {
  if (!this._baseTemplate) {
    return null;
  }
  return this._baseTemplate.templateValue(name);
}

// Returns a template value, if specified, or null otherwise.
// Values can be specified in a JSON object inside {{#option}}{{/option}},
// or they can be specified as long strings in their own section in
// the template.
// Standard options include:
//   code - the default code example for the template.
//   description - a word-or-two description for the template.
//   help - HTML text help describing the template.
//   iconUrl - the url of the icon to use for the template.
//   mimeType - the mime type for the template edited-code.
//   defaultFilename - default filename for a template instance.
PencilCode.prototype.templateValue = function(name) {
  if (this._template &&
      this._template.segment.hasOwnProperty(name) &&
      this._template.segment[name].text) {
    return this._template.segment[name].text;
  }
  if (this.options.hasOwnProperty(name)) {
    return this.options[name];
  }
  return null;
}

// Returns an attribute value for a section, or null if none.
// For example {{#code something=other}} would mean that
// templateSectionValue('code', 'something') would return 'other'.
PencilCode.prototype.templateSectionValue = function(name, attr) {
  if (this._template &&
      this._template.segment.hasOwnProperty(name) &&
      this._template.segment[name].args.hasOwnProperty(attr)) {
    return this._template.segment[name].args[attr];
  }
  return null;
}
// Expands the code of a PencilCode instance with this template.
// Expands the code once only, which means that it may not be
// expanded to executable HTML.
PencilCode.prototype.templateExpansion = function(code) {
  if (!this._template) {
    console.log(this);
    throw new Error('A non-template cannot do an expansion.');
  }
  var indent = this.templateSectionValue('code', 'indent');
  if (indent != null) {
    try {
      indent = parseInt(indent);
    } catch(e) {
      indent = null;
    }
  }
  if (indent == null) {
    indent = detectIndent(this.templateValue('code'));
  }
  return substituteSegments(this._template, {
    code: applyIndent(indent, code)
  });
}

// Expands the code of a PencilCode instance to create executable HTML.
// Can expand built-in templates further.
PencilCode.prototype.templateExecutable = function(code) {
  if (this.errorMessages) {
    return errorExecutable(this.errorMessages);
  }
  var expanded = this.templateExpansion(code);
  if (this.baseTemplateUrl() == 'html') {
    // Avoid infinite recursion.
    return expanded;
  }
  var baseTemplate = registeredBaseTemplate[this.baseTemplateUrl()];
  if (!baseTemplate) {
    throw new Error('Unsupported base template ' +
       this.baseTemplateUrl() + '.');
  }
  return baseTemplate.templateExecutable(expanded);
}

// Register the built-in template for #!pencil html
PencilCode.registerBaseTemplate('html', new PencilCode(
  "#!pencil template html\n" +
  "{{#code}}\n" +
  "{{/code}}\n" +
  "{{#options}}\n" +
  '{"description": "html code", "mimeType": "text/html"}\n' +
  "{{/options}}"
));

// Register the built-in template for #!pencil turtle
PencilCode.registerBaseTemplate('turtle', new PencilCode(
  "#!pencil template html\n" +
  "<!doctype html>\n" +
  "<html>\n" +
  "<head>\n" +
  "<script src=\"http://pencilcode.net/turtlebits.js\"></script>\n" +
  "</head>\n" +
  "<body><script type=\"text/coffeescript\">\n" +
  "eval $.turtle()\n" +
  "\n" +
  "{{#code}}\n" +
  "{{/code}}\n" +
  "{{#options}}\n" +
  '{"description": "turtle code", "mimeType": "text/coffeescript"}\n' +
  "{{/options}}\n" +
  "</script></body></html>"
));

var impl = {
  PencilCode: PencilCode
};

console.log(registeredBaseTemplate);

//
// Nodejs and AMD support: export the implementation as a module using
// either convention.
//
if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  global.PencilCode = PencilCode;
}

// End anonymous scope, and pass in context.
})(
  this,  // global window
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader 
);
