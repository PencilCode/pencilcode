define(['jquery', 'pencilformat'],
function($, pencilformat) {

function assembleRunText(edittext, filename, template, targetUrl) {
  var mimeType = mimeForFilename(filename),
      runtext = edittext;
  if (mimeType && /^text\/x-pencilcode/.test(mimeType)) {
    if (!template) {
      template = pencilformat.turtleTemplate;
    }
    runtext = template.templateExecutable(edittext);
    mimeType = mimeForTemplate(filename, template);
  }
  if (!runtext) return '';
  if (mimeType && !/^text\/html/.test(mimeType)) {
    return '<PLAINTEXT>' + runtext;
  }
  // If targetUrl is requested, insert a <base href="target_url" />
  // in a good location.
  if (targetUrl && !/<base/i.exec(runtext)) {
    var firstLink = runtext.match(
          /(?:<link|<script|<style|<body|<img|<iframe|<frame|<meta|<a)\b/i),
        insertLocation = [
          // Prefer the beginning of the <head>.
          runtext.match(/(?:<head)\b[^>]*>\n?/i),
          // Or otherwise, right after <html>.
          runtext.match(/<html\b[^>]*>\n?/i),
          // Or otherwise, right after <!doctype> line.
          runtext.match(/<\!doctype\b[^>]*>\n?/i)
        ],
        insertAt = 0, j, match;
    // Choose a preferred insert location before the first link, or
    // if non, then use the fallback insertAt = 0.
    for (j = 0; j < insertLocation.length; ++j) {
      match = insertLocation[j];
      if (match && (!firstLink || match.index < firstLink.index)) {
        insertAt = match.index + match[0].length;
        break;
      }
    }
    return runtext.substring(0, insertAt) +
             '<base href="' + targetUrl + '" />\n' +
             runtext.substring(insertAt);
  }
  return runtext;
}

function assembleSaveText(edittext, pencil) {
  if (pencil) {
    return pencil.data(edittext);
  }
  return edittext;
}

function mimeForTemplate(filename, template) {
  var result = null;
  if (template) {
    result = template.getValue('mimeType');
  }
  if (!result) {
    result = mimeForFilename(filename);
  }
  console.log('mimeForTemplate', filename, template, result);
  return result;
}

function mimeForFilename(filename) {
  var result = filename && {
    'jpg'  : 'image/jpeg',
    'jpeg' : 'image/jpeg',
    'gif'  : 'image/gif',
    'png'  : 'image/png',
    'bmp'  : 'image/x-ms-bmp',
    'ico'  : 'image/x-icon',
    'htm'  : 'text/html',
    'html' : 'text/html',
    'txt'  : 'text/plain',
    'text' : 'text/plain',
    'css'  : 'text/css',
    'coffee' : 'text/coffeescript',
    'js'   : 'text/javascript',
    'xml'  : 'text/xml'
  }[filename.replace(/^.*\./, '')]
  if (!result) {
    result = 'text/x-pencilcode';
  }
  return result;
}

return {
  assembleRunText: assembleRunText,
  assembleSaveText: assembleSaveText,
  mimeForTemplate: mimeForTemplate,
  mimeForFilename: mimeForFilename
};

});

