///////////////////////////////////////////////////////////////////////////
// VIEW SUPPORT
///////////////////////////////////////////////////////////////////////////

var $              = require('jquery'),
    filetype       = require('filetype'),
    tooltipster    = require('tooltipster'),
    see            = require('see'),
    droplet        = require('droplet-editor'),
    palette        = require('palette'),
    codescan       = require('codescan'),
    drawProtractor = require('draw-protractor'),
    ZeroClipboard  = require('ZeroClipboard'),
    FontLoader     = require('FontLoader');


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
  subscribers: [],
  depth: window.history.state && window.history.state.depth || 0,
  aborting: false,
  pane: {
    alpha: initialPaneState(),
    bravo: initialPaneState(),
    charlie: initialPaneState()
  }
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
  on: function(tag, cb) {
    if (state.callbacks[tag] == null){
      state.callbacks[tag] = []
    }
    state.callbacks[tag].push(cb);
 },

  // Simulate firing of an event
  fireEvent: function(event, args) { fireEvent(event, args); },

  // publish/subscribe for global events; all global events are broadcast
  // to the parent frames using postMessage() if we are iframed
  subscribe: function(callback){
    state.subscribers.push(callback);
  },
  publish: publish,

  // Sets up the text-editor in the view.
  paneid: paneid,
  panepos: panepos,
  setPaneTitle: function(pane, html) {
    $('#' + pane + 'title_text').html(html);
  },
  clearPane: clearPane,
  setPaneEditorData: setPaneEditorData,
  changePaneEditorText: function(pane, text) {
    return changeEditorText(state.pane[pane], text);
  },
  getPaneEditorData: getPaneEditorData,
  setPaneEditorBlockMode: setPaneEditorBlockMode,
  getPaneEditorBlockMode: getPaneEditorBlockMode,
  setPaneEditorBlockOptions: setPaneEditorBlockOptions,
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
  setPaneLinks: setPaneLinks,
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
  flashThumbnail: flashThumbnail,
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
  showToggleButton: function(enable) {
    $('body').toggleClass('notoggletab', !enable);
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

function hasSubscribers() {
  return state.subscribers.length > 0;
}

function publish(method, args, requestid){
  for (var j = 0; j < state.subscribers.length; ++j) {
    state.subscribers[j](method, args, requestid);
  }
}

function paneid(position) {
  return $('.' + position).find('.pane').attr('id');
}

function panepos(id) {
  return $('#' + id).closest('.panebox').attr('class').replace(/\s|panebox/g, '');
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
  if (state.callbacks[tag] == null) {
    state.callbacks[tag] = [];
  }
  state.callbacks[tag].push(cb);
}

function fireEvent(tag, args) {
  if (tag in state.callbacks) {
    var cbs = state.callbacks[tag].slice();
    //take a copy of the array in case other
    //events are fired while you're indexing it.
    for (j=0; j < cbs.length; j++) {
      var cb = cbs[j];
      if (cb) {
        cb.apply(null, args);
      }
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

$('#buttonbar,#middle').on('click', 'button,.splitmenu li', function(e) {
  // First deal with rename if it's in progress.
  if ($('#filename').is(document.activeElement)) {
    $('#filename').blur();
  }
  var id = $(e.target).attr('id') || this.id;
  if (id) {
    $(this).removeClass('pressed');
    $(this).tooltipster('hide');
    fireEvent(id, []);
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
      var submenu = '';
      if (buttonlist[j].menu) {
        submenu = ' <div class="droparrow">&#x25be;<ul>';
        for (var k = 0; k < buttonlist[j].menu.length; ++k) {
          var item = buttonlist[j].menu[k];
          var title = item.title ? ' title="' + item.title + '"' : '';
          submenu += '<li id="' + item.id + '"' + title +'>' +
                     item.label + '</li>';
        }
        submenu += '</ul></div>';
      }
      html += '<button' +
        (buttonlist[j].id ? ' id="' + buttonlist[j].id + '"' : '') +
        (buttonlist[j].menu ? ' class="splitmenu"' : '') +
        (buttonlist[j].disabled ? ' disabled' : '') +
        (buttonlist[j].title ? ' title="' + buttonlist[j].title + '"' : '') +
        '>' + buttonlist[j].label + submenu + '</button>';
    }
  }
  bar.html(html);
  bar.find('.droparrow').each(function() {
    var arrowwidth = $(this).outerWidth(),
        buttonwidth = $(this).parent().outerWidth();
    $(this).find('ul').css('left', arrowwidth - buttonwidth - 1);
  });
  bar.find('.droparrow').on('click', function(e) {
    if (e.target == this) {
      e.stopPropagation();
      e.preventDefault();
      return false;
    }
  });

  // Enable tooltipster for any new buttons.
  $('#buttonbar button').not('.splitmenu').tooltipster();
  $('#buttonbar button.splitmenu').tooltipster({position: 'left'});
  $('#buttonbar button.splitmenu li').tooltipster({position: 'left'});
}

function enableButton(id, enable) {
  if (enable) {
    var inp = $('#' + id).removeAttr('disabled');
  } else {
    var inp = $('#' + id).attr('disabled', true);
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

// Show thumbnail under the save button.
function flashThumbnail(imageDataUrl) {
  if (!imageDataUrl) { return; }
  // Destroy the original title tooltip once there is a thumbnail.
  $('#screenshot').tooltipster('destroy');
  $('#screenshot').tooltipster({
    content: $('<img src=' + imageDataUrl + ' alt="thumbnail">'),
    position: 'bottom',
    theme: 'tooltipster-shadow',
    interactive: true,
    timer: 3000
  });
  // Flash the thumbnail for 3 seconds, then disable the timer,
  // so that activation via hovering will not last for only 3 seconds.
  $('#screenshot').tooltipster('show');
  $('#screenshot').tooltipster('option', 'timer', 0);
}

///////////////////////////////////////////////////////////////////////////
// SHARE DIALOG
///////////////////////////////////////////////////////////////////////////

function showShareDialog(opts) {
  if (!opts) {
    opts = { };
  }

  // Adds a protocol ('http:') to a string path if it does not yet have one.
  function addProtocol(path) {
    if (/^\w+:/.test(path)) { return path; }
    return 'http:' + path;
  }

  var newLines = '\r\n\r\n';
  bodyText = 'Check out this program that I created on ' + window.pencilcode.domain
     + newLines;
  if (opts.shareStageURL) {
    bodyText += 'Posted program: ' + addProtocol(opts.shareStageURL) + newLines;
  }
  if (opts.shareRunURL) {
    bodyText += 'Latest program: ' + addProtocol(opts.shareRunURL) + newLines;
  }
  if (opts.shareEditURL) {
    bodyText += 'Program code: ' + addProtocol(opts.shareEditURL) + newLines;
  }

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
    //It gets the email address of the user when an email button is clicked
     dialog.find('button.ok').on('click', function() {
      var getuseremail=prompt("Please enter your e-mail address", " ");
      alert(getuseremail);
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
      : opts.nopass ? '' : '<div class="field">Password:<input ' +
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
    function focusDialog() {
      dialog.find('input:not([disabled])').eq(0).select().focus();
    }
    focusDialog();
    // This focusout handler is added so that in the #new case where the
    // dialog and ACE editor are competing for focus, the dialog wins.
    dialog.on('focusout', focusDialog);
    // Stop doing this after 0.5 seconds.
    setTimeout(function() { dialog.off('focusout'); }, 500);
  }
  opts.onkeydown = function(e, dialog, state) {
    if (e.which == 13) {
      if (dialog.find('.username').is(':focus')) {
        dialog.find('.password,.rename').eq(0).focus();
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

function setPreviewMode(shown, noanimation) {
  var change = (shown != state.previewMode);
  var delay = (noanimation || !change) ? 0 : 400;
  if (shown) {
    $('#middle').removeClass('rightedge');
    $('.right').animate({left: '50%', width: '50%'}, delay);
    $('.left').animate({width: '50%'}, delay, finished);
    $('.back').css({left: '-50%', width: '50%'});
  } else {
    $('#middle').addClass('rightedge');
    $('.right').animate({left: '100%', width: '100%'}, delay);
    $('.left').animate({width: '100%'}, delay, finished);
    $('.back').css({left: '-100%', width: '100%'});
    // clearPane(paneid('right'));
  }
  function finished() {
    if (change) {
      // Tell all editors and directory listings to resize.
      $(window).trigger('resize.editor');
      $(window).trigger('resize.listing');
    }
  }
  state.previewMode = shown;
}

function panelParts(name) {
  return '#' + name + 'panebox';
}

function rotateLeft() {
  var idb = paneid('back');
  var idl = paneid('left');
  var idr = paneid('right');
  $('.back').finish().css({left:'100%'});
  $('.left').finish().animate({left: '-50%'});
  $('.right').finish().animate({left: 0});
  $('.back').animate({left: '50%'}, function() {
    // Pin this div - chrome can sometimes scroll it even with overflow:hidden
    $('#overflow').scrollLeft(0);
  });
  $(panelParts(idb)).removeClass('back').addClass('right');
  $(panelParts(idr)).removeClass('right').addClass('left');
  $(panelParts(idl)).removeClass('left').addClass('back');
  setPrimaryFocus();
}

function rotateRight() {
  var idb = paneid('back');
  var idl = paneid('left');
  var idr = paneid('right');
  $('.back').finish().css({left:'-50%'});
  $('.right').finish().animate({left: '100%'});
  $('.left').finish().animate({left: '50%'});
  $('.back').animate({left: 0}, function() {
    // Pin this div - chrome can sometimes scroll it even with overflow:hidden
    $('#overflow').scrollLeft(0);
  });
  $(panelParts(idb)).removeClass('back').addClass('left');
  $(panelParts(idr)).removeClass('right').addClass('back');
  $(panelParts(idl)).removeClass('left').addClass('right');
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
      iframe.attr('src', 'about:blank');
      iframe.attr('id', 'output-frame');
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
    if (typeof(arg) == 'object') {
      if (arg.hasOwnProperty('timeStamp') && arg.hasOwnProperty('type')) {
        onerepr = arg.type ? arg.type + '-event' : 'event';
      } else if (arg.jquery) {
        if ('function' == typeof arg.hasClass && arg.hasClass('turtle')) {
          onerepr = 'turtle-object';
        } else {
          onerepr = 'jquery-object';
        }
      }
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
    if (onerepr.length > 50) {
      onerepr = onerepr.substr(0, 47) + '...'
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

function setPaneLinkText(pane, links, filename, ownername) {
  clearPane(pane);
  var paneState = state.pane[pane];
  paneState.path = ownername + '/' + filename;
  paneState.filename = filename;
  setPaneLinks(pane, links);
  updatePaneTitle(pane);
  setVisibilityOfSearchTextField(pane);
}

function setPaneLinks(pane, links) {
  var paneState = state.pane[pane];
  paneState.links = links;
  updatePaneLinks(pane);
  setVisibilityOfSearchTextField(pane);
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
      tightwidth, item, figure, thumbnail, directory, colsdone, list;
  var paneState = state.pane[pane];
  function fwidth(elem) {
    // Get the width, including fractional width.
    if (elem.getBoundingClientRect) {
      return elem.getBoundingClientRect().width;
    }
    return $(elem).outerWidth();
  }
  list = paneState.links;
  if (!list) { return; }
  
  $('#' + pane).html('');
  directory = $('<div class="directory"></div>').appendTo('#' + pane);

  // width is full directory width minus padding minus scrollbar width.
  width = Math.floor(directory.width() - getScrollbarWidth());
  col = $('<div class="column"></div>').appendTo(directory);
  for (j = 0; j < list.length; j++) {
    item = $('<a/>', {
      class: 'item' + (list[j].href ? '' : ' create'),
      href: list[j].href
    }).appendTo(col);
    figure = $('<div/>').appendTo(item);
    thumbnail = list[j].thumbnail;
    // Only show thumbs if it is a supported type, and showThumb is enabled.
    if (shouldShowThumb(paneState.path)) {
      $('<img/>', {
        class: 'thumbnail',
        src: thumbnail || getDefaultThumbnail(list[j].type),
        alt: list[j].name
      }).appendTo(figure);
      $('<span/>', { text: list[j].name, class: 'caption' }).appendTo(figure);
    } else {
      $('<span/>', { text: list[j].name }).appendTo(figure);
    }
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
  
  setVisibilityOfSearchTextField(pane);
}

(function($) {
    $.fn.hasScrollBar = function() {
        return this.get(0) ? this.get(0).scrollHeight > this.innerHeight() : false;
    }
})(jQuery);

function setVisibilityOfSearchTextField(pane) {
  var directory = $('#'+pane).find('.directory');
  var panetitle = directory.parent().parent().find('.panetitle');
  
  if(directory.hasScrollBar()) {
    if(panetitle.find('.search-file').length == 0) {
      //Adding the search text field
      panetitle.find('.thick-bar').after('<div class="search-file"><input type="text" class="search-toggle" placeholder="Filter"><span class="fa fa-search"></span></div>');
    }
  } else if(panetitle.find('.search-file') && !panetitle.find('.search-toggle').val()) {
    //Remove the search text field
    panetitle.find('.search-file').remove();
  }
  
  if(panetitle.find('.search-file').length != 0) {
    //Make the directory a searchable-directory 
    directory.addClass('directory-searchable');
  } else {
    //Make the directory a non searchable-directory 
    directory.removeClass('directory-searchable');
  }
}

function getDefaultThumbnail(type) {
  var baseUrl = '//' + pencilcode.domain + '/image/';
  var mimeToFilename = {
    'dir'               : 'dir-128.png',
    'new'               : 'new-128.png',
    'image/jpeg'        : 'file-image.png',
    'image/gif'         : 'file-image.png',
    'image/png'         : 'file-image.png',
    'image/svg+xml'     : 'file-image.png',
    'image/x-ms-bmp'    : 'file-image.png',
    'image/x-icon'      : 'file-image.png',
    'text/html'         : 'file-html.png',
    'text/plain'        : 'file-txt.png',
    'text/csv'          : 'file-txt.png',
    'text/css'          : 'file-css.png',
    'text/coffeescript' : 'file-coffee.png',
    'text/javascript'   : 'file-js.png',
    'text/x-python'     : 'file-image.png',
    'text/xml'          : 'file-xml.png',
    'text/json'         : 'file-json.png',
    'text/x-pencilcode' : 'file-pencil.png'
  }
  return baseUrl + (mimeToFilename[type] || 'file-generic.png');
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
  paneState.selfname = null;
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
    'text/x-python': 'python',
    'text/plain': 'text',
    'text/csv': 'text',
    'image/svg+xml': 'xml',
    'text/xml': 'xml'
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
    'text/x-python': 'python',
    'text/html': 'html',
  }[mimeType];
  if (!result) {
    result = 'coffee';
  }
  return result;
}

function paletteForPane(paneState, selfname) {
  var mimeType = editorMimeType(paneState).replace(/;.*$/, ''),
      basePalette = paneState.palette;
  if (!basePalette) {
    if (mimeType == 'text/x-pencilcode' || mimeType == 'text/coffeescript') {
      basePalette = palette.COFFEESCRIPT_PALETTE;
    }
    if (mimeType == 'text/javascript' ||
        mimeType == 'application/x-javascript') {
      basePalette = palette.JAVASCRIPT_PALETTE;
    }
    if (/x-python/.test(mimeType)) {
        basePalette = palette.PYTHON_PALETTE;
    }

    if (mimeType.replace(/;.*$/, '') == 'text/html') {
      basePalette = palette.HTML_PALETTE;
    }
  }
  if (basePalette) {
    return palette.expand(basePalette, paneState.selfname);
  }
  return [];
}

function dropletOptionsForMimeType(mimeType) {
  if (/x-python/.test(mimeType)) {
    return {
      functions: palette.PYTHON_FUNCTIONS//,
//      categories: palette.PYTHON_CATEGORIES
    };
  }
  if (mimeType.match(/^text\/html\b/)) {
    return {
      tags: palette.KNOWN_HTML_TAGS
    };
  }
  return {
    functions: palette.KNOWN_FUNCTIONS,
    categories: palette.CATEGORIES,
    zeroParamFunctions: true
  };
}

function uniqueId(name) {
  return name + '_' + ('' + Math.random()).substr(2);
}

function updatePaneTitle(pane) {
  var paneState = state.pane[pane];
  var label = '';
  var textonly = true;
  if (paneState.editor) {
    if (/^text\/plain/.test(paneState.mimeType)) {
      label = 'text';
    } else if (/^text\/xml/.test(paneState.mimeType) ||
        /^application\/json/.test(paneState.mimeType)) {
      label = 'data';
    } else {
      label = 'code';
      if (/^text\/html/.test(paneState.mimeType)) {
        label = 'html'
      }
      if (mimeTypeSupportsBlocks(paneState.mimeType)) {
        textonly = false;
        symbol = 'codeicon'
        alt = 'show blocks'
        if (paneState.dropletEditor.currentlyUsingBlocks) {
          label = 'blocks';
          alt = 'show code'
          symbol = 'blockicon';
        }
        label = '<a target="_blank" class="toggleblocks" href="/code/' +
            paneState.filename + '"><span class="' + symbol +
            '"></span> <span alt="' + alt + '">' +
            '<span>' + label + '</span></span></a>';
      }
      if (/pencilcode/.test(paneState.mimeType)) {
        var visibleMimeType = editorMimeType(paneState);
        // Show the Javascript watermark if the language is JS.
        var showjs = (/javascript/.test(visibleMimeType));
        $('#' + pane + ' .editor').eq(0).toggleClass('jsmark', showjs);
        label = '<div class="langmenu pull-right" title="Languages">' +
                '<nobr>&nbsp;<div class="gear">' +
                '&nbsp;</div></div>'
              + label;
      }
    }
  } else if (paneState.links) {
    if (paneState.path === '/') {
      label = 'directory';
    } else {
      var icon = shouldShowThumb(paneState.path)?
              '<i class="fa fa-th-large"></i>' :
              '<i class="fa fa-align-left"></i>';
      label = '<div class="thumb-toggle pull-right" title="Toggle thumbnails">'
            + icon + '</div>directory';
    }
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
  
  label='<div class="thick-bar">' + label + '</div>';
  
  $('#' + pane + 'title_text').html(label);
  $('#' + pane).toggleClass('textonly', textonly);
  
  setVisibilityOfSearchTextField(pane);
}

function getShowThumb() {
  var showThumb;
  try {
    // `JSON.parse` might throw SyntaxError if undefined or malformed.
    showThumb = JSON.parse(window.localStorage.showThumb);
    // Prevent error when `window.localStorage.showThumb` is malformed.
    if (typeof showThumb !== 'object') {
      throw 'Malformed data.';
    }
  } catch (e) {
    // When encounters errors just initialize `showThumb` to empty object.
    showThumb = {};
  }
  return showThumb;
}

function setShowThumb(showThumb) {
  try {
    window.localStorage.setItem('showThumb', JSON.stringify(showThumb));
  } catch (e) {
    console.log('Set showThumb failed. Error: ' + e);
  }
}

function shouldShowThumb(path) {
  var layers = path.match(/[^\/]+/g);
  if (!layers) { // Disable on user listing.
    return false;
  } else {
    var showThumb = getShowThumb();

    var show = true;
    for (var i = 0; i < layers.length; i++) {
      // If no setting just show thumbnails by default.
      // This loop will set show to the closest parent's setting.
      if (showThumb[layers[i]] === undefined) {
        return show;
      } else if (showThumb[layers[i]]['.show']) {
        show = true;
      } else {
        show = false;
      }
      // cd into the subfolder and continue the loop.
      showThumb = showThumb[layers[i]];
    };
    return show;
  }
}

function setShouldShowThumb(path, shouldShow) {
  var layers = path.match(/[^\/]+/g);
  if (!layers) { // Do not allow setting on user listing.
    return;
  } else {
    var showThumb = getShowThumb();

    var current = showThumb;
    for (var i = 0; i < layers.length; i++) {
      if (current[layers[i]] === undefined) {
        current[layers[i]] = {};
        // Use a '.show' attribute to indicate the setting for the current
        // directory because it is an illegal filename, so it will not
        // conflict with the name of the any subfolders if there exist.
        current[layers[i]]['.show'] = true;
      }
      // cd into the subfolders and continue the loop.
      current = current[layers[i]];
    }
    // Finally, set the setting for current directory.
    current['.show'] = shouldShow;
    // Write `showThumb` back into localStorage, not `current`.
    setShowThumb(showThumb);
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

$('.panetitle').on('click', '.thumb-toggle', function(e) {
  var pane = $(this).closest('.panetitle').prop('id').replace('title', '');
  var path = state.pane[pane].path;
  var showThumb = shouldShowThumb(path);
  e.preventDefault();
  setShouldShowThumb(path, !showThumb);
  updatePaneLinks(pane);
  updatePaneTitle(pane);
});

$('.panetitle').on('keyup', '.search-toggle', function(e) {
  var pane = $(this).closest('.panetitle').prop('id').replace('title', '');
  var search = $(this).closest('.panetitle').find('.search-toggle').val();
  e.preventDefault();
  fireEvent('search',[pane,search,function() {
      //TODO after search events
  }]);
});

$('.pane').on('mousedown', '.blockmenu', function(e) {
  // Do nothing if menu already showing.
  if ($(this).find('.blockmenupopup').length) return;
  var pane = $(this).closest('.pane').prop('id');
  var paneState = state.pane[pane];
  var data = getPaneEditorData(pane);
  var overlay = $('<div style="position:fixed;top:0;right:0;left:0;bottom:0">');
  overlay.appendTo(this);
  var popup = $('<div class="blockmenupopup">');
  var objs = codescan.scanObjects(getPaneEditorLanguage(pane), data.data);
  for (var j = 0; j < objs.length; ++j) {
    popup.append('<div class="blockmenuitem" ' +
        (paneState.selfname == objs[j].name ? 'checked ' : '') +
        'data-item="' + j + '">' +
        '<img src="/image/turtleicon.png"> ' + objs[j].label + '</div>');
  }
  popup.append('<div class="blockmenuitem" ' +
      (!paneState.selfname ? 'checked ' : '') + 'data-item="turtle">' +
      'Use default blocks</div>');
  popup.append('<div class="blockmenuitem" data-item="textcode">' +
           'Show text code</div>');
  popup.appendTo(this);

  var moved = false;
  var menu = this;
  menu.setCapture && menu.setCapture(false);
  $(window).on('mouseup mouseenter mouseleave', capturer);
  function capturer(e) {
    if (e.type == 'mouseleave') { moved = true; return; }
    var item = $(e.target).closest('.blockmenuitem');
    if (item.length) { moved = true; }
    if (moved && e.type == 'mouseup') {
      popup.remove();
      overlay.remove();
      $(window).off('mouseup mouseenter mouseleave', capturer);
    }
    moved = true;
    if (item.length && e.type == 'mouseup') {
      trigger(item.data('item'));
    }
  }
  // Switch palette.
  function trigger(item) {
    if (item == 'textcode') {
      setPaneEditorBlockMode(pane, false);
    } else {
      selfname = '';
      if (/^\d+$/.test(item)) {
        selfname = objs[Number(item)].name;
      }
      if (!paneState.dropletEditor) return;
      paneState.selfname = selfname;
      paneState.dropletEditor.setPalette(paletteForPane(paneState));
    }
  }
});

$('.pane').on('click', '.texttoggle', function(e) {
  var pane = $(this).closest('.pane').prop('id');
  e.preventDefault();
  setPaneEditorBlockMode(pane, false, $(this).attr('droplet-editor'));
});

$('.pane').on('click', '.blocktoggle', function(e) {
  var pane = $(this).closest('.pane').prop('id');
  e.preventDefault();
  setPaneEditorBlockMode(pane, true,$(this).attr('droplet-editor'));
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
  var p5js = findLibrary(meta, 'p5js');
  var hasBits = turtlebits != null;
  var hasTurtle = turtlebits && (!turtlebits.attrs ||
      turtlebits.attrs.turtle == null ||
      turtlebits.attrs.turtle != 'false');
  var hasP5js = p5js != null;

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
      '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label title="Start with a turtle">' +
      '<input type="checkbox" class="turtle"> Main Turtle</label><br>' +
      '<label title="p5.js from The Processing Foundation">' +
      '<input type="checkbox" class="p5js"> Processing p5.js</label><br>' +
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
    if (hasP5js) {
      dialog.find('.p5js').prop('checked', true);
    }
  }

  opts.retrieveState = function(dialog) {
    return {
      lang: dialog.find('[name=lang]:checked').val(),
      html: dialog.find('.html').prop('checked'),
      css: dialog.find('.css').prop('checked'),
      turtle: dialog.find('.turtle').prop('checked'),
      bits: dialog.find('.bits').prop('checked'),
      p5js: dialog.find('.p5js').prop('checked')
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
    if (state.p5js != hasP5js) {
      var lib = { name: 'p5js', src: '//{site}/lib/p5.js' };
      if (!paneState.meta) { paneState.meta = {}; }
      toggleLibrary(paneState.meta, lib, state.p5js);
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
          {name: 'coffeescript', src: '//{site}/lib/coffee-script.js'},
          wantCoffeeScript);
    }
    var box = $('#' + pane + ' .hpanelbox');
    var layoutchange = false;
    if (box.length) {
      if (state.html != hasHtml) {
        if (state.html) {
          setupDropletSubEditor(box, pane, paneState, '', 'html', null, true);
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

function editorMimeType(paneState) {
  if (!paneState.mimeType) {
    return;
  }
  if (/pencilcode/.test(paneState.mimeType)) {
    return filetype.effectiveMeta(paneState.meta).type;
  }
  return paneState.mimeType;
}

function editorHasAnyErrors(editor) {
  if (!editor || editor.currentlyUsingBlocks) return false;
  if (editor.aceEditor) { editor = editor.aceEditor; }
  var annot = editor.getSession().getAnnotations();
  for (var j = 0; j < annot.length; ++j) {
    if (annot[j].type == 'error')
      return true;
  }
  return false;
}

function sizeHtmlCssPanels(pane) {
  var box = $('#' + pane).find('.hpanelbox');
  var paneState = state.pane[pane];
  var meta = paneState.meta;
  var multipane = /pencil/.test(paneState.mimeType);
  var addhtml = multipane && meta && meta.hasOwnProperty('html');
  var addcss = multipane && meta && meta.hasOwnProperty('css');
  box.find('.htmlmark').css('display', addhtml ? 'block' : 'none');
  box.find('.cssmark').css('display', addcss ? 'block' : 'none');
  setupHpanelBox(box);
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
  var box = $('#' + pane).html(layout.join(''));
  sizeHtmlCssPanels(pane);

  // Set up the main editor.
  var dropletMode = dropletModeForMimeType(visibleMimeType);
  var dropletEditor = paneState.dropletEditor =
      new droplet.Editor(
          document.getElementById(id),
          {
            mode: dropletMode,
            palette: paletteForPane(paneState),
            modeOptions: dropletOptionsForMimeType(visibleMimeType)
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

  dropletEditor.on('changepalette', function() {
    $('.droplet-hover-div').tooltipster({position: 'right', interactive: true});
  });

  dropletEditor.on('selectpalette', function(p) {
    fireEvent('selectpalette', [pane, p]);
  });
  dropletEditor.on('pickblock', function(p) {
    fireEvent('pickblock', [pane, p]);
  });

  dropletEditor.on('linehover', function(ev) {
    fireEvent('icehover', [pane, ev]);
  });

  paneState.lastChangeTime = +(new Date);

  dropletEditor.on('change', function() {
    if (paneState.settingUp) return;
    paneState.lastChangeTime = +(new Date);
    fireEvent('dirty', [pane]);
    if (hasSubscribers()) publish('update', [dropletEditor.getValue()]);
    dropletEditor.clearLineMarks();
    fireEvent('changelines', [pane]);
    fireEvent('delta', [pane]);
  });

  dropletEditor.on('toggledone', function() {
    if (!$('.droplet-hover-div').hasClass('tooltipstered')) {
      $('.droplet-hover-div').tooltipster();
    }
    updatePaneTitle(pane);
  });

  if (!/^frame\./.test(window.location.hostname)) {
    $('<div class="blockmenu">Blocks' +
      '<span class="blockmenuarrow">&#9660;</span></div>').appendTo(
        dropletEditor.paletteWrapper);
  }

  $('<div class="texttoggle" droplet-editor="dropletEditor">' +
    '<div class="slide"><div class="info"></div></div></div>').appendTo(
      dropletEditor.paletteWrapper);
  $('<div class="blocktoggle" droplet-editor="dropletEditor">' +
    '<div class="slide"><div class="info"></div></div></div>').appendTo(
      $(dropletEditor.wrapperElement).find('.ace_editor'));

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
    fireEvent('delta', [pane]);
  });

  um.reset();
  publish('update', [text]);
  editor.getSession().setUndoManager(um);

  var gutter = mainContainer.find('.ace_gutter');
  gutter.on('mouseenter', '.guttermouseable', function(event) {
    fireEvent('entergutter', [pane, parseInt($(event.target).text())]);
  });
  gutter.on('mouseleave', '.guttermouseable', function(event) {
    fireEvent('leavegutter', [pane, parseInt($(event.target).text())]);
  });
  gutter.on('click', '.guttermouseable', function(event) {
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
    fireEvent('delta', [pane]);
  }
  function checkForHtmlCssChange() {
    htmlCssChangeTimer = null;
    if (editorHasAnyErrors(paneState.htmlEditor) ||
        editorHasAnyErrors(paneState.cssEditor)) {
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

  if (box.find('.htmlmark').is(':visible')) {
    setupDropletSubEditor(box, pane, paneState, meta.html, 'html', null, useblocks);
  }

  if (box.find('.cssmark').is(':visible')) {
    setupSubEditor(box, pane, paneState, meta.css, 'css');
  }

  paneState.settingUp = null;
  updatePaneTitle(pane);

  // Work around undesired scrolling bug -
  // repro: turn off split pane view, and linger over a file to force preload.
  $('#overflow').scrollLeft(0);
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

function setupDropletSubEditor(box, pane, paneState, text, htmlorcss, tearDown, useblocks) {
  var id = uniqueId(htmlorcss + 'edit');
  box.find('.' + htmlorcss + 'mark').html(
     '<div id="' + id + '" class="editor"></div>').css('display', 'block');
  var container = $('#' + id);
  var editor = paneState[htmlorcss + 'Editor'] =
      new droplet.Editor(
          document.getElementById(id),
          {
            mode: htmlorcss,
            palette: htmlorcss == 'html' ? palette.HTML_PALETTE : palette.CSS_PALETTE,
            modeOptions: dropletOptionsForMimeType('text/' + htmlorcss)
          });
  editor.setPaletteWidth(250);
  if (!/^frame\./.test(window.location.hostname)) {
    // Blue nubby when inside pencilcode.
    editor.setTopNubbyStyle(0, '#1e90ff');
  } else {
    // Gray nubby when framed.
    editor.setTopNubbyStyle(0, '#dddddd');
  }
  editor.setEditorState(useblocks);
  editor.setValue(text);

  editor.on('changepalette', function() {
    $('.droplet-hover-div').tooltipster({position: 'right', interactive: true});
  });

  editor.on('selectpalette', function(p) {
    fireEvent('selectpalette', [pane, p]);
  });

  editor.on('pickblock', function(p) {
    fireEvent('pickblock', [pane, p]);
  });

  editor.on('toggledone', function() {
    $('.droplet-hover-div').tooltipster({position: 'right', interactive: true});
  });

  setupResizeHandler(container.parent(), editor);

  $('<div class="texttoggle" droplet-editor="' + htmlorcss + 'Editor">' +
    '<div class="slide"><div class="info"></div></div></div>').appendTo(
      editor.paletteWrapper);
  $('<div class="blocktoggle" droplet-editor="' + htmlorcss + 'Editor">' +
    '<div class="slide"><div class="info"></div></div></div>').appendTo(
      $(editor.wrapperElement).find('.ace_editor'));

  aceEditor = editor.aceEditor;
  aceEditor.on('change', paneState.handleHtmlCssChange);
  setupAceEditor(pane, container, aceEditor, "ace/mode/" + htmlorcss, text);
}

function tearDownSubEditor(box, pane, paneState, htmlorcss) {
  if (paneState[htmlorcss + 'Editor']) {
    if (paneState[htmlorcss + 'Editor'].destroy)
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
  $(elt).find('.ace_editor').on('mouseup', function(e) {
    if ($(e.target).closest('.ace_search').length) {
      return;
    }
    if (!editor.isFocused() || !document.hasFocus()) {
      // On IE, if you click outside the window and click back,
      // you can be in a state where the editor can't focus itself.
      // The solution is to focus a different element, then focus
      // the editor after a short delay.
      $('body').focus();
      setTimeout(function() { editor.focus(); }, 0);
    }
  });

  var lineArr = text.split('\n');
  var lines = lineArr.length;
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
    if (/^text\/html|^image\/svg/.test(paneState.mimeType)) {
      handleHtmlChange();
    }
    // Publish the update event for hosting frame.
    if (hasSubscribers()) publish('update', [session.getValue()]);
  });
  $(elt).data('changeHandler', changeHandler);
  editor.getSession().on('change', changeHandler);
  // Fold any blocks with a line that ends with "# fold" or "// fold"
  function autoFold() {
    editor.getSession().off('tokenizerUpdate', autoFold);
    var foldMarker = /(?:#|\/\/)\s*fold$/;
    for (var i = 0, line; (line = lineArr[i]) !== undefined; i++) {
      var match = foldMarker.exec(line);
      if (match) {
        var data = editor.getSession().getParentFoldRangeData(i + 1);
        if (data && data.range && data.range.start && data.range.end) {
          editor.getSession().foldAll(data.range.start.row, data.range.end.row);
        } else if (match.index == 0) {
          // If the # fold is not in a block and is at the 0th column,
          // then use it as an indicator to fold all the blocks in the file.
          editor.getSession().foldAll(0, lineArr.length);
          return;
        }
      }
    }
  }
  editor.getSession().on('tokenizerUpdate', autoFold);
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
  // Fix focus bug after focus is stolen by a peer frame.
  // For example, activity.pencilcode.net/edit/frog/README.html:
  // after running it, a subframe of the RHS grabs focus and then
  // it becomes impossible to focus the ace editor by clicking on
  // it, without blurring it first.
  editor.on('click', function() {
    if (!editor.isFocused() && !editor.getReadOnly()) {
      editor.blur();
      editor.focus();
    }
  });
  // Also special-case html change handling.
  var htmlChangeTimer = null;
  var htmlChangeRetryCounter = 10;
  function handleHtmlChange() {
    htmlRetryCounter = 10;
    if (htmlChangeTimer) {
      clearTimeout(htmlChangeTimer);
    }
    htmlChangeTimer = setTimeout(checkForHtmlChange, 500);
  }
  function checkForHtmlChange() {
    htmlChangeTimer = null;
    if (!/^text\/html|^image\/svg/.test(paneState.mimeType)) {
      return;
    }
    if (editorHasAnyErrors(paneState.editor)) {
      if (htmlRetryCounter > 0) {
        htmlRetryCounter -= 1;
        htmlChangeTimer = setTimeout(checkForHtmlChange, 1000);
      }
      return;
    }
    paneState.lastChangeTime = +(new Date);
    fireEvent('changehtmlcss', [pane]);
  }
}

function mimeTypeSupportsBlocks(mimeType) {
  return /x-pencilcode|coffeescript|javascript|x-python|html/.test(mimeType);
}

function setPaneEditorLanguageType(pane, type) {
  var paneState = state.pane[pane];
  if (!paneState.dropletEditor) return false;
  var visibleMimeType = editorMimeType(paneState);
  if (type == visibleMimeType) return false;
  paneState.dropletEditor.setMode(
      dropletModeForMimeType(type),
      dropletOptionsForMimeType(type));
  paneState.editor.getSession().setMode(modeForMimeType(type));
  paneState.meta = filetype.effectiveMeta(paneState.meta);
  paneState.meta.type = type;
  paneState.dropletEditor.setPalette(paletteForPane(paneState));
  updatePaneTitle(pane);
  return true;
}

function setPaneEditorBlockOptions(pane, pal, modeOptions) {
  var paneState = state.pane[pane];
  if (!paneState.dropletEditor) return;
  if (modeOptions) {
    var visibleMimeType = editorMimeType(paneState);
    paneState.dropletEditor.setMode(
        dropletModeForMimeType(visibleMimeType), modeOptions);
  }
  if (pal) {
    paneState.palette = pal;
    paneState.dropletEditor.setPalette(paletteForPane(paneState));
  }
}

function setPaneEditorBlockMode(pane, useblocks, editor) {
  function setMainEditorBlockMode(editor, useblocks) {
    if (editor.currentlyUsingBlocks == useblocks) return false;
    var visibleMimeType = editorMimeType(paneState);
    if (useblocks && !mimeTypeSupportsBlocks(visibleMimeType)) return false;
    var togglingSucceeded = editor.toggleBlocks();
    if (!togglingSucceeded) return false;
    fireEvent('toggleblocks', [pane, editor.currentlyUsingBlocks]);
    return true;
  }
  function setSubEditorBlockMode(editor, useblocks) {
    if (!editor) return false;
    if (editor.currentlyUsingBlocks == useblocks) return false;
    return editor.toggleBlocks();
  }
  var paneState = state.pane[pane];
  if (!paneState.dropletEditor) return false;
  useblocks = !!useblocks;
  if (editor) {
    if (editor == "dropletEditor") {
      return setMainEditorBlockMode(paneState.dropletEditor, useblocks);
    }
    return setSubEditorBlockMode(paneState[editor], useblocks);
  }
  var result = setMainEditorBlockMode(paneState.dropletEditor, useblocks);
  setSubEditorBlockMode(paneState.htmlEditor, useblocks);
  setSubEditorBlockMode(paneState.cssEditor, useblocks);
  return result;
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
  if (paneState.dropletEditor) {
    paneState.dropletEditor.setReadOnly(ro);
  }
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
    paneState.dropletEditor.setMode(
        dropletModeForMimeType(visibleMimeType),
        dropletOptionsForMimeType(visibleMimeType));
    paneState.dropletEditor.setPalette(paletteForPane(paneState));
    paneState.editor.getSession().setMode(modeForMimeType(visibleMimeType));
    if (!mimeTypeSupportsBlocks(visibleMimeType)) {
      setPaneEditorBlockMode(pane, false);
    }
    sizeHtmlCssPanels(pane);
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
    box.off('distribute.hpb');
    box.on('distribute.hpb', distribute);
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
  hpb.off('mousedown.hpb');
  hpb.on('mousedown.hpb', '.hpanel:visible', function(e) {
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

module.exports = window.pencilcode.view;
