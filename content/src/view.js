///////////////////////////////////////////////////////////////////////////
// VIEW SUPPORT
///////////////////////////////////////////////////////////////////////////

define([
  'jquery',
  'filetype',
  'tooltipster',
  'see',
  'droplet',
  'draw-protractor',
  'ZeroClipboard',
  'FontLoader'
],
function(
  $,
  filetype,
  tooltipster,
  see,
  droplet,
  drawProtractor,
  ZeroClipboard,
  FontLoader
) {

function htmlEscape(s) {
  return s.replace(/[<>&"]/g, function(c) {
    return c=='<'?'&lt;':c=='>'?'&gt;':c=='&'?'&amp;':'&quot;';});
}

// The view has three panes, #left, #right, and #back (the offscreen pane).
//
// Any of the three panes can show:
// - an editor
//    Exposes set/get "current text", "editchange" event, "isdirty".
//   on('editchange')
// - a directory listing
//    Exposes "clicked on link" event (up, new, file, directory)
//   on('linkclick')
//    Exposes "hovered on link" event (for possible preview)
//   on('linkhover')
// - an iframe run of a URL or of HTML text
//   rotateRight / rotateLeft
//
// Preview management
//   Method showPreview(on/off).
// - "isPreviewShown"
//   on('previewtoggle')
//
// The top-button bar
// - Method showButtons([{html:, id:, enabled:}])
//   Method blinkButton(id)
//   Method enableButton(id, true/false)
//   on(id)
//
// The renaming widget
//   on('namechange')
//   getNameText
//   setNameText
//
// The middle run button
//   showRunButton(true/false)
//   on('run')
//   showLoadingProgress

// Private view state
var state = {
  nameText: $('#filename').text(),
  previewMode: true,
  callbacks: {},
  subscriber: null,
  depth: window.history.state && window.history.state.depth || 0,
  aborting: false,
  pane: {
    alpha: initialPaneState(),
    bravo: initialPaneState(),
    charlie: initialPaneState()
  },
}

var dropletMarkClassColors = {
  'debugerror': '#F00',
  'debugfocus': '#FFF',
  'debugtrace': '#FF0'
}

//
// Zeroclipboard seems very flakey.  The documentation says
// that this configuration should not be necessary but it seems to be
//

ZeroClipboard.config({
   swfPath: '/lib/zeroclipboard/ZeroClipboard.swf',
   trustedDomains: [window.location.hostname, window.pencilcode.domain],
   allowScriptAccess: 'always'
});

window.pencilcode.view = {
  // Listens to events
  on: function(tag, cb) { state.callbacks[tag] = cb; },

  // start code execution
  run: function(){ fireEvent('run', []); },

  // publish/subscribe for global events; all global events are broadcast
  // to the parent frames using postMessage() if we are iframed
  subscribe: function(callback){
    state.subscriber = callback; },
  publish: publish,

  // Sets up the text-editor in the view.
  paneid: paneid,
  panepos: panepos,
  setPaneTitle: function(pane, html) { $('#' + pane + 'title_text').html(html); },
  clearPane: clearPane,
  setPaneEditorData: setPaneEditorData,
  changePaneEditorText: function(pane, text) {
    return changeEditorText(state.pane[pane], text);
  },
  getPaneEditorData: getPaneEditorData,
  setPaneEditorBlockMode: setPaneEditorBlockMode,
  getPaneEditorBlockMode: getPaneEditorBlockMode,
  getPaneEditorLanguage: getPaneEditorLanguage,
  markPaneEditorLine: markPaneEditorLine,
  clearPaneEditorLine: clearPaneEditorLine,
  clearPaneEditorMarks: clearPaneEditorMarks,
  notePaneEditorCleanData: notePaneEditorCleanData,
  notePaneEditorCleanLineCount: notePaneEditorCleanLineCount,
  noteNewFilename: noteNewFilename,
  setPaneEditorReadOnly: setPaneEditorReadOnly,
  isPaneEditorEmpty: isPaneEditorEmpty,
  isPaneEditorDirty: isPaneEditorDirty,
  setPaneLinkText: setPaneLinkText,
  setPaneRunHtml: setPaneRunHtml,
  evalInRunningPane: evalInRunningPane,
  showProtractor: showProtractor,
  hideProtractor: hideProtractor,
  setPrimaryFocus: setPrimaryFocus,
  // setPaneRunUrl: setPaneRunUrl,
  hideEditor: function(pane) {
    $('#' + pane + 'title').hide();
    $('#' + pane).hide();
  },
  showEditor: function(pane) {
    $('#' + pane).show();
    $('#' + pane + 'title').show();
  },

  // Mananges panes and preview mode
  setPreviewMode: setPreviewMode,
  getPreviewMode: function() { return state.previewMode; },
  rotateRight: rotateRight,
  rotateLeft: rotateLeft,
  // Sets buttons.
  showButtons: showButtons,
  enableButton: enableButton,
  // Notifications
  flashNotification: flashNotification,
  dismissNotification: dismissNotification,
  flashButton: flashButton,
  // Show login (or create account) dialog.
  showLoginDialog: showLoginDialog,
  // Show share dialog.
  showShareDialog: showShareDialog,
  showDialog: showDialog,
  // The run button
  canShowMiddleButton: true,
  showMiddleButton: function(which) {
    if (window.pencilcode.view.canShowMiddleButton) {
      $('#middle').show();
      showMiddleButton(which);
    } else {
      $('#middle').hide();
    }
  },
  // Sets editable name.
  setNameText: function(s) {
    state.nameText = s;
    $('#filename').text(s);
    var title = s.replace(/\/$/, '').replace(/^.*\//, '');
    var domain = window.location.hostname.replace(/\..*$/, '');
    if (!title) { title = domain; } else { title += ' (' + domain + ')'; }
    if (!title) title = 'Pencil Code Editor';
    document.title = title;
  },
  getNameText: function() { return state.nameText; },
  setNameTextReadOnly: function(b) {
    if (!b) { $('#filename').attr('contentEditable', 'true'); }
    else { $('#filename').removeAttr('contentEditable'); }
  },
  // Sets visible URL without navigating.
  setVisibleUrl: setVisibleUrl,
  // For other modules to fire view events.
  fireEvent: fireEvent,
  // For debugging only
  _state: state
};

$(window).on('resize.editor', function() {
  var pane;
  $('.hpanel').trigger('panelsize');
});

function publish(method, args, requestid){
  if (state.subscriber) { state.subscriber(method, args, requestid); }
}

function paneid(position) {
  return $('.' + position).filter('.pane').attr('id');
}

function panepos(id) {
  return $('#' + id).attr('class').replace(/\s|pane/g, '');
}

function initialPaneState() {
  return {
    editor: null,       // The ace editor instance.
    changeHandler: null,// A closure listening to changes.
    cleanText: null,    // The last-saved copy of the text.
    cleanLineCount: 0,  // The last-run number of lines of text.
    marked: {},         // Tracks highlighted lines (see markPaneEditorLine)
    mimeType: null,     // The current mime type.
    dirtied: false,     // Set if known to be dirty.
    links: null,        // Unused in this mode.
    running: false      // Unused in this mode.
  };
}

function setOnCallback(tag, cb) {
  state.callbacks[tag] = cb;
}

function fireEvent(tag, args) {
  if (tag in state.callbacks) {
    var cb = state.callbacks[tag];
    if (cb) {
      cb.apply(null, args);
    }
  }
}

function setVisibleUrl(targetUrl, addToHistory) {
  var currentDepth = history.state && history.state.depth || 0;
  var currentUrl = history.state && history.state.current || null;
  var previousUrl = history.state && history.state.previous || null;
  if (window.query && !/[\?#]/.test(targetUrl)) {
    targetUrl += window.query;
  }
  if (addToHistory) {
    if (window.history.pushState) {
      window.history.pushState(
          {depth: currentDepth + 1,
           previous: currentUrl,
           current: targetUrl}, document.title, targetUrl);
      state.depth = currentDepth + 1;
    }
  } else {
    if (window.history.replaceState) {
      window.history.replaceState(
          {depth: currentDepth,
           previous: previousUrl,
           current: targetUrl}, document.title, targetUrl);
      state.depth = currentDepth;
    }
  }
}

$(window).on('popstate', function(e) {
  var newDepth = window.history.state && window.history.state.depth || 0;
  var undo = null;
  if (Math.abs(newDepth - state.depth) == 1) {
    if (newDepth > state.depth) {
      undo = function() { state.aborting = true; window.history.back(); }
    } else {
      undo = function() { state.aborting = true; window.history.forward(); }
    }
  }
  state.depth = newDepth;
  if (state.aborting) {
    state.aborting = false;
    return;
  }
  fireEvent('popstate', [undo]);
});

// Calls preventDefault on an event if the event is not an editor.
function ignoreBackspace(e) {
  if (!e || !e.target ||
      e.target.isContentEditable ||
      e.target.tagName == 'INPUT' || e.target.tagName == 'TEXTAREA') {
    // In the above cases, let backspace pass through.
    return;
  }
  // Otherwise, prevent backspace from doing the history "back" action.
  e.preventDefault();
  return false;
}

// Global hotkeys for this application.  Ctrl- (or Command- or backspace) key functions.
var hotkeys = {
  '\r': function() { fireEvent('run'); return false; },
  'S': function() { fireEvent('save'); return false; },
  'H': forwardCommandToEditor,
  'F': forwardCommandToEditor,
  // \x08 is the key code for backspace
  '\x08': ignoreBackspace
};

// Capture global keyboard shortcuts.
$('body').on('keydown', function(e) {
  if (e.ctrlKey || e.metaKey || e.which === 8) {
    var handler = hotkeys[String.fromCharCode(e.which)];
    if (handler) {
      return handler(e);
    }
  }
});

function forwardCommandToEditor(keydown_event) {
  // Only forward the command if an editor is present and it
  // does not already have focus.
  if (!$(document.activeElement).closest('.editor').length) {
    var pane = paneid('left');
    var paneState = state.pane[pane];
    if (paneState.editor) {
      var editor = paneState.editor;
      editor.focus();
      editor.onCommandKey(editor, 1, keydown_event.which);
      return false;
    }
  }
}

///////////////////////////////////////////////////////////////////////////
// NOTIFICATIONS
///////////////////////////////////////////////////////////////////////////

$('#notification').on('click', 'a', function(e) {
  if (e.target.id) {
    fireEvent(e.target.id, []);
    $(e.target).css('outline', '3px dotted blue');
    $('body').off('.flashNotification');
    $('#notification').delay(200).fadeOut();
    return false;
  }
});

function flashNotification(text, loading) {
  var marker = Math.random();
  var hidefunc = function(e) {
    if ($('#notification').data('marker') == marker) {
      dismissNotification();
    }
  };
  // Centering with script.
  if (loading) {
    $('#notification').addClass('loading');
  } else {
    $('#notification').removeClass();
  }
  $('#notification').html(text).data('marker', marker).finish()
      .css({opacity: 0,display: 'inline-block'})
      .css({left:($(window).width() - $('#notification').outerWidth()) / 2})
      .animate({opacity:1}, 200)
      .queue(function(n) {
    $('body').off('.flashNotification');
    $(window).off('.flashNotification');
    $('body').on('blur.flashNotification ' +
        'mousedown.flashNotification keydown.flashNotification', hidefunc);
    $(window).on('resize.flashNotification ' +
        'popstate.flashNotification', hidefunc);
    n();
  });
}

function dismissNotification() {
  if ($('#notification').is(':visible')) {
    $('#notification').removeData('marker');
    $('body').off('.flashNotification');
    $('#notification').delay(200).fadeOut();
  }
}

function flashButton(id) {
  var button = $('#' + id).closest('button'),
      bg = button.css('backgroundColor'),
      j;
  for (j = 0; j < 2; ++j) {
    button.animate({opacity:1},
      function(n){$(this).css({backgroundColor: 'dodgerblue'});})
          .animate({opacity:1},
      function(n){$(this).css({backgroundColor: bg});});
  }
}

///////////////////////////////////////////////////////////////////////////
// FILENAME AND RENAMING
///////////////////////////////////////////////////////////////////////////

function selectEndOf(contentEditableElement)
{
  var range,selection;
  if (document.createRange) {
    range = document.createRange();
    range.selectNodeContents(contentEditableElement);
    range.collapse(false);
    selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  } else if (document.selection) {
    range = document.body.createTextRange();
    range.moveToElementText(contentEditableElement);
    range.collapse(false);
    range.select();
  }
}

function setRangeStart(range, node, charsFromBegin) {
  if (node.firstChild) {
    var count = 0;
    for (var child = node.firstChild; child; child = child.nextSibling) {
      var chars = child.textContent.length;
      if (chars > charsFromBegin) {
        setRangeStart(range, child, charsFromBegin);
        return;
      }
      charsFromBegin -= chars;
      count += 1;
    }
    range.setStart(node, count);
  } else {
    var chars = node.textContent.length;
    range.setStart(node, Math.min(chars, charsFromBegin));
  }
}

function setRangeEnd(range, node, charsFromEnd) {
  if (node.lastChild) {
    var count = 0;
    for (var child = node.lastChild; child; child = child.lastSibling) {
      var chars = child.textContent.length;
      if (chars > charsFromEnd) {
        setRangeEnd(range, child, charsFromEnd);
        return;
      }
      charsFromEnd -= chars;
      count += 1;
    }
    range.setStart(node, count);
  } else {
    var chars = node.textContent.length;
    range.setStart(node, chars - Math.min(chars, charsFromEnd));
  }
}

function selectContentsOf(contentEditableElement, beginOffset, endOffset) {
  var range,selection;
  if (document.createRange) {
    range = document.createRange();
    range.selectNodeContents(contentEditableElement);
    if ((beginOffset || endOffset) && contentEditableElement.textContent) {
      if (beginOffset) {
        setRangeStart(range, contentEditableElement, beginOffset);
      }
      if (endOffset) {
        setRangeStart(range, contentEditableElement, endOffset);
      }
    }
    selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  } else if (document.selection) {
    range = document.body.createTextRange();
    range.moveToElementText(contentEditableElement);
    range.select();
  }
}

$('#filename').on('keypress keydown keyup input', function(e) {
  if (e.charCode === '\r'.charCodeAt(0) || e.charCode === '\n'.charCodeAt(0)) {
    $('#filename').blur();
    return false;
  }
  if (e.charCode >= 20 && e.charCode <= 127 && !/[\w\/.-]/.test(
        String.fromCharCode(e.charCode))) {
    return false;
  }
  var sel = $('#filename');
  var text = sel.text();
  if (sel.children().length || (text != '\xa0' && /\s|\xa0/.test(text))) {
    sel.text(text.replace(/\s|\xa0/g, ''));
    selectEndOf(sel[0]);
  }
  if (text == '') { sel.html('&nbsp;'); }
});

function fixTypedFilename(enteredtext) {
  if (!enteredtext) { return enteredtext; }
  return enteredtext.replace(/\s|\xa0|[^\w\/.-]/g, '')
      .replace(/^\/*/, '').replace(/\/\/+/g, '/');
}

$('#filename').on('blur', function() {
  var sel = $('#filename');
  var enteredtext = sel.text();
  var fixedtext = fixTypedFilename(enteredtext);
  if (!fixedtext) {
    fixedtext = state.nameText;
  }
  if (fixedtext != enteredtext) {
    sel.text(fixedtext);
    selectEndOf(sel[0]);
  }
  if (fixedtext != state.nameText) {
    state.nameText = fixedtext;
    fireEvent('rename', [fixedtext]);
  }
});

///////////////////////////////////////////////////////////////////////////
// BUTTONS
///////////////////////////////////////////////////////////////////////////

$('#owner').on('click', function(e) {
  if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
    fireEvent('root', []);
    e.preventDefault();
  }
});

function fixParentLink(elt) {
  var filename = window.location.pathname;
  if (filename.indexOf('/') >= 0) {
    filename = filename.replace(/\/[^\/]+\/?$/, '');
  } else {
     filename = '';
  }
  if (!filename) {
    filename = '//' + window.pencilcode.domain + '/edit/';
  } else {
    filename += '/';
  }
  $(elt).closest('a').attr('href', filename);
}

$('#folder').on('mousemove', function(e) {
  fixParentLink(this);
});

$('#folder').on('click', function(e) {
  if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
    fireEvent('done', []);
    e.preventDefault();
  } else {
    fixParentLink(this);
  }
});

// These buttons avoid taking focus when you click on them.
$('#buttonbar,#middle').on('mousedown', 'button', function(e) {
  if (this.id) {
    e.preventDefault();
    $(this).addClass('pressed');
  }
});

$('#buttonbar,#middle').on('mousemove', 'button', function(e) {
  if (this.id) {
    if (!e.which) {
      $(this).removeClass('pressed');
    }
  }
});

$('#buttonbar,#middle').on('click', 'button', function(e) {
  // First deal with rename if it's in progress.
  if ($('#filename').is(document.activeElement)) {
    $('#filename').blur();
  }
  if (this.id) {
    $(this).removeClass('pressed');
    $(this).tooltipster('hide');
    fireEvent(this.id, []);
    return false;
  }
});
$('#buttonbar').on('change', 'input[type=checkbox]', function(e) {
  if (e.target.id) {
    fireEvent(e.target.id, [e.target.checked]);
  }
});

// buttonlist should be
// [{label:, id:, callback:, checkbox:, checked:, disabled:, title:}]
function showButtons(buttonlist) {
  var bar = $('#buttonbar');
  var html = '';
  for (var j = 0; j < buttonlist.length; ++j) {
    if (buttonlist[j].checkbox) {
      html += '<button' +
        (buttonlist[j].disabled ? ' disabled' : '') +
        '><label><input type="checkbox"' +
        (buttonlist[j].id ? ' id="' + buttonlist[j].id + '"' : '') +
        (buttonlist[j].checked ? ' checked' : '') +
        (buttonlist[j].disabled ? ' disabled' : '') +
        (buttonlist[j].title ? ' title="' + buttonlist[j].title + '"' : '') +
        '>' + buttonlist[j].label + '</label></button>';
    } else {
      html += '<button' +
        (buttonlist[j].id ? ' id="' + buttonlist[j].id + '"' : '') +
        (buttonlist[j].disabled ? ' disabled' : '') +
        (buttonlist[j].title ? ' title="' + buttonlist[j].title + '"' : '') +
        '>' + buttonlist[j].label + '</button>';
    }
  }
  bar.html(html);

  // Enable tooltipster for any new buttons.
  $('#buttonbar button').tooltipster();
}

function enableButton(id, enable) {
  if (enable) {
    var inp = $('#' + id).removeAttr('disabled');
    inp.closest('button').removeAttr('disabled');
  } else {
    var inp = $('#' + id).attr('disabled', true);
    inp.closest('button').attr('disabled', true);
  }
}

// Centers the middle button div using javascript.
function centerMiddle() {
  var m = $('#middle');
  // Horizontal center taking into account the button width.
  m.css({marginRight: -m.outerWidth() / 2});
  // Vertical center taking into the editor height and button height.
  /*
  m.css({top:($(window).height() -
      ($('.pane').height() + m.outerHeight()) / 2)})
  */
}

$(window).on('resize.middlebutton', centerMiddle);

function showMiddleButton(which) {
  if (which == 'run') {
    var html,
        rightpane = state.pane[paneid('right')],
        leftpane = state.pane[paneid('left')];
    if (rightpane.running && leftpane.editor &&
        rightpane.lastChangeTime >= leftpane.lastChangeTime) {
      html = '<button id="run" class="quiet" ' +
             'title="Restart program (Ctrl+Enter)">' +
             '<div class="reload"></div></button>';
    } else {
      html = '<button id="run" title="Run program (Ctrl+Enter)">' +
             '<div class="triangle"></div></button>';
    }
    $('#middle').find('div').eq(0).html(html);
    if (state.previewMode) {
      $('#middle').show();
      centerMiddle();
    }
  } else if (which == 'stop') {
    $('#middle').find('div').eq(0).html(
      '<button id="stop" title="Stop program">' +
      '<div class="square"></div></button>');
    if (state.previewMode) {
      $('#middle').show();
      centerMiddle();
    }
  } else if (which == 'edit' && state.previewMode) {
    $('#middle').find('div').eq(0).html(
      '<button id="edit">&#x25c1;</button>');
    if (state.previewMode) {
      $('#middle').show();
      centerMiddle();
    }
  } else if (which == 'loading') {
    $('#middle').find('div').eq(0).html(
      '<div class="loading"></div>').show();
    centerMiddle();
  } else {
    $('#middle').hide().find('div').eq(0).html('');
  }
  // Enable tooltipster on the middle button.
  $('#middle button').tooltipster();
}

///////////////////////////////////////////////////////////////////////////
// SHARE DIALOG
///////////////////////////////////////////////////////////////////////////

function showShareDialog(opts) {
  if (!opts) {
    opts = { };
  }

  function addProtocol(path) {
    if (/^\w+:/.test(path)) { return path; }
    return 'http:' + path;
  }

  bodyText = 'Check out this program that I created on http://pencilcode.net!\r\n\r\n';
  bodyText = bodyText + 'Posted program: ' +
     addProtocol(opts.shareStageURL) + '\r\n\r\n';
  bodyText = bodyText + 'Latest program: ' +
     addProtocol(opts.shareRunURL) + '\r\n\r\n';
  bodyText = bodyText + 'Program code: ' +
     addProtocol(opts.shareEditURL) + '\r\n\r\n';

  subjectText = 'Pencilcode program: ' + opts.title;

  // Need to escape the text since it will go into a url link
  bodyText = escape(bodyText);
  subjectText = escape(subjectText);

  var embedText = null;
  if (opts.shareRunURL && !/[>"]/.test(opts.shareRunURL)) {
    embedText = '<iframe src="' + opts.shareRunURL + '" ' +
       'width="640" height="640" frameborder="0" allowfullScreen></iframe>';
  }
  opts.prompt = (opts.prompt) ? opts.prompt : 'Shared &#x2713;';
  opts.content = (opts.content) ? opts.content :
      '<div class="content">' +
        (opts.shareStageURL ?
        '<div class="field">' +
          '<a target="_blank" ' +
          'title="Posted on share.' + window.pencilcode.domain + '" href="' +
          htmlEscape(addProtocol(opts.shareStageURL)) + '">See it here</a> ' +
          '<input readonly type="text" value="' +
          htmlEscape(addProtocol(opts.shareStageURL)) +
          '"><button class="copy" data-clipboard-text="' +
          htmlEscape(addProtocol(opts.shareStageURL)) +
          '"><img src="/image/copy.png" title="Copy"></button>' +
         '</div>' : '') +
        ((opts.shareRunURL && !opts.shareStageURL) ?
        '<div class="field">' +
          '<a target="_blank" ' +
          'title="Run without showing code" href="' +
          htmlEscape(opts.shareRunURL) + '">See it here</a> ' +
          '<input readonly type="text" value="' +
          htmlEscape(opts.shareRunURL) +
          '"><button class="copy" data-clipboard-text="' +
          htmlEscape(opts.shareRunURL) +
          '"><img src="/image/copy.png" title="Copy"></button>' +
        '</div>' : '') +
        '<div class="field">' +
          '<a target="_blank" ' +
          'title="Link showing the code" href="' +
          htmlEscape(opts.shareEditURL) + '">Share code</a> ' +
          '<input readonly type="text" value="' +
          htmlEscape(opts.shareEditURL) +
          '"><button class="copy" data-clipboard-text="' +
          htmlEscape(opts.shareEditURL) +
          '"><img src="/image/copy.png" title="Copy"></button>' +
        '</div>' +
        (embedText ?
        '<div class="field">' +
          '<a target="_blank" ' +
          'title="HTML code to embed" href="' +
          htmlEscape(opts.shareRunURL) + '">Embed code</a> ' +
          '<input readonly type="text" left="1" value="' +
          htmlEscape(embedText) +
          '"><button class="copy" data-clipboard-text="' +
          htmlEscape(embedText) +
          '"><img src="/image/copy.png" title="Copy"></button>' +
        '</div>' : '') +
      '</div><br>' +
    '<button class="cancel">OK</button>' +
    '<button class="ok" title="Share by email">Email</button>';

  opts.init = function(dialog) {
    dialog.find('a.quiet').tooltipster();
    dialog.find('button.ok').tooltipster();
    dialog.find('button.copy').tooltipster();
    dialog.find('.field input').on('click', function() {
      $(this).select();
    }).each(function() {
      if (!$(this).attr('left')) {
        this.scrollLeft = this.scrollWidth;
      }
    });

    var clipboardClient = new ZeroClipboard(dialog.find('button.copy'));
    var tooltipTimer = null;
    clipboardClient.on('ready', function() {
      clipboardClient.on('copy', function(event) {
        var button = event.target;
        // Hide any other copy tooltips in this dialog.
        dialog.find('button.copy').not(button).tooltipster('hide');
        // Just flash tooltipster for a couple seconds, because mouseleave
        // doesn't appear to work.
        $(button).tooltipster('content', 'Copied!').tooltipster('show');
        // Select the text in the copied field.
        setTimeout(function() {
          $(button).closest('.field').find('input').select();
        }, 100);
        clearTimeout(tooltipTimer);
        tooltipTimer = setTimeout(function() {
          $(button).tooltipster('hide');
        }, 1500);
      });
    });
    dialog.find('button.cancel').focus();
  }

  opts.done = function(state) {
    window.open('mailto:?body='+bodyText+'&subject='+subjectText);
  }

  showDialog(opts);
}

function showDialog(opts) {
  var overlay = $('#overlay');
  if (!opts) { opts = {}; }
  overlay.html('');
  var classes = ['dialog'];
  if (opts.center) { classes.push('center'); }
  if (opts.leftopts) { classes.push('leftopts'); }
  var dialogHTML =
    '<div class="' + classes.join(' ') + '">' +
    '<div class="prompt">' + (opts.prompt ? opts.prompt : '') +
    '<div class="info">' + (opts.info ? opts.info : '') + '</div>' +
    (opts.content ? opts.content : '') + '</div></div>';
  var dialog = $(dialogHTML).appendTo(overlay);
  // The following class shows the overlay and adjusts other page UI.
  $('body').addClass('modal');

  ////////////////////////////////////////////////////////////////
  //
  // function: update
  //
  // Called from event handlers inside the dialog.  The parameter
  // is an anonymous object that contains information on what do do:
  // up.cancel --> Close out the dialog
  //
  ////////////////////////////////////////////////////////////////
  function update(up) {
    if (!up) return;
    if (up.cancel) {
      dialog.remove();
      $('body').removeClass('modal');
      if (opts.cancel) { opts.cancel(); }
      return;
    }
    for (attr in up) {
      if (attr == 'disable') {
        if (up.disable) {
          dialog.find('button.ok').attr('disabled', true);
        } else {
          dialog.find('button.ok').removeAttr('disabled');
        }
      } else {
        var x = dialog.find('.' + attr);
        if (x.prop('tagName') == "INPUT") {
          if (x.prop('type') == 'checkbox') {
            x.prop('checked', up[attr]);
          } if (x.prop('type') == 'radio') {
            x.find('[value=' + up[attr] + ']').prop('checked', true);
          } else {
            x.val(up[attr]);
          }
        }
        else {
          x.html(up[attr]);
        }
      }
    }
  }
  function state() {
    var retVal;

    if (opts.retrieveState)
      retVal = opts.retrieveState(dialog);

    if (!retVal)
      retVal = { };

    retVal.update = update;

    return retVal;
  }
  function validate(e) {
    if (e && ($(e.target).attr('target') == '_blank')) {
      // Don't validate on mousedown of a new-window hyperlink.
      return true;
    }
    if (opts.validate) {
      update(opts.validate(state(), e));
    }
  }
  dialog.on('keyup mousedown change', validate);
  dialog.find('button.ok').on('click', function() {
    validate();
    if (!dialog.find('button.ok').is(':disabled') &&
        opts.done) {
      opts.done(state());
    }
  });
  overlay.on('click', function(e) {
    if ($(e.target).hasClass('cancel') || overlay.is(e.target)) {
      update({cancel:true});
    }

    if (opts.onclick) {
      return opts.onclick(e, dialog, state());
    }
  });
  dialog.on('keydown', function(e) {
    if (e.which == 27) {
      update({cancel:true});
      return;
    }

    if (opts.onkeydown) {
      return opts.onkeydown(e, dialog, state());
    }
  });
  if (opts.init) {
    opts.init(dialog);
  }
  validate();
}


////////////////////////////////////////////////////////////////////////////
// LOGIN DIALOG
///////////////////////////////////////////////////////////////////////////

function showLoginDialog(opts) {
  if (!opts)
    opts = { };

  opts.content =
    '<div class="content">' +
    '<div class="field">Name:<div style="display:inline-table">'+
      '<input class="username"' +
      (opts.username ? ' value="' + opts.username + '" disabled' : '') +
      '>' +
      (opts.switchuser ? '<div class="fieldlink">&nbsp;' +
       '<a href="//' + window.pencilcode.domain + '/" class="switchuser">' +
       'Not me? Switch user.</a></div>' : '') +
    '</div></div>' +
      (opts.setpass ?
        '<div class="field">Old password:<input ' +
        'type="password" class="password"></div>' +
        '<div class="field">New password:<input ' +
        'type="password" class="newpass"></div>'
      : '<div class="field">Password:<input ' +
        'type="password" class="password"></div>') +
      (opts.rename ?
        '<div class="field">Filename:<input class="rename" value="' +
         opts.rename + '">' : '') +
    '</div><br>' +
    '<button class="ok">OK</button>' +
    '<button class="cancel">Cancel</button>';
  opts.init = function(dialog) {
    dialog.find('.username').on('keypress', function(e) {
      if (e.which >= 20 && e.which <= 127 && !/[A-Za-z0-9]/.test(
            String.fromCharCode(e.which))) {
        return false;
      }
    });
    dialog.find('.rename').on('keypress', function(e) {
      if (e.which >= 20 && e.which <= 127 && !/[-\._A-Za-z0-9\/]/.test(
            String.fromCharCode(e.which))) {
        return false;
      }
    }).on('keyup blur', function(e) {
      var val = dialog.find('.rename').val();
      var fixed = fixTypedFilename(val);
      if (fixed != val) {
        dialog.find('.rename').val(fixed);
      }
    });
    // This timeout is added so that in the #new case where
    // the dialog and ACE editor are competing for focus, the
    // dialog wins.
    dialog.find('input:not([disabled])').eq(0).focus();
    setTimeout(function() {
      dialog.find('input:not([disabled])').eq(0).focus();
    }, 0);
  }
  opts.onkeydown = function(e, dialog, state) {
    if (e.which == 13) {
      if (dialog.find('.username').is(':focus')) {
        dialog.find('.password').focus();
      } else if (!dialog.find('button.ok').is(':disabled') && opts.done) {
        opts.done(state);
      }
    }
  }
  opts.onclick = function(e, dialog, state) {
    if (opts.switchuser && $(e.target).hasClass('switchuser')) {
      opts.switchuser();
      return false;
    }
  }
  opts.retrieveState = function(dialog) {
    return {
      username: dialog.find('.username').val(),
      checkbox: dialog.find('.agreetoterms').prop('checked'),
      password: dialog.find('.password').val(),
      newpass: dialog.find('.newpass').val(),
      rename: fixTypedFilename(dialog.find('.rename').val()),
    };
  }

  showDialog(opts);
}

///////////////////////////////////////////////////////////////////////////
// PANE MANAGEMENT
///////////////////////////////////////////////////////////////////////////

function setPreviewMode(shown, instant) {
  var duration = instant ? 0 : 400;
  if (shown) {
    $('#middle').show();
    $('.right').css({left: '50%', width: '50%'});
    $('.left').css({width: '50%'});
    $('.back').css({left: '-50%', width: '50%'});
  } else {
    $('#middle').hide();
    $('.right').css({left: '100%', width: '100%'});
    $('.left').css({width: '100%'});
    $('.back').css({left: '-100%', width: '100%'});
    clearPane(paneid('right'));
  }
  state.previewMode = shown;
}

function rotateLeft() {
  var idb = paneid('back');
  var idl = paneid('left');
  var idr = paneid('right');
  $('.back').finish().css({left:'100%'});
  $('.left').finish().animate({left: '-50%'});
  $('.right').finish().animate({left: 0});
  $('.back').animate({left: '50%'});
  $('#' + idb +',#' + idb + 'title').removeClass('back').addClass('right');
  $('#' + idr +',#' + idr + 'title').removeClass('right').addClass('left');
  $('#' + idl +',#' + idl + 'title').removeClass('left').addClass('back');
  setPrimaryFocus();
}

function rotateRight() {
  var idb = paneid('back');
  var idl = paneid('left');
  var idr = paneid('right');
  $('.back').finish().css({left:'-50%'});
  $('.right').finish().animate({left: '100%'});
  $('.left').finish().animate({left: '50%'});
  $('.back').animate({left: 0});
  $('#' + idb +',#' + idb + 'title').removeClass('back').addClass('left');
  $('#' + idr +',#' + idr + 'title').removeClass('right').addClass('back');
  $('#' + idl +',#' + idl + 'title').removeClass('left').addClass('right');
  setPrimaryFocus();
}

///////////////////////////////////////////////////////////////////////////
// RUN PREVIEW PANE
///////////////////////////////////////////////////////////////////////////

function setPaneRunHtml(
    pane, html, filename, targetUrl, fullScreenLink, nocode) {
  clearPane(pane);
  var paneState = state.pane[pane];
  if (!nocode) { paneState.lastChangeTime = +(new Date); }
  paneState.running = true;
  paneState.filename = filename;
  paneState.fullScreenLink = fullScreenLink;
  updatePaneTitle(pane);
  var preview = $('#' + pane + ' .preview');
  if (!preview.length) {
    preview = $('<div class="preview"></div>').appendTo('#' + pane);
  }
  var session = Math.random();
  preview.data('session', session);
  $('#' + pane).queue(function() {
    var p = $(this).find('.preview');
    if (p.data('session') == session) {
      p.html('');
      var iframe = $('<iframe></iframe>').appendTo(p);
      // Destroy and create new iframe.
      var framewin = iframe[0].contentWindow;
      var framedoc = framewin.document;
      framedoc.open();
      // Fake out /home URL instead of /edit URL if possible.
      try {
        if (framewin.history.replaceState) {
          framewin.history.replaceState(null, targetUrl, targetUrl);
        }
      } catch (e) {
        if (window.console) {
          window.console.warn('https://bugzilla.mozilla.org/777526', e)
        }
      }
      framedoc.write(html);
      framedoc.close();
      // Bind the key handlers to the iframe once it's loaded.
      $(iframe).load(function() {
        $('body', framedoc).on('keydown', function(e) {
          if (e.ctrlKey || e.metaKey || e.which === 8) {
            var handler = hotkeys[String.fromCharCode(e.which)];
            if (handler) {
              return handler(e);
            }
          }
        });
      });
    }
    $(this).dequeue();
  });
}

function evalInRunningPane(pane, code, raw) {
  var paneState = state.pane[pane];
  if (!paneState.running) { return [null, 'error: not running (wrong state)']; }
  var preview = $('#' + pane + ' .preview');
  if (!preview.length) { return [null, 'error: not running (no preview)']; }
  var iframe = preview.find('iframe');
  if (!iframe.length) { return [null, 'error: not running (no iframe)']; }
  if (!raw) {
    try {
      if (typeof(iframe[0].contentWindow.see) == 'function') {
        return [iframe[0].contentWindow.see.eval(code), null];
      }
    } catch(e) {
      return [null, 'error: ' + e.message];
    }
  }
  try {
    return [iframe[0].contentWindow.eval(code), null];
  } catch(e) {
    return [null, 'error: ' + e.message];
  }
}

function hideProtractor(pane) {
  var paneState = state.pane[pane];
  var preview = $('#' + pane + ' .preview');
  var protractor = preview.find('.protractor');
  if (protractor.length) {
    protractor.remove();
    preview.find('.protractor-label').remove();
  }
}

// step is a record of the following form:
//  startCoords:
//    pageX:, pageY:, direction:, scale:
//  endCoords:
//    pageX:, pageY:, direction:, scale:
//  command: "fd"
//  args: [50]
function showProtractor(pane, step) {
  var paneState = state.pane[pane];
  if (!paneState.running) {
    console.log('NOT RUNNING, no protractor for you!');
    return;
  }
  var preview = $('#' + pane + ' .preview');
  var protractor = $('<canvas class=protractor>').appendTo(preview);
  protractor.css({
    "position": "absolute",
    "top": "0",
    "left": "0",
    "width": "100vw",
    "height": "100vh",
  });
  protractor[0].width = protractor.width();
  protractor[0].height = protractor.height();
  drawProtractor.renderProtractor(protractor, step);
  labelStep(preview, step);
}

function labelStep(preview, step) {
  if (!step.startCoords) {
    return;
  }
  // TEXT LABEL
  var label = $(preview).find('.protractor-label');
  if (!label.length) {
    label = $('<div class="protractor-label"></div>')
        .css({position: 'absolute', display: 'table', zIndex: 1})
        .insertBefore($(preview).find('.protractor'));
  }
  var argrepr = [], onerepr;
  for (var j = 0; j < step.args.length; ++j) {
    var arg = step.args[j];
    onerepr = null;
    if (!arg) {
      onerepr = 'null';
    }
    if (typeof(arg) == 'number') {
      // JSON repr is no good for Infinity or NaN.
      onerepr = arg.toString();
    }
    if (!onerepr) {
      // Try using JSON repr.
      try {
        onerepr = JSON.stringify(arg);
      } catch (e) { }
    }
    if (!onerepr) {
      // Otherwise, use toString repr.
      onerepr = arg.toString();
    }
    if (onerepr.length > 80) {
      onerepr = onerepr.substr(0, 77) + '...'
    }
    argrepr.push(onerepr);
  }
  if (argrepr.length) {
    label.html(step.command + ' ' + argrepr.join(', '));
  } else {
    label.html(step.command + '()');
  }
  label.css({
    textShadow: '0 0 8px white, 0 0 5px white, 0 0 3px white',
    top: step.startCoords.pageY + $(label).height(),
    left: step.startCoords.pageX - $(label).outerWidth() / 2
  });
}


///////////////////////////////////////////////////////////////////////////
// DIRECTORY LISTING
///////////////////////////////////////////////////////////////////////////

var getScrollbarWidth = function() {
  var div, width = getScrollbarWidth.width;
  if (width === undefined) {
    div = document.createElement('div');
    div.innerHTML = '<div style="width:50px;height:50px;position:absolute;left:-50px;top:-50px;overflow:auto;"><div style="width:1px;height:100px;"></div></div>';
    div = div.firstChild;
    document.body.appendChild(div);
    width = getScrollbarWidth.width = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);
  }
  return width;
};

function setPaneLinkText(pane, links, filename) {
  clearPane(pane);
  var paneState = state.pane[pane];
  paneState.links = links;
  paneState.filename = filename;
  updatePaneLinks(pane);
  updatePaneTitle(pane);
}

$(window).on('resize.listing', function() {
  var panes = [paneid('left'), paneid('right')];
  for (var j = 0; j < panes.length; j++) {
    var pane = panes[j];
    var paneState = state.pane[pane];
    if (paneState.links) {
      updatePaneLinks(pane);
    }
  }
});

function updatePaneLinks(pane) {
  var j, col, items, width, maxwidth, colcount, colsize, colnum,
      tightwidth, item, directory, tag, colsdone, list;
  function fwidth(elem) {
    // Get the width, including fractional width.
    if (elem.getBoundingClientRect) {
      return elem.getBoundingClientRect().width;
    }
    return $(elem).outerWidth();
  }
  list = state.pane[pane].links;
  if (!list) { return; }
  $('#' + pane).html('');
  directory = $('<div class="directory"></div>').appendTo('#' + pane);
  width = Math.floor(fwidth(directory.get(0))) - getScrollbarWidth();
  col = $('<div class="column"></div>').appendTo(directory);
  for (j = 0; j < list.length; j++) {
    tag = list[j].href ? 'a' : 'div';
    item = $('<' + tag + ' class="item"'
        + (list[j].href ? ' href="' + list[j].href + '" ' : '')
        + '>' + list[j].html + '</' + tag + '>')
        .appendTo(col);
    if (list[j].link) {
      item.data('link', list[j].link);
    }
  }
  items = directory.find('.item');
  maxwidth = 0;
  for (j = 0; j < items.length; j++) {
    maxwidth = Math.max(maxwidth, Math.ceil(fwidth(items.get(j))));
  }
  colcount = Math.min(items.length, Math.floor(width / Math.max(1, maxwidth)));
  colsize = items.length;
  while (colcount < items.length) {
    // Attempt shorter columns from colcount + 1 (or colsize - 1 if shorter).
    colsize = Math.min(colsize - 1, Math.ceil(items.length / (colcount + 1)));
    tightwidth = 0;
    colsdone = 0;
    j = 0;
    for (colnum = 0; j < items.length; colnum++) {
      maxwidth = 0;
      for (j = colnum * colsize;
           j < items.length && j < (colnum + 1) * colsize; j++) {
        maxwidth = Math.max(maxwidth, Math.ceil(fwidth(items.get(j))));
      }
      tightwidth += maxwidth;
      colsdone += 1;
      if (tightwidth > width) { break; }
    }
    if (tightwidth > width) { break; }
    colcount = colsdone;
    if (colsize <= 1) { break; }
  }
  colsize = Math.ceil(items.length / colcount);
  for (colnum = 1; colnum * colsize < items.length; colnum++) {
    col = $('<div class="column"></div>').appendTo(directory);
    for (j = colnum * colsize;
         j < items.length && j < (colnum + 1) * colsize; j++) {
      items.eq(j).appendTo(col);
    }
  }
  directory.on('click', '.item', function(e) {
    if (!e.shiftKey && !e.ctrlKey & !e.metaKey && !e.altKey) {
      var link = $(this).data('link');
      var pane = $(this).closest('.pane').attr('id');
      if (link) {
        fireEvent('link', [pane, link]);
        return false;
      }
    }
  });
  var lingerElement = null;
  var lingerTimer = null;
  directory.on('mouseleave', '.item', function(e) {
    clearTimeout(lingerTimer);
    lingerElement = null;
    lingerTimer = null;
  });
  directory.on('mouseenter', '.item', function(e) {
    clearTimeout(lingerTimer);
    lingerElement = this;
    lingerTimer = setTimeout(function() {
      var link = $(lingerElement).data('link');
      var pane = $(lingerElement).closest('.pane').attr('id');
      lingerTimer = null;
      lingerElement = null;
      if (link) {
        fireEvent('linger', [pane, link]);
      }
    }, 600);
  });
}

///////////////////////////////////////////////////////////////////////////
// ACE EDITOR SUPPORT
///////////////////////////////////////////////////////////////////////////

function clearPane(pane, loading) {
  var paneState = state.pane[pane];
  if (paneState.dropletEditor && paneState.dropletEditor.destroy) {
    paneState.dropletEditor.destroy();
  }
  if (paneState.editor) {
    paneState.editor.destroy();
  }
  if (paneState.htmlEditor) {
    paneState.htmlEditor.destroy();
  }
  if (paneState.cssEditor) {
    paneState.cssEditor.destroy();
  }
  paneState.dropletEditor = null;
  paneState.editor = null;
  paneState.htmlEditor = null;
  paneState.cssEditor = null;
  paneState.filename = null;
  paneState.cleanText = null;
  paneState.meta = null;
  paneState.cleanMeta = null;
  paneState.cleanLineCount = 0;
  paneState.marked = {};
  paneState.mimeType = null;
  paneState.dirtied = false;
  paneState.links = null;
  paneState.running = false;
  paneState.lastChangeTime = 0;
  paneState.palette = null;
  paneState.fullScreenLink = false;
  paneState.settingUp = null;
  $('#' + pane).html(loading ? '<div class="vcenter">' +
      '<div class="hcenter"><div class="loading"></div></div></div>' : '');
  $('#' + pane + 'title_text').html('');
}

function modeForMimeType(mimeType) {
  if (!mimeType) {
    return 'ace/mode/text';
  }
  mimeType = mimeType.replace(/;.*$/, '')
  var result = {
    'text/x-pencilcode': 'coffee',
    'text/coffeescript': 'coffee',
    'text/html': 'html',
    'text/css': 'css',
    'text/javascript': 'javascript',
    'text/plain': 'text',
    'text/xml': 'xml',
  }[mimeType];
  if (!result) {
    result = 'text';
  }
  return 'ace/mode/' + result;
}

function dropletModeForMimeType(mimeType) {
  if (!mimeType) {
    return 'ace/mode/text';
  }
  mimeType = mimeType.replace(/;.*$/, '')
  var result = {
    'text/x-pencilcode': 'coffee',
    'text/coffeescript': 'coffee',
    'text/javascript': 'javascript',
  }[mimeType];
  if (!result) {
    result = 'coffee';
  }
  return result;
}

function paletteForMimeType(mimeType) {
  if (mimeType == 'text/x-pencilcode') return COFFEESCRIPT_PALETTE;
  if (mimeType == 'text/coffeescript') return COFFEESCRIPT_PALETTE;
  if (mimeType == 'text/javascript') return JAVASCRIPT_PALETTE;
  if (mimeType == 'application/x-javascript') return JAVASCRIPT_PALETTE;
  return [];
}

function uniqueId(name) {
  return name + '_' + ('' + Math.random()).substr(2);
}

var seenBlockToggle = false;

function updatePaneTitle(pane) {
  var paneState = state.pane[pane];
  var label = '';
  var blockToggleTooltip = null;
  if (paneState.editor) {
    if (/^text\/plain/.test(paneState.mimeType)) {
      label = 'text';
    } else if (/^text\/xml/.test(paneState.mimeType) ||
        /^application\/json/.test(paneState.mimeType)) {
      label = 'data';
    } else if (/^text\/html/.test(paneState.mimeType)) {
      label = 'html';
    } else {
      label = 'code';
      if (mimeTypeSupportsBlocks(paneState.mimeType)) {
        symbol = 'codeicon'
        alt = 'show blocks'
        blockToggleTooltip = 'Click to show blocks';
        if (paneState.dropletEditor.currentlyUsingBlocks) {
          label = 'blocks';
          alt = 'show code'
          symbol = 'blockicon';
          blockToggleTooltip = 'Click to show code';
        }
        label = '<a target="_blank" class="toggleblocks" href="/code/' +
            paneState.filename + '" title="' + blockToggleTooltip +
            '"><span class="' + symbol + '"></span> <span alt="' + alt + '">' +
            '<span>' + label + '</span></span></a>';
      }
      if (/pencilcode/.test(paneState.mimeType)) {
        var visibleMimeType = editorMimeType(paneState);
        // Show the Javascript watermark if the language is JS.
        var showjs = (/javascript/.test(visibleMimeType));
        $('#' + pane + ' .editor').eq(0).toggleClass('jsmark', showjs);
        label = '<div style="float:right" class="langmenu" title="Languages">' +
                '<nobr>&nbsp;<div class="gear">' +
                '&nbsp;</div></div>'
              + label;
      }
    }
  } else if (paneState.links) {
    label = 'directory';
  } else if (paneState.running) {
    if (paneState.fullScreenLink) {
      label = '<a target="_blank" class="fullscreen" href="/home/' +
           paneState.filename + '" title="Click to run in a new window">' +
           '<img src="data:image/png;base64,iVBORw0KGgoAAAANS' +
           'UhEUgAAABsAAAAXCAYAAAD6FjQuAAAAAXNSR0IArs4c6QAAAARnQU1BA' +
           'ACxjwv8YQUAAAAJcEhZcwAACxEAAAsRAX9kX5EAAAAYdEVYdFNvZnR3Y' +
           'XJlAHBhaW50Lm5ldCA0LjAuMvvhp8YAAABjSURBVEhL7Y1JCgAhDAT9/' +
           '6fjpXDAKO42A9YlZOsKViEsQIRDI+PuCCjEMtotECmS5TD3iwGIaGdwp' +
           '5HRdsHLkz1ZGV5+IpuBCLGMeVrQboHIz0HVyE6AQiTL4W4KIhwXZWYRY' +
           'zBP6aySgZYAAAAASUVORK5CYII="> <span alt="open window">' +
           '<span>output</span></span></a>';
    } else {
      label = 'output';
    }
  }
  var title = $('#' + pane + 'title_text').html(label).find('[title]').
      tooltipster({ position: 'top-left' });
  if (blockToggleTooltip && !seenBlockToggle) {
    var toggler = title.filter('.toggleblocks');
    if (toggler.length) {
      toggler.find('.blockicon,.codeicon').css('opacity', 1);
      var timer;
      var canceler = function() {
        seenBlockToggle = true;
        toggler.find('.blockicon,.codeicon').css('opacity', '');
        clearTimeout(timer);
        timer = null;
      }
      toggler.tooltipster('option', 'functionAfter', canceler);
      var timer = setTimeout(function() {
        toggler.tooltipster('show');
        timer = setTimeout(function() {
          toggler.tooltipster('hide');
        }, 5000);
      }, 5000);
    }
  }
}

$('.panetitle').on('click', '.fullscreen', function(e) {
  var pane = $(this).closest('.panetitle').prop('id').replace('title', '');
  e.preventDefault();
  fireEvent('fullscreen', [pane]);
});

$('.panetitle').on('click', '.toggleblocks', function(e) {
  var pane = $(this).closest('.panetitle').prop('id').replace('title', '');
  e.preventDefault();
  var newmode = !getPaneEditorBlockMode(pane);
  setPaneEditorBlockMode(pane, newmode);
});

$('.panetitle').on('click', '.langmenu', function(e) {
  var pane = $(this).closest('.panetitle').prop('id').replace('title', '');
  e.preventDefault();
  showPaneEditorLanguagesDialog(pane);
});

$('.pane').on('click', '.closeblocks', function(e) {
  var pane = $(this).closest('.pane').prop('id');
  e.preventDefault();
  setPaneEditorBlockMode(pane, false);
});

function showPaneEditorLanguagesDialog(pane) {
  if (panepos(pane) != 'left') { return; }
  var paneState = state.pane[pane];
  var visibleMimeType = editorMimeType(paneState);
  updateMeta(paneState);
  var hasHtml = paneState.htmlEditor != null;
  var hasCss = paneState.cssEditor != null;
  var meta = filetype.effectiveMeta(paneState.meta);
  var emptyHtml = !(meta && meta.html && meta.html.trim());
  var emptyCss = !(meta && meta.css && meta.css.trim());
  var turtlebits = findLibrary(meta, 'turtle');
  var hasBits = turtlebits != null;
  var hasTurtle = turtlebits && (!turtlebits.attrs ||
      turtlebits.attrs.turtle == null ||
      turtlebits.attrs.turtle != 'false');

  var opts = {leftopts: 1};
  opts.content =
      '<div style="text-align:left">' +
      '<center>Languages</center>' +
      '<div style="padding:8px 5px 4px">' +
      '<label title="Use a Concise Indent Language">' +
      '<input type="radio" value="text/coffeescript" name="lang"> ' +
      'Coffeescript</label><br>' +
      '<label title="Use the Standard Web Language">' +
      '<input type="radio" value="text/javascript" name="lang"> ' +
      'Javascript</label>' +
      '</div>' +
      '<div style="padding:4px 5px 12px">' +
      '<label title="Edit Cascading Style Sheets">' +
      '<input type="checkbox" class="css"> CSS</label><br>' +
      '<label title="Edit Hypertext Markup Language">' +
      '<input type="checkbox" class="html"> HTML</label>' +
      '</div>' +
      '<center style="padding-top:5px">Libraries</center>' +
      '<div style="padding:8px 5px 15px">' +
      '<label title="Include jQuery, LoDash, and jQ-Turtle">' +
      '<input type="checkbox" class="bits"> Common Library</label><br>' +
      '<label title="Start with a turtle">' +
      '<input type="checkbox" class="turtle"> Main Turtle</label><br>' +
      '</div>' +
      '<center>' +
      '<button class="ok">OK</button>' +
      '<button class="cancel">Cancel</button>' +
      '</center>';

  opts.init = function(dialog) {
    dialog.find('[title]').tooltipster({position:'left'});
    dialog.find('[value="' + visibleMimeType + '"]').prop('checked', true);
    dialog.find('button.ok').focus();
    if (hasHtml) {
      dialog.find('.html').prop('checked', true);
      if (!emptyHtml) {
        dialog.find('.html')
              .attr('disabled', true).parent().css('color', 'gray');
      }
    }
    if (hasCss) {
      dialog.find('.css').prop('checked', true);
      if (!emptyCss) {
        dialog.find('.css')
              .attr('disabled', true).parent().css('color', 'gray');
      }
    }
    if (hasBits) {
      dialog.find('.bits').prop('checked', true);
      if (hasTurtle) {
        dialog.find('.turtle').prop('checked', true);
      }
    }
  }

  opts.retrieveState = function(dialog) {
    return {
      lang: dialog.find('[name=lang]:checked').val(),
      html: dialog.find('.html').prop('checked'),
      css: dialog.find('.css').prop('checked'),
      turtle: dialog.find('.turtle').prop('checked'),
      bits: dialog.find('.bits').prop('checked')
    };
  }

  opts.validate = function(state, ev) {
    if (state.turtle && !state.bits) {
      if (ev && $(ev.target).hasClass('bits')) {
        state.turtle = false;
      }
      else {
        state.bits = true;
      }
      return state;
    }
  }

  opts.done = function(state) {
    state.update({cancel:true});
    var change = false;
    if (state.lang && state.lang != visibleMimeType) {
      setPaneEditorLanguageType(pane, state.lang);
      change = true;
    }
    if (state.bits != hasBits || state.turtle != hasTurtle) {
      var lib = { name: 'turtle', src: '//{site}/turtlebits.js' };
      if (!state.turtle) { lib.attrs = { turtle: 'false' }; }
      if (!paneState.meta) { paneState.meta = {}; }
      toggleLibrary(paneState.meta, lib, state.bits);
      change = true;
    }
    var wantCoffeeScript = false;
    if (change && paneState.meta && /coffeescript/.test(state.lang) &&
        !findLibrary(paneState.meta, 'turtle')) {
      wantCoffeeScript = true;
      if (!paneState.meta) { paneState.meta = {}; }
    }
    if (paneState.meta) {
      toggleLibrary(
          paneState.meta,
          {name: 'coffeescript', src: '//{site}/coffee-script.js'},
          wantCoffeeScript);
    }
    var box = $('#' + pane + ' .hpanelbox');
    var layoutchange = false;
    if (box.length) {
      if (state.html != hasHtml) {
        if (state.html) {
          setupSubEditor(box, pane, paneState, '', 'html');
        } else {
          tearDownSubEditor(box, pane, paneState, 'html');
        }
        change = layoutchange = true;
      }
      if (state.css != hasCss) {
        if (state.css) {
          setupSubEditor(box, pane, paneState, '', 'css');
        } else {
          tearDownSubEditor(box, pane, paneState, 'css');
        }
        change = layoutchange = true;
      }
      if (layoutchange) {
        box.trigger('distribute');
      }
      if (change) {
        paneState.lastChangeTime = +(new Date);
        fireEvent('dirty', [pane]);
        fireEvent('changehtmlcss', [pane]);
      }
    }
  }

  showDialog(opts);

}

function findLibrary(meta, name) {
  if (!meta.libs) return false;
  for (var j = 0; j < meta.libs.length; ++j) {
    if (meta.libs[j].name == name) return meta.libs[j];
  }
  return null;
}

function toggleLibrary(meta, obj, enable) {
  if (!meta.libs) { meta.libs = []; }
  var j;
  for (j = 0; j < meta.libs.length; ++j ) {
    if (meta.libs[j].name == obj.name) break;
  }
  if (enable) {
    if (j >= meta.libs.length) {
      if (obj.name == 'turtle') {
        meta.libs.unshift(obj);
      } else {
        meta.libs.push(obj);
      }
    } else {
      meta.libs[j] = obj;
    }
  } else if (j < meta.libs.length) {
    meta.libs.splice(j, 1);
  }
}


function normalizeCarriageReturns(text) {
  var result = text.replace(/\r\n|\r/g, "\n");
  if (result.length && result.substr(result.length - 1) != '\n') {
    // Ensure empty last line.
    result += '\n';
  }
  return result;
}

// The ACE editor's default keybinding for repeated Ctrl-F is dangerous
// and not good for kids: it toggles between find and replace.
// This function hacks the binding of repeated Ctrl-F so that it does
// the safe and logical thing: it does repeated searches.
function fixRepeatedCtrlFCommand(editor) {
  // ModifiedSearch creates and shows a SearchBox with a modified
  // when-open-keybinding.
  // * Repeated Ctrl-F while the search box is open will just findNext,
  //   and it will select the search input so that it can be retyped.
  //   If in replace mode, Ctrl-F will just skip to the next match
  //   without replacing it.
  // * Ctrl-H (or Command-Option-F) while the search box is open will
  //   switch a non-replace searchbox into replace mode.  If replace-mode
  //   is already open, it focuses on the replace box (if not yet focused),
  //   or if the replace box already has focus, it executes a replacement.
  // As you can see, it takes committment (Ctrl-H) to execute a replacement
  // by keyboard, so it is less likely to happen by accident.
  function ModifiedSearch(searchbox, isReplace) {
    var sb = editor.searchBox || new searchbox.SearchBox(editor);
    sb.$searchBarKb.bindKeys({
      "Ctrl-F|Command-F": function(sb) {
        sb.findNext();
        if (sb.activeInput == sb.searchInput) {
          sb.searchInput.select();
        }
      },
      "Ctrl-H|Command-Option-F": function(sb) {
        if (!sb.isReplace) {
          sb.isReplace = true;
          sb.replaceBox.style.display = "";
          sb.replaceInput.focus();
        } else if (sb.activeInput == sb.replaceInput) {
          sb.replace();
          sb.findNext();
        } else {
          sb.replaceInput.focus();
        }
      }
    });
    sb.show(editor.session.getTextRange(), isReplace);
  }
  // The when not-open keybindings for Ctrl-F and Ctrl-H create our
  // modified SearchBox instead of the ACE editor default SearchBox.
  editor.commands.addCommands([{
    name: "find",
    bindKey: { win: "Ctrl-F", mac: "Command-F" },
    exec: function(editor, line) {
      ace.require('./config').loadModule(
        "ace/ext/searchbox",
        function(module) { ModifiedSearch(module, false); }
      );
    },
    readOnly: true
  }, {
    name: "replace",
    bindKey: { win: "Ctrl-H", mac: "Command-Option-F" },
    exec: function(editor, line) {
      ace.require('./config').loadModule(
        "ace/ext/searchbox",
        function(module) { ModifiedSearch(module, true); }
      );
    },
    readOnly: true
  }])
}

function getTextRowsAndColumns(text) {
  var rawlines = text.split('\n');
  var columns = 0;
  for (var j = 0; j < rawlines.length; ++j) {
    columns = Math.max(columns, rawlines[j].length);
  }
  return {
    rows: rawlines.length,
    columns: columns
  };
}

function changeEditorText(paneState, text) {
  if (!paneState.editor) {
    console.warn('changeEditorText without an editor');
    return;
  }
  // Always ensure there is a trailing newline.
  if (text.length && text.charAt(text.length - 1) != '\n') {
    text += '\n';
  }
  paneState.changeHandler.suppressChange = true;
  var saved = {}, editor = paneState.editor, session = editor.session;
  saved.selection = session.selection.toJSON()
  saved.atend = session.selection.getCursor().row >= session.getLength() - 1;
  saved.folds = session.getAllFolds().map(function(fold) {
    return {
      start       : fold.start,
      end         : fold.end,
      placeholder : fold.placeholder
    };
  });
  saved.scrollTop = session.getScrollTop()
  saved.scrollLeft = session.getScrollLeft()

  // Now set the text and restore everything.
  session.setValue(text);

  session.selection.fromJSON(saved.selection);
  try {
    saved.folds.forEach(function(fold){
      session.addFold(fold.placeholder,
        ace.require('ace/range').Range.fromPoints(fold.start, fold.end));
    });
  } catch(e) { }

  session.setScrollTop(saved.scrollTop);
  session.setScrollLeft(saved.scrollLeft);

  // If the cursor used to be at the end, keep it at the end.
  if (session.selection.isEmpty() && saved.atend) {
    session.selection.moveCursorTo(session.getLength() - 1, 0);
  }

  // TODO: detect the case where some text is added and we should
  // scroll down to make the changes visible.

  paneState.changeHandler.suppressChange = false;
  paneState.changeHandler();
}

// The following palette description
// is copied from compiled CoffeeScript.
var COFFEESCRIPT_PALETTE =[
  {
    name: 'Draw',
    color: 'blue',
    blocks: [
      {
        block: 'pen red',
        title: 'Set the pen color'
      }, {
        block: 'fd 100',
        title: 'Move forward'
      }, {
        block: 'rt 90',
        title: 'Turn right'
      }, {
        block: 'lt 90',
        title: 'Turn left'
      }, {
        block: 'bk 100',
        title: 'Move backward'
      }, {
        block: 'speed 10',
        title: 'Set the speed of the turtle'
      }, {
        block: 'dot blue, 50',
        title: 'Make a dot'
      }, {
        block: 'box green, 50',
        title: 'Make a square'
      }, {
        block: 'label \'hello\'',
        title: 'Write text at the turtle'
      }, {
        block: 'home()',
        title: 'Move the turtle back to start'
      }, {
        block: 'cs()',
        title: 'Clear screen'
      }, {
        block: 'cg()',
        title: 'Clear graphics'
      }, {
        block: 'ht()',
        title: 'Hide the turtle'
      }, {
        block: 'st()',
        title: 'Show the turtle'
      }, {
        block: 'pu()',
        title: 'Lift the pen up'
      }, {
        block: 'pd()',
        title: 'Put the pen down'
      }, {
        block: 'scale 3',
        title: 'Change the size of the turtle'
      }, {
        block: 'pen purple, 10',
        title: 'Set the pen color and size'
      }, {
        block: 'rt 180, 100',
        title: 'Make a wide right turn'
      }, {
        block: 'lt 180, 100',
        title: 'Make a wide left turn'
      }, {
        block: 'slide 100, 20',
        title: 'Slide diagonally or sideways'
      }, {
        block: 'jump 100, 20',
        title: 'Jump without drawing'
      }
    ]
  }, {
    name: 'Control',
    color: 'orange',
    blocks: [
      {
        block: 'button \'Click\', ->\n  ``',
        title: 'Make a button and do something when clicked'
      }, {
        block: 'keydown \'X\', ->\n  ``',
        title: 'Do something when a keyboard key is pressed'
      }, {
        block: 'for [1..3]\n  ``',
        title: 'Do something multiple times'
      }, {
        block: 'for x in [1..3]\n  ``',
        title: 'Do something multiple times...?'
      }, {
        block: 'tick 30, ->\n  ``',
        title: 'Repeat something forever at qually-spaced times'
      }, {
        block: 'if ``\n  ``',
        title: 'Do something only if a condition is true'
      }, {
        block: 'if ``\n  ``\nelse\n  ``',
        title: 'Do something if a condition is true, otherwise something else'
      }
    ]
  }, {
    name: 'Math',
    color: 'green',
    blocks: [
      {
        block: 'x = ``',
        title: 'Set a variable'
      }, {
        block: '`` + ``',
        title: 'Add two numbers'
      }, {
        block: '`` - ``',
        title: 'Subtract two numbers'
      }, {
        block: '`` * ``',
        title: 'Multiply two numbers'
      }, {
        block: '`` / ``',
        title: 'Divide two numbers'
      }, {
        block: '`` is ``',
        title: 'Compare two values'
      }, {
        block: '`` < ``',
        title: 'Compare two values'
      }, {
        block: '`` > ``',
        title: 'Compare two values'
      }, {
        block: 'random [1..100]',
        title: 'Get a random number in a range'
      }, {
        block: 'round ``',
        title: 'Round to the nearest integer'
      }, {
        block: 'abs ``',
        title: 'Absolute value'
      }, {
        block: 'max ``, ``',
        title: 'Get the larger of two numbers'
      }, {
        block: 'min ``, ``',
        title: 'Get the smaller on two numbers'
      }, {
        block: 'f = (param) ->\n  ``',
        title: 'Define a new function'
      }, {
        block: 'myfunc(arg)',
        title: 'Use a custom function'
      }
    ]
  }, {
    name: 'Interact',
    color: 'violet',
    blocks: [
      {
        block: 'mycommand = ->\n  ``',
        title: 'Define a custom command'
      }, {
        block: 'mycommand()',
        title: 'Do a custom command'
      }, {
        block: 'write \'Let\\\'s play!\'',
        title: 'Write a message'
      }, {
        block: 'read \'Name?\', (n) ->\n  write \'Hello\' + n',
        title: 'Read input from the user'
      }, {
        block: 'play \'GEC\'',
        title: 'Play music notes'
      }, {
        block: 'wear \'/img/cat-icon\'',
        title: 'Change the turtle picture'
      }, {
        block: 'moveto lastclick',
        title: 'Move to a location'
      }, {
        block: 'moveto x, y',
        title: 'Move to a coordinate'
      }, {
        block: 'turnto lastmousemove',
        title: 'Turn towards a location'
      }, {
        block: 'click ->\n  write \'Ouch!\'',
        title: 'Do something when the turtle is clicked'
      }, {
        block: 'done ->\n  write \'Whew!\'',
        title: 'Do something when turtles are done moving'
      }, {
        block: 'if pressed \'enter\'\n  write \'Holding.\'',
        title: 'Test if a key is pressed'
      }, {
        block: 'tick 30, ->\n  if pressed \'w\'\n    write \'w\'',
        title: 'Test if a key 30 times per second'
      }, {
        block: 'p = new Piano',
        title: 'Make a new piano'
      }, {
        block: 'p.play \'EDC\'',
        title: 'Tell a piano to play notes'
      }, {
        block: 'w = new Webcam',
        title: 'Make a new webcam'
      }, {
        block: 't = new Turtle',
        title: 'Make a new turtle'
      }
    ]
  }
];

var JAVASCRIPT_PALETTE = [
  {
    name: 'Draw',
    color: 'blue',
    blocks: [
      {
        block: 'pen(red);',
        title: 'Set the pen color'
      }, {
        block: 'fd(100);',
        title: 'Move forward'
      }, {
        block: 'rt(90);',
        title: 'Turn right'
      }, {
        block: 'lt(90);',
        title: 'Turn left'
      }, {
        block: 'bk(100);',
        title: 'Move backward'
      }, {
        block: 'speed(10);',
        title: 'Set the speed of the turtle'
      }, {
        block: 'dot(blue, 50);',
        title: 'Make a dot'
      }, {
        block: 'box(green, 50);',
        title: 'Make a square'
      }, {
        block: 'write(\'hello\');',
        title: 'Write text on the screen'
      }, {
        block: 'label(\'hello\');',
        title: 'Write text at the turtle'
      }, {
        block: 'ht();',
        title: 'Hide the turtle'
      }, {
        block: 'st();',
        title: 'Show the turtle'
      }, {
        block: 'pu();',
        title: 'Pick the pen up'
      }, {
        block: 'pd();',
        title: 'Put the pen down'
      }, {
        block: 'pen(purple, 10);',
        title: 'Set the pen color and thickness'
      }, {
        block: 'rt(180, 100);',
        title: 'Make a wide right turn'
      }, {
        block: 'lt(180, 100);',
        title: 'Make a wide left turn'
      }, {
        block: 'slide(100, 20);',
        title: 'Slide sideways or diagonally'
      }, {
        block: 'jump(100, 20);',
        title: 'Jump without drawing'
      }, {
        block: 'play(\'GEC\');',
        title: 'Play music notes'
      }, {
        block: 'wear(\'/img/cat-icon\');',
        title: 'Change the turtle image'
      }
    ]
  }, {
    name: 'Control',
    color: 'orange',
    blocks: [
      {
        block: 'for (var i = 0; i < 4; i++) {\n  __;\n}',
        title: 'Do something multiple times'
      }, {
        block: 'if (__) {\n  __;\n}',
        title: 'Do something only if a condition is true'
      }, {
        block: 'if (__) {\n  __;\n} else {\n  __;\n}',
        title: 'Do something if a condition is true, otherwise do something else'
      }, {
        block: 'while (__) {\n  __;\n}',
        title: 'Repeat something while a condition is true'
      }
    ]
  }, {
    name: 'Math',
    color: 'green',
    blocks: [
      {
        block: 'var x = __;',
        title: 'Create a variable for the first time'
      }, {
        block: 'x = __;',
        title: 'Reassign a variable'
      }, {
        block: '__ + __',
        title: 'Add two numbers'
      }, {
        block: '__ - __',
        title: 'Subtract two numbers'
      }, {
        block: '__ * __',
        title: 'Multiply two numbers'
      }, {
        block: '__ / __',
        title: 'Divide two numbers'
      }, {
        block: '__ === __',
        title: 'Compare two numbers'
      }, {
        block: '__ > __',
        title: 'Compare two numbers'
      }, {
        block: '__ < __',
        title: 'Compare two numbers'
      }, {
        block: 'random(1, 100)',
        title: 'Get a random number in a range'
      }, {
        block: 'round(__)',
        title: 'Round to the nearest integer'
      }, {
        block: 'abs(__)',
        title: 'Absolute value'
      }, {
        block: 'max(__, __)',
        title: 'Absolute value'
      }, {
        block: 'min(__, __)',
        title: 'Absolute value'
      }
    ]
  }, {
    name: 'Functions',
    color: 'violet',
    blocks: [
      {
        block: 'function myFunction() {\n  __;\n}',
        title: 'Create a function without an argument'
      }, {
        block: 'function myFunction(n) {\n  __;\n}',
        title: 'Create a function with an argument'
      }, {
        block: 'myFunction()',
        title: 'Use a function without an argument'
      }, {
        block: 'myFunction(n)',
        title: 'Use a function with argument'
      }
    ]
  }
];

function editorMimeType(paneState) {
  if (!paneState.mimeType) {
    return;
  }
  if (/pencilcode/.test(paneState.mimeType)) {
    return filetype.effectiveMeta(paneState.meta).type;
  }
  return paneState.mimeType;
}

// Initializes an (ACE) editor into a pane, using the given text and the
// given filename.
// @param pane the id of a pane - alpha, bravo or charlie.
// @param text the initial text to edit.
// @param filename the filename to use.
function setPaneEditorData(pane, doc, filename, useblocks) {
  clearPane(pane);
  var text = normalizeCarriageReturns(doc.data);
  var meta = copyJSON(doc.meta);
  var paneState = state.pane[pane];
  paneState.filename = filename;
  paneState.mimeType = filetype.mimeForFilename(filename);
  paneState.cleanText = text;
  paneState.cleanMeta = JSON.stringify(meta);
  paneState.dirtied = false;
  paneState.meta = meta;
  paneState.settingUp = true;
  var visibleMimeType = editorMimeType(paneState);
  if (!mimeTypeSupportsBlocks(visibleMimeType)) {
    useblocks = false;
  }
  var id = uniqueId('editor');
  var layout = [
    '<div class="hpanelbox">',
    '<div class="hpanel">',
    '<div id="' + id + '" class="editor"></div>',
    '</div>',
    '<div class="hpanel cssmark" style="display:none" share="25">',
    '</div>',
    '<div class="hpanel htmlmark" style="display:none" share="25">',
    '</div>'
  ];
  var box = $('#' + pane).html(layout.join('')).find('.hpanelbox');
  var addhtml = meta && meta.hasOwnProperty('html');
  var addcss = meta && meta.hasOwnProperty('css');
  if (addhtml) {
    box.find('.htmlmark').css('display', 'block');
  }
  if (addcss) {
    box.find('.cssmark').css('display', 'block');
  }
  setupHpanelBox(box);

  // Set up the main editor.
  var dropletMode = dropletModeForMimeType(visibleMimeType);
  var dropletEditor = paneState.dropletEditor =
      new droplet.Editor(
          document.getElementById(id),
          {
            mode: dropletMode,
            palette: paletteForMimeType(visibleMimeType)
          });
  // Set up fonts - once they are loaded.
  whenCodeFontLoaded(function () {
    dropletEditor.setFontFamily("Source Code Pro");
    dropletEditor.setFontSize(15);
  });
  dropletEditor.setPaletteWidth(250);
  if (!/^frame\./.test(window.location.hostname)) {
    // Blue nubby when inside pencilcode.
    dropletEditor.setTopNubbyStyle(0, '#1e90ff');
  } else {
    // Gray nubby when framed.
    dropletEditor.setTopNubbyStyle(0, '#dddddd');
  }
  // Listen to parseerror event before setting up text.
  dropletEditor.on('parseerror', function(e) {
    fireEvent('parseerror', [pane, e]);
  });
  dropletEditor.setEditorState(useblocks);
  dropletEditor.setValue(text);

  setTimeout(function() {
    $('.droplet-hover-div').tooltipster();
  }, 0);
  dropletEditor.on('changepalette', function() {
    $('.droplet-hover-div').tooltipster();
  });

  dropletEditor.on('linehover', function(ev) {
    fireEvent('icehover', [pane, ev]);
  });

  paneState.lastChangeTime = +(new Date);

  dropletEditor.on('change', function() {
    if (paneState.settingUp) return;
    paneState.lastChangeTime = +(new Date);
    fireEvent('dirty', [pane]);
    publish('update', [dropletEditor.getValue()]);
    dropletEditor.clearLineMarks();
    fireEvent('changelines', [pane]);
  });

  dropletEditor.on('toggledone', function() {
    if (!$('.droplet-hover-div').hasClass('tooltipstered')) {
      $('.droplet-hover-div').tooltipster();
    }
    updatePaneTitle(pane);
  });

  if (!/^frame\./.test(window.location.hostname)) {
    $('<div class="closeblocks" title="Switch from blocks to code">' +
      '&times</div>').appendTo(
      dropletEditor.paletteWrapper).tooltipster();
  }

  var mainContainer = $('#' + id);

  setupResizeHandler(mainContainer.parent(), dropletEditor);
  var editor = paneState.editor = dropletEditor.aceEditor;
  var um = editor.getSession().getUndoManager();
  setPrimaryFocus();

  setupAceEditor(pane, mainContainer, editor,
    modeForMimeType(editorMimeType(paneState)), text);
  var session = editor.getSession();
  session.on('change', function() {
    // Any editing that changes the line count ends the debugging session.
    paneState.lastChangeTime = +(new Date);
    if (paneState.cleanLineCount != session.getLength()) {
      clearPaneEditorMarks(pane);
      fireEvent('changelines', [pane]);
    }
  });

  um.reset();
  publish('update', [text]);
  editor.getSession().setUndoManager(um);

  var gutter = mainContainer.find('.ace_gutter');
  gutter.on('mouseenter', '.guttermouseable', function() {
    fireEvent('entergutter', [pane, parseInt($(event.target).text())]);
  });
  gutter.on('mouseleave', '.guttermouseable', function() {
    fireEvent('leavegutter', [pane, parseInt($(event.target).text())]);
  });
  gutter.on('click', '.guttermouseable', function() {
    fireEvent('clickgutter', [pane, parseInt($(event.target).text())]);
  });

  var htmlCssChangeTimer = null;
  var htmlCssRetryCounter = 10;
  function handleHtmlCssChange() {
    htmlCssRetryCounter = 10;
    if (htmlCssChangeTimer) {
      clearTimeout(htmlCssChangeTimer);
    }
    htmlCssChangeTimer = setTimeout(checkForHtmlCssChange, 500);
  }
  function hasAnyErrors(editor) {
    if (!editor) return false;
    var annot = editor.getSession().getAnnotations();
    for (var j = 0; j < annot.length; ++j) {
      if (annot[j].type == 'error')
        return true;
    }
    return false;
  }
  function checkForHtmlCssChange() {
    htmlCssChangeTimer = null;
    if (hasAnyErrors(paneState.htmlEditor) ||
        hasAnyErrors(paneState.cssEditor)) {
      if (htmlCssRetryCounter > 0) {
        htmlCssRetryCounter -= 1;
        htmlCssChangeTimer = setTimeout(checkForHtmlCssChange, 1000);
      }
      return;
    }
    paneState.lastChangeTime = +(new Date);
    fireEvent('changehtmlcss', [pane]);
  }
  paneState.handleHtmlCssChange = handleHtmlCssChange;

  if (addhtml) {
    setupSubEditor(box, pane, paneState, meta.html, 'html');
  }

  if (addcss) {
    setupSubEditor(box, pane, paneState, meta.css, 'css');
  }

  paneState.settingUp = null;
  updatePaneTitle(pane);
}

function setupSubEditor(box, pane, paneState, text, htmlorcss, tearDown) {
  var id = uniqueId(htmlorcss + 'edit');
  box.find('.' + htmlorcss + 'mark').html(
     '<div id="' + id + '" class="editor"></div>').css('display', 'block');
  var container = $('#' + id);
  var editor = paneState[htmlorcss + 'Editor'] = ace.edit(id);
  setupAceEditor(pane, container, editor, "ace/mode/" + htmlorcss, text);
  editor.setValue(text, -1);
  editor.getSession().on('change', paneState.handleHtmlCssChange);
  setupResizeHandler(container.parent(), editor);
}

function tearDownSubEditor(box, pane, paneState, htmlorcss) {
  if (paneState[htmlorcss + 'Editor']) {
    paneState[htmlorcss + 'Editor'].destroy();
    paneState[htmlorcss + 'Editor'] = null;
  }
  box.find('.' + htmlorcss + 'mark').html('').css('display', 'none');
  if (paneState.meta) {
    delete paneState.meta[htmlorcss];
  }
}

function setupAceEditor(pane, elt, editor, mode, text) {
  fixRepeatedCtrlFCommand(editor);
  editor.setTheme("ace/theme/chrome");
  editor.setBehavioursEnabled(false);
  editor.setHighlightActiveLine(false);
  editor.getSession().setFoldStyle('markbeginend');
  editor.getSession().setUseWrapMode(true);
  editor.getSession().setTabSize(2);
  editor.getSession().setMode(mode);

  // Set up sensitivity to touch events - this makes it so
  // that a brief touch brings up the editor.
  $(elt).find('.ace_content').on('touchstart', function(e) {
    // Unwrap jquery event.
    if (e.originalEvent) { e = e.originalEvent; }
    if (e.touches.length) {
      // The renderer really expects screen (scrolled) coordinates,
      // not page coordinates.
      var rc = editor.renderer.screenToTextCoordinates(
        e.touches[0].pageX - window.pageXOffset,
        e.touches[0].pageY - window.pageYOffset);
      editor.moveCursorToPosition(rc);
    }
    if (!editor.isFocused()) {
      // A single touch will focus the editor and bring up
      // the onscreen keyboard.
      editor.focus();
    } else {
      // If already focused, a touch will just move the cursor
      // but not blur focus nor dismiss the onscreen keyboard.
      e.preventDefault();
      return false;
    }
  });

  var dimensions = getTextRowsAndColumns(text);
  // A big font char is 14 pixels wide and 29 pixels high.
  var big = { width: 14, height: 29 };
  // We're "long" if we bump out of the pane rectangle.
  var long = ((dimensions.rows + 2) * big.height > elt.height() ||
              (dimensions.columns + 5) * big.width > elt.width());
  if (long) {
    // Use a small font for long documents.
    $(elt).css({lineHeight: '119%'});
    editor.setFontSize(15);
  } else {
    // Use a giant font for short documents.
    $(elt).css({lineHeight: '121%'});
    editor.setFontSize(24);
  }
  var paneState = state.pane[pane];
  var changeHandler = (function changeHandler() {
    if (changeHandler.suppressChange ||
        (paneState.dropletEditor &&
         paneState.dropletEditor.suppressAceChangeEvent)) {
      return;
    }
    if (paneState.settingUp) return;
    // Add an empty last line on a timer, because the editor doesn't
    // return accurate values for contents in the middle of the change event.
    setTimeout(function() { ensureEmptyLastLine(editor); }, 0);
    var session = editor.getSession();
    // Flip editor to small font size when it doesn't fit any more.
    if (editor.getFontSize() > 15) {
      var long = (session.getLength() * big.height > elt.height());
      if (!long) {
        // Scan for wrapped lines.
        for (var j = 0; j < session.getLength(); ++j) {
          if (session.getRowLength(j) > 1) {
            long = true;
            break;
          }
        }
      }
      if (long) {
        editor.setFontSize(15);
        $('#' + pane + ' .editor').css({lineHeight: '119%'});
      }
    }
    if (!paneState.dirtied) {
      paneState.lastChangeTime = +(new Date);
      fireEvent('dirty', [pane]);
    }
    // Publish the update event for hosting frame.
    publish('update', [session.getValue()]);
  });
  $(elt).data('changeHandler', changeHandler);
  editor.getSession().on('change', changeHandler);
  if (long) {
    editor.gotoLine(0);
  } else {
    editor.gotoLine(editor.getSession().getLength(), 0);
  }
  editor.on('focus', function() {
    var style = editor.container.style;
    if (parseInt(style.left) < -parseInt(style.width) ||
        parseInt(style.top) < -parseInt(style.height)) {
      // Do not pay attention to focus if the editor is positioned offscreen.
      return;
    }
    fireEvent('editfocus', [pane]);
  });
}

function mimeTypeSupportsBlocks(mimeType) {
  return /x-pencilcode|coffeescript|javascript/.test(mimeType);
}

function setPaneEditorLanguageType(pane, type) {
  var paneState = state.pane[pane];
  if (!paneState.dropletEditor) return false;
  var visibleMimeType = editorMimeType(paneState);
  if (type == visibleMimeType) return false;
  paneState.dropletEditor.setMode(dropletModeForMimeType(type));
  paneState.dropletEditor.setPalette(paletteForMimeType(type));
  paneState.editor.getSession().setMode(modeForMimeType(type));
  paneState.meta = filetype.effectiveMeta(paneState.meta);
  paneState.meta.type = type;
  updatePaneTitle(pane);
  return true;
}

function setPaneEditorBlockMode(pane, useblocks) {
  var paneState = state.pane[pane];
  if (!paneState.dropletEditor) return false;
  useblocks = !!useblocks;
  if (paneState.dropletEditor.currentlyUsingBlocks == useblocks) return false;
  var visibleMimeType = editorMimeType(paneState);
  if (useblocks && !mimeTypeSupportsBlocks(visibleMimeType)) return false;
  var togglingSucceeded = paneState.dropletEditor.toggleBlocks();
  if (!togglingSucceeded) return false;
  fireEvent('toggleblocks', [pane, paneState.dropletEditor.currentlyUsingBlocks]);
  return true;
}

function getPaneEditorBlockMode(pane) {
  var paneState = state.pane[pane];
  if (!paneState.dropletEditor) return false;
  return paneState.dropletEditor.currentlyUsingBlocks;
}

function getPaneEditorLanguage(pane) {
  var paneState = state.pane[pane];
  if (!paneState.dropletEditor) return null;
  var mimeType = editorMimeType(paneState);
  if (!mimeType) return null;
  return mimeType.replace(/^text\//, '')
      .replace(/\bx-/, '').replace(/;.*$/, '');
}

// Kids often have trouble figuring out how to add empty lines at the end.
// So ensure there is always one empty line at the end of the document.
function ensureEmptyLastLine(editor) {
  var session = editor.getSession(),
      lines = session.getLength(),
      lastline = lines ? session.getLine(lines - 1) : '',
      curpos = editor.getCursorPosition(),
      newpos;
  if (lastline.length > 0) {
    session.insert(
        {row: Math.max(0, lines - 1), column: lastline.length},
        session.getDocument().getNewLineCharacter());
    newpos = editor.getCursorPosition();
    if (newpos.row !== curpos.row || newpos.column !== curpos.column) {
      editor.moveCursorToPosition(curpos);
    }
  }
}

function setPrimaryFocus() {
  var pane = paneid('left');
  var paneState = state.pane[pane];
  if (paneState.editor) {
    var untitled = /(?:^|\/)untitled[\d]*$/.exec(paneState.filename);
    if (untitled) {
      var elt = $('#filename').focus()[0];
      setTimeout(function() {
        selectContentsOf(elt, untitled.index ? untitled.index + 1 : 0);
      }, 0);
    } else {
      if (!/mobile/i.test(navigator.userAgent)) {
        // Focus the editor by default except on mobile.  The reason is
        // that iOS does not bring up the onscreen keyboard when there
        // is default focus; and then it becomes difficult to get the
        // keyboard, because re-touching will not change focus.
        paneState.editor.focus();
      }
    }
  }
}

function setPaneEditorReadOnly(pane, ro) {
  var paneState = state.pane[pane];
  var containers = [];
  if (!paneState.editor) { return; }
  paneState.editor.setReadOnly(ro);
  containers.push(paneState.editor.container);
  if (paneState.htmlEditor) {
    paneState.htmlEditor.setReadOnly(ro);
    containers.push(paneState.htmlEditor.container);
  }
  if (paneState.cssEditor) {
    paneState.cssEditor.setReadOnly(ro);
    containers.push(paneState.cssEditor.container);
  }
  $(containers).find('.ace_content').css({
    backgroundColor: ro ? 'gainsboro' : 'transparent'
  });
  // Only if the editor is read only do we want to blur it.
  if (ro) {
    paneState.editor.blur();
  }
}

function sameDisregardingTrailingSpace(s1, s2) {
  if (s1 == s2) return true;
  if (s1.length == s2.length) return false;
  if (s1.replace(/\s+$/, '') == s2.replace(/\s+$/, '')) return true;
  return false;
}

function isPaneEditorDirty(pane) {
  var paneState = state.pane[pane];
  if (!paneState.editor) { return false; }
  if (paneState.dirtied) {
    return true;
  }
  updateMeta(paneState);
  var text = paneState.dropletEditor.getValue();
  if (!sameDisregardingTrailingSpace(text, paneState.cleanText)
      || paneState.cleanMeta != JSON.stringify(paneState.meta || null)) {
    paneState.dirtied = true;
    return true;
  }
  return false;
}

function isPaneEditorEmpty(pane) {
  var paneState = state.pane[pane];
  if (!paneState.editor) { return false; }
  updateMeta(paneState);
  if (!sameDisregardingTrailingSpace(paneState.dropletEditor.getValue(), '')) {
    return false;
  }
  if (paneState.htmlEditor &&
      !sameDisregardingTrailingSpace(paneState.htmlEditor.getValue(), '')) {
    return false;
  }
  if (paneState.cssEditor &&
      !sameDisregardingTrailingSpace(paneState.cssEditor.getValue(), '')) {
    return false;
  }
  return true;
}

function updateMeta(paneState) {
  if (!paneState.meta) {
    if (paneState.htmlEditor || paneState.cssEditor) {
      paneState.meta = filetype.effectiveMeta(null);
    }
  }
  // Grab the html and the CSS from the editors.
  if (paneState.htmlEditor) {
    paneState.meta.html = paneState.htmlEditor.getValue();
  }
  if (paneState.cssEditor) {
    paneState.meta.css = paneState.cssEditor.getValue();
  }
}
function getPaneEditorData(pane) {
  var paneState = state.pane[pane];
  if (!paneState.editor) {
    return null;
  }
  var text = paneState.dropletEditor.getValue();
  text = normalizeCarriageReturns(text);
  updateMeta(paneState);
  var metaCopy = copyJSON(paneState.meta);
  return {data: text, mime: paneState.mimeType, meta: metaCopy };
}

// Marks a line of the editor using the given CSS class
// (using 1-based line numbering).
// Marks are cumulative.  To clear all marks of a given class,
// call clearPaneEditorMarks.
// The ACE editor uses an ID number to identify each highlighted line,
// so to allow unhighlighting, we track the ID of every highlighted.
// line inside the paneState marked data structure.  The structure
// is organized as follows:
// paneState.marked = {
//   mark-css-class-name: {
//     zero-based-line-number: ACE-highlighting-id,
//     ... (one for each highlighted line)
//   },
//   (one for each CSS class used for highlighting)
// }
function markPaneEditorLine(pane, line, markclass) {
  var paneState = state.pane[pane];
  if (!paneState.editor) {
    return;
  }
  // ACE uses zero-based line numbering.
  var zline = line - 1;
  // Add the marker.
  if (!paneState.marked[markclass]) {
    paneState.marked[markclass] = {};
  }
  // Grab the map of line numbers for this highlight class.
  // idMap is a map going from zero-index line numbers to
  // ACE editor "highlightLine" IDs.  The ids are needed to
  // later remove line highlights.  For gutter-line-number
  // decorations (for which, by convention, we will use css
  // names starting with the string "gutter"), there are no
  // IDs, but it is still necessary to track whether we have
  // applied a gutter style so that we can avoid adding
  // styles twice, and so that we can remove them later.
  // In the gutter case, so idMap will contain 'true' if we
  // have applied the style on a particular line.
  var idMap = paneState.marked[markclass];
  if (zline in idMap) {
    return;  // Nothing to do if already highlighted.
  }
  if (/^gutter/.test(markclass)) {
    paneState.editor.session.addGutterDecoration(zline, markclass);
    // Save the mark line number so that it can be cleared later (no IDs).
    idMap[zline] = true;
  } else {
    var r = paneState.editor.session.highlightLines(zline, zline, markclass);

    // Mark the ICE editor line, if applicable
    if (paneState.dropletEditor.currentlyUsingBlocks) {
      paneState.dropletEditor.markLine(zline, {
        color: (markclass in dropletMarkClassColors ?
                dropletMarkClassColors[markclass] : '#FF0'),
        tag: markclass
      });
    }

    // Save the mark ID so that it can be cleared later.
    idMap[zline] = r.id;
  }
}

// The inverse of markPaneEditorLine: clears a marked line by
// looking up the ACE marked-line ID and unmarking it.
function clearPaneEditorLine(pane, line, markclass) {
  var paneState = state.pane[pane];
  if (!paneState.editor) {
    return;
  }
  // ACE uses zero-based line numbering.
  var zline = line - 1;
  var idMap = paneState.marked[markclass];
  if (!idMap) {
    return;
  }
  var id = idMap[zline];
  if (id == null) {
    return;
  }
  var session = paneState.editor.session;
  if (/^gutter/.test(markclass)) {
    session.removeGutterDecoration(zline, markclass);
  } else {
    session.removeMarker(id);
  }
  paneState.dropletEditor.unmarkLine(zline, markclass);
  delete idMap[zline];
}

// Clears all marks of the given class.
// If no markclass is passed, clears all marks of all classes.
function clearPaneEditorMarks(pane, markclass) {
  var paneState = state.pane[pane];
  if (!paneState.editor) {
    return;
  }
  if (!markclass) {
    for (markclass in paneState.marked) {
      if (markclass) {
        clearPaneEditorMarks(pane, markclass);
      }
    }
    return;
  }
  var idMap = paneState.marked[markclass];
  var session = paneState.editor.session;
  delete paneState.marked[markclass];
  if (idMap) {
    for (var zline in idMap) {
      if (/^gutter/.test(markclass)) {
        session.removeGutterDecoration(zline, markclass);
      } else {
        session.removeMarker(idMap[zline]);
      }
    }
  }
  paneState.dropletEditor.clearLineMarks(markclass);
}

function notePaneEditorCleanData(pane, data) {
  var text = normalizeCarriageReturns(data.data);
  var paneState = state.pane[pane];
  if (!paneState.editor) {
    return;
  }
  updateMeta(paneState);
  var editortext = paneState.editor.getSession().getValue();
  var editormeta = JSON.stringify(
      paneState.meta == null ? null : paneState.meta);
  var cleanmeta = JSON.stringify(
      data.meta == null ? null : data.meta);
  paneState.cleanText = text;
  paneState.cleanMeta = cleanmeta;
  if ((text == editortext && cleanmeta == editormeta) == (paneState.dirtied)) {
    paneState.dirtied = !paneState.dirtied;
    fireEvent('dirty', [pane]);
  }
}

function notePaneEditorCleanLineCount(pane) {
  var paneState = state.pane[pane];
  if (paneState.editor) {
    paneState.cleanLineCount = paneState.editor.getSession().getLength();
  }
}

function noteNewFilename(pane, filename) {
  var paneState = state.pane[pane];
  paneState.filename = filename;
  if (paneState.editor) {
    paneState.mimeType = filetype.mimeForFilename(filename);
    paneState.editor.getSession().clearAnnotations();
    var visibleMimeType = editorMimeType(paneState);
    paneState.dropletEditor.setMode(dropletModeForMimeType(visibleMimeType));
    paneState.editor.getSession().setMode(modeForMimeType(visibleMimeType));
    if (!mimeTypeSupportsBlocks(visibleMimeType)) {
      setPaneEditorBlockMode(pane, false);
    }
  }
  updatePaneTitle(pane);
}

eval(see.scope('view'));

$('#owner,#filename,#folder').tooltipster();

var codeFontLoaded = false,
    codeFontLoadingCallbacks = [];
var fontloader = new FontLoader(["Source Code Pro"], {
  fontsLoaded: function(failure) {
    if (!failure) {
      codeFontLoaded = true;
      for (var j = 0; j < codeFontLoadingCallbacks.length; ++j) {
        codeFontLoadingCallbacks[j].call();
      }
    }
  }
});
fontloader.loadFonts();

function whenCodeFontLoaded(callback) {
  if (codeFontLoaded) {
    callback.call();
  } else{
    codeFontLoadingCallbacks.push(callback);
  }
}

function copyJSON(m) {
  if (m == null) { return null; }
  return JSON.parse(JSON.stringify(m));
}

function setupResizeHandler(container, editor) {
  var needed = false;
  $(container).on('panelsize', function() {
    if (needed) return;
    needed = true;
    setTimeout(function() {
      needed = false;
      editor.resize();
    }, 0);
  });
}

function setupHpanelBox(box) {
  var hpb = $(box), minh = 29;
  function usePercentHeight(cur) {
    var height = cur.parent().height();
    cur.parent().find('.hpanel').each(function(i, e) {
      var cssh = parseInt($(e).css('height'));
      $(e).css('height', (100 * cssh / height).toFixed(4) + '%');
    });
  }
  hpb.each(function(i, c) {
    var box = $(c);
    function distribute() {
      var total = box.height(), totalShare = 0;
      box.find('.hpanel:visible').each(function (i, p) {
        totalShare += parseFloat($(p).attr('share') || 50);
        total -= parseInt($(p).css('border-top-width') || 0);
      });
      var mh = Math.min(
          minh, Math.floor(total / box.find('.hpanel').length)),
          resize = [];
      box.find('.hpanel:visible').each(function (i, p) {
        var share = parseFloat($(p).attr('share') || 50);
        var height = Math.round(Math.max(mh, total * share / totalShare));
        if ($(p).height() != height) {
          $(p).height(height);
          resize.push(p);
        }
        total -= height;
        totalShare -= share;
      });
      usePercentHeight(box);
      $(resize).trigger('panelsize');
    }
    box.on('distribute', distribute);
    distribute();
  });
  function trackDragHpanel(e, cbdelta) {
    var startX = e.pageX, startY = e.pageY, which = e.which,
        dragcapture = $('<div class="hoverlay"></div>').appendTo('body');
    function watcher(e) {
      if (e.type == 'dragstart') {
        e.preventDefault();
        return false;
      }
      // If mouse is up then we've lost things.
      var lost = (e.type == 'mousemove' && 'which' in e && e.which != e.which);
      var ending = (e.type == 'mouseup' || lost);
      var retval = cbdelta(ending,
            lost ? 0 : e.pageX - startX,
            lost ? 0 : e.pageY - startY);
      if ((retval === false) || ending) {
        dragcapture.remove();
        $(window).off('mousemove mouseup dragstart', watcher);
        e.preventDefault();
        return false;
      }
    }
    $(window).on('mousemove mouseup dragstart', watcher);
    return false;
  }
  hpb.on('mousedown', '.hpanel:visible', function(e) {
    if (this !== e.target || e.which != 1) return;
    var cur = $(this), pdy = 0;
    trackDragHpanel(e, function(end, dx, dy) {
      var dh = pdy - dy, ds, dd = 0, hh, back = false,
          grow, shrink, changed = [];
      if (dh >= 0) {
        grow = cur;
        shrink = cur.prevAll('.hpanel:visible:first');
        back = true;
      } else {
        grow = cur.prevAll('.hpanel:visible:first');
        shrink = cur;
        dh = -dh;
      }
      while (dh && shrink && grow && shrink.length && grow.length) {
        hh = shrink.height();
        if (hh > minh) {
          ds = Math.min(dh, hh - minh);
          shrink.height(hh - ds);
          dd += ds;
          dh -= ds;
          changed.push(shrink.get(0));
        }
        shrink =
          (back ? shrink.prevAll : shrink.nextAll).call(
              shrink, '.hpanel:visible:first');
      }
      if (dd) {
        grow.height(grow.height() + dd);
        pdy += (back ? -1 : +1) * dd;
        changed.push(grow.get(0));
      }
      if (end) {
        // Convert sizes to percentages at the end of dragging.
        usePercentHeight(cur);
      }
      if (changed.length) {
        $(changed).trigger('panelsize');
      }
    });
  });
}

window.FontLoader = FontLoader;
window.fontloader = fontloader;

return window.pencilcode.view;

});

