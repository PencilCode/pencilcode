///////////////////////////////////////////////////////////////////////////
// VIEW SUPPORT
///////////////////////////////////////////////////////////////////////////

define([
  'jquery',
  'filetype',
  'tooltipster',
  'see',
  'melt',
  'draw-protractor',
  'ZeroClipboard',
  'FontLoader'
],
function(
  $,
  filetype,
  tooltipster,
  see,
  melt,
  drawProtractor,
  ZeroClipboard,
  FontLoader
) {

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

var meltMarkClassColors = {
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
  setPaneEditorText: setPaneEditorText,
  changePaneEditorText: function(pane, text) {
    return changeEditorText(state.pane[pane], text);
  },
  getPaneEditorText: getPaneEditorText,
  markPaneEditorLine: markPaneEditorLine,
  clearPaneEditorLine: clearPaneEditorLine,
  clearPaneEditorMarks: clearPaneEditorMarks,
  notePaneEditorCleanText: notePaneEditorCleanText,
  notePaneEditorCleanLineCount: notePaneEditorCleanLineCount,
  noteNewFilename: noteNewFilename,
  setPaneEditorReadOnly: setPaneEditorReadOnly,
  isPaneEditorDirty: isPaneEditorDirty,
  setPaneLinkText: setPaneLinkText,
  setPaneRunText: setPaneRunText,
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
  // For debugging only
  _state: state
};

$(window).on('resize.editor', function() {
  var pane;
  for (var pane in state.pane) {
    var paneState = state.pane[pane];
    if (paneState.meltEditor) {
      paneState.meltEditor.resize();
    }
  }
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
      function(n){$(this).css({backgroundColor: 'red'});})
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
  m.css({left:($(window).width() - m.outerWidth()) / 2});
  // Vertical center taking into the editor height and button height.
  m.css({top:($(window).height() -
      ($('.pane').height() + m.outerHeight()) / 2)})
}

$(window).on('resize.middlebutton', centerMiddle);

function showMiddleButton(which) {
  if (which == 'run') {
    $('#middle').find('div').eq(0).html(
      '<button id="run" title="Run program (Ctrl+Enter)">' +
      '<div class="triangle"></div></button>');
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

  opts.prompt = (opts.prompt) ? opts.prompt : 'Shared &#x2713;';
  opts.content = (opts.content) ? opts.content :
      '<div class="content">' +
        (opts.shareStageURL ?
        '<div class="field">' +
          '<a target="_blank" ' +
          'title="Posted on share.' + window.pencilcode.domain + '" href="' +
          opts.shareStageURL + '">See it here</a> <input type="text" value="' +
          opts.shareStageURL + '"><button class="copy" data-clipboard-text="' +
          opts.shareStageURL + '"><img src="/copy.png" title="Copy"></button>' +
         '</div>' : '') +
        ((opts.shareRunURL && !opts.shareStageURL) ?
        '<div class="field">' +
          '<a target="_blank" ' +
          'title="Run without showing code" href="' +
          opts.shareRunURL + '">See it here</a> <input type="text" value="' +
          opts.shareRunURL + '"><button class="copy" data-clipboard-text="' +
          opts.shareRunURL + '"><img src="/copy.png" title="Copy"></button>' +
        '</div>' : '') +
        '<div class="field">' +
          '<a target="_blank" ' +
          'title="Link showing the code" href="' +
          opts.shareEditURL + '">Share code</a> ' +
          '<input type="text" value="' +
          opts.shareEditURL + '"><button class="copy" data-clipboard-text="' +
          opts.shareEditURL + '"><img src="/copy.png" title="Copy"></button>' +
        '</div>' +
      '</div><br>' +
    '<button class="cancel">OK</button>' +
    '<button class="ok" title="Share by email">Email</button>';

  opts.init = function(dialog) {
    dialog.find('a.quiet').tooltipster();
    dialog.find('button.ok').tooltipster();
    dialog.find('button.copy').tooltipster();
    dialog.find('.field input').each(function() {
      this.scrollLeft = this.scrollWidth;
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
  var overlay = $('#overlay').show();
  if (!opts) { opts = {}; }
  overlay.html('');
  var dialogHTML =
    '<div class="dialog' + (opts.center ? ' center' : '' ) + '">' +
    '<div class="prompt">' + (opts.prompt ? opts.prompt : '') +
    '<div class="info">' + (opts.info ? opts.info : '') + '</div>' +
    (opts.content ? opts.content : '') + '</div></div>';
  var dialog = $(dialogHTML).appendTo(overlay);

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
      overlay.hide();
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
          x.val(up[attr]);
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
    if (e && ($(e.target).attr('target') == '_blank' ||
              $(e.target).attr('type') == 'checkbox' ||
              $(e.target).is('label'))) {
      // Don't validate on mousedown of a new-window hyperlink
      // Or a checkbox or checkbox label.
      return true;
    }
    if (opts.validate) {
      update(opts.validate(state()));
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

function setPaneRunText(pane, html, filename, targetUrl, fullScreenLink) {
  clearPane(pane);
  var paneState = state.pane[pane];
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
  list = state.pane[pane].links;
  if (!list) { return; }
  $('#' + pane).html('');
  directory = $('<div class="directory"></div>').appendTo('#' + pane);
  width = $('#' + pane).outerWidth() - getScrollbarWidth();
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
    maxwidth = Math.max(maxwidth, items.eq(j).outerWidth());
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
        maxwidth = Math.max(maxwidth, items.eq(j).outerWidth());
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
  if (paneState.meltEditor && paneState.meltEditor.destroy) {
    paneState.meltEditor.destroy();
  }
  if (paneState.editor) {
    paneState.editor.destroy();
  }
  paneState.meltEditor = null;
  paneState.editor = null;
  paneState.filename = null;
  paneState.cleanText = null;
  paneState.cleanLineCount = 0;
  paneState.marked = {};
  paneState.mimeType = null;
  paneState.dirtied = false;
  paneState.links = null;
  paneState.running = false;
  paneState.palette = null;
  paneState.fullScreenLink = false;
  $('#' + pane).html(loading ? '<div class="vcenter">' +
      '<div class="hcenter"><div class="loading"></div></div></div>' : '');
  $('#' + pane + 'title_text').html(''); $('#' + pane + 'title-extra').html('');
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

function uniqueId(name) {
  return name + '_' + ('' + Math.random()).substr(2);
}

function updatePaneTitle(pane) {
  var paneState = state.pane[pane];
  var label = '';
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
        symbol = '&gt;'
        alt = 'show blocks'
        tooltip = 'Click to show blocks';
        if (paneState.meltEditor.currentlyUsingBlocks) {
          label = 'blocks';
          alt = 'show code'
          symbol = '&lt;';
          tooltip = 'Click to show code';
        }
        label = '<a target="_blank" class="toggleblocks" href="/code/' +
            paneState.filename + '" title="' + tooltip +
            '"><b>' + symbol + '</b> <span alt="' + alt + '">' +
            label + '</span></a>';
      }
    }
  } else if (paneState.links) {
    label = 'directory';
  } else if (paneState.running) {
    if (paneState.fullScreenLink) {
      label = '<a target="_blank" class="fullscreen" href="/home/' +
           paneState.filename + '" title="Click to open window">' +
           '<img src="data:image/png;base64,iVBORw0KGgoAAAANS' +
           'UhEUgAAABsAAAAXCAYAAAD6FjQuAAAAAXNSR0IArs4c6QAAAARnQU1BA' +
           'ACxjwv8YQUAAAAJcEhZcwAACxEAAAsRAX9kX5EAAAAYdEVYdFNvZnR3Y' +
           'XJlAHBhaW50Lm5ldCA0LjAuMvvhp8YAAABjSURBVEhL7Y1JCgAhDAT9/' +
           '6fjpXDAKO42A9YlZOsKViEsQIRDI+PuCCjEMtotECmS5TD3iwGIaGdwp' +
           '5HRdsHLkz1ZGV5+IpuBCLGMeVrQboHIz0HVyE6AQiTL4W4KIhwXZWYRY' +
           'zBP6aySgZYAAAAASUVORK5CYII="> <span alt="open window">' +
           'screen</span></a>';
    } else {
      label = 'screen';
    }
  }
  $('#' + pane + 'title_text').html(label).find('a[title]').
      tooltipster({ position: 'top-left' });
}

$('.panetitle').on('click', '.fullscreen', function(e) {
  var pane = $(this).closest('.panetitle').prop('id').replace('title', '');
  e.preventDefault();
  fireEvent('fullscreen', [pane]);
});

$('.panetitle').on('click', '.toggleblocks', function(e) {
  var pane = $(this).closest('.panetitle').prop('id').replace('title', '');
  e.preventDefault();
  setPaneEditorBlockMode(pane, !getPaneEditorBlockMode(pane));
});

$('.pane').on('click', '.closeblocks', function(e) {
  var pane = $(this).closest('.pane').prop('id');
  e.preventDefault();
  setPaneEditorBlockMode(pane, false);
});

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
var ICE_EDITOR_PALETTE =[
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
        block: 'dot blue, 50',
        title: 'Make a dot'
      }, {
        block: 'box green, 50',
        title: 'Make a square'
      }, {
        block: 'speed 10',
        title: 'Set the speed of the turtle'
      }, {
        block: 'label \'hello\'',
        title: 'Write text at the turtle'
      }, {
        block: 'do home',
        title: 'Move the turtle back to start'
      }, {
        block: 'do cs',
        title: 'Clear screen'
      }, {
        block: 'do cg',
        title: 'Clear graphics'
      }, {
        block: 'do st',
        title: 'Show the turtle'
      }, {
        block: 'do pu',
        title: 'Lift the pen up'
      }, {
        block: 'do pd',
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
        block: 'for [1..3]\n  ``',
        title: 'Do something multiple times'
      }, {
        block: 'for x in [1..3]\n  ``',
        title: 'Do something multiple times...?'
      }, {
        block: 'while ``\n  ``',
        title: 'Repeat something while a condition is true'
      }, {
        block: 'read \'Name?\', (n) ->\n  write \'Hello\' + n',
        title: 'Read input from the user'
      }, {
        block: 'if ``\n  ``',
        title: 'Do something only if a condition is true'
      }, {
        block: 'if ``\n  ``\nelse\n  ``',
        title: 'Do something if a condition is true, otherwise something else'
      }
    ]
  }, {
    name: 'Calculate',
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
        block: 'myFunction(myArgument)',
        title: 'Use a custom function'
      }
    ]
  }, {
    name: 'Interact',
    color: 'violet',
    blocks: [
      {
        block: 'speed Infinity',
        title: 'Make the turtle move immediately'
      }, {
        block: 'play \'GEC\'',
        title: 'Play music notes'
      }, {
        block: 'wear \'/img/cat-icon\'',
        title: 'Change the turtle picture'
      }, {
        block: 'tick 1, ->\n  ``',
        title: 'Do something at equally-spaced times'
      }, {
        block: 'moveto lastclick',
        title: 'Move to a location'
      }, {
        block: 'turnto lastmousemove',
        title: 'Turn towards a location'
      }, {
        block: 'click ->\n  write \'Heh!\'',
        title: 'Do something when the turtle is clicked'
      }, {
        block: 'if pressed \'enter\'\n  write \'Holding.\'',
        title: 'Test if a key is pressed'
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

// Initializes an (ACE) editor into a pane, using the given text and the
// given filename.
// @param pane the id of a pane - alpha, bravo or charlie.
// @param text the initial text to edit.
// @param filename the filename to use.
function setPaneEditorText(pane, text, filename, useblocks) {
  clearPane(pane);
  text = normalizeCarriageReturns(text);
  var id = uniqueId('editor');
  var paneState = state.pane[pane];
  paneState.filename = filename;
  paneState.mimeType = filetype.mimeForFilename(filename);
  paneState.cleanText = text;
  paneState.dirtied = false;
  if (!mimeTypeSupportsBlocks(paneState.mimeType)) {
     useblocks = false;
  }

  $('#' + pane).html('<div id="' + id + '" class="editor"></div>');
  var meltEditor = paneState.meltEditor =
      new melt.Editor(
          document.getElementById(id),
          ICE_EDITOR_PALETTE);
  whenCodeFontLoaded(function () {
    meltEditor.setFontFamily("Source Code Pro");
    meltEditor.setFontSize(16);
  });
  meltEditor.setPaletteWidth(250);
  meltEditor.setTopNubbyStyle(0, '#1e90ff');
  meltEditor.setEditorState(useblocks);
  meltEditor.setValue(text);

  setTimeout(function() {
    $('.melt-hover-div').tooltipster();
  }, 0);
  meltEditor.on('changepalette', function() {
    $('.melt-hover-div').tooltipster();
  });

  meltEditor.on('linehover', function(ev) {
    fireEvent('icehover', [pane, ev]);
  });

  meltEditor.on('change', function() {
    fireEvent('dirty', [pane]);
    publish('update', [meltEditor.getValue()]);
    meltEditor.clearLineMarks();
    fireEvent('changelines', [pane]);
  });

  meltEditor.on('toggledone', function() {
    $('.melt-hover-div').tooltipster();
    updatePaneTitle(pane);
  });

  $('<div class="closeblocks">&times</div>').appendTo(meltEditor.paletteWrapper);


  var editor = paneState.editor = meltEditor.aceEditor;

  fixRepeatedCtrlFCommand(editor);
  updatePaneTitle(pane);
  editor.setTheme("ace/theme/chrome");
  editor.setBehavioursEnabled(false);
  editor.setHighlightActiveLine(false);
  editor.getSession().setFoldStyle('markbeginend');
  editor.getSession().setUseWrapMode(true);
  editor.getSession().setTabSize(2);
  editor.getSession().setMode(modeForMimeType(paneState.mimeType));

  var dimensions = getTextRowsAndColumns(text);
  // A big font char is 14 pixels wide and 29 pixels high.
  var big = { width: 14, height: 29 };
  // We're "long" if we bump out of the pane rectangle.
  var long = ((dimensions.rows + 2) * big.height > $('#' + pane).height() ||
              (dimensions.columns + 5) * big.width > $('#' + pane).width());
  if (long) {
    // Use a small font for long documents.
    $('#' + pane + ' .editor').css({lineHeight: '119%'});
    editor.setFontSize(16);
  } else {
    // Use a giant font for short documents.
    $('#' + pane + ' .editor').css({lineHeight: '121%'});
    editor.setFontSize(24);
  }
  setupAutofoldScriptPragmas(paneState);
  var um = editor.getSession().getUndoManager();
  um.reset();
  publish('update', [text]);
  editor.getSession().setUndoManager(um);
  var changeHandler = paneState.changeHandler = (function changeHandler() {
    if (changeHandler.suppressChange ||
        (paneState.meltEditor && paneState.meltEditor.suppressAceChangeEvent)) {
      return;
    }
    // Add an empty last line on a timer, because the editor doesn't
    // return accurate values for contents in the middle of the change event.
    setTimeout(function() { ensureEmptyLastLine(editor); }, 0);
    var session = editor.getSession();
    // Flip editor to small font size when it doesn't fit any more.
    if (editor.getFontSize() > 16) {
      var long = (session.getLength() * big.height > $('#' + pane).height());
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
        editor.setFontSize(16);
        $('#' + pane + ' .editor').css({lineHeight: '119%'});
      }
    }
    if (!paneState.dirtied) {
      fireEvent('dirty', [pane]);
    }
    // Publish the update event for hosting frame.
    publish('update', [session.getValue()]);
    // Any editing that changes the line count ends the debugging session.
    if (paneState.cleanLineCount != session.getLength()) {
      clearPaneEditorMarks(pane);
      fireEvent('changelines', [pane]);
    }
  });
  editor.getSession().on('change', changeHandler);
  if (long) {
    editor.gotoLine(0);
  } else {
    editor.gotoLine(editor.getSession().getLength(), 0);
  }
  setPrimaryFocus();
  editor.on('focus', function() {
    fireEvent('editfocus', [pane]);
  });
  var gutter = $('#' + id + ' .ace_gutter');
  gutter.on('mouseenter', '.guttermouseable', function() {
    fireEvent('entergutter', [pane, parseInt($(event.target).text())]);
  });
  gutter.on('mouseleave', '.guttermouseable', function() {
    fireEvent('leavegutter', [pane, parseInt($(event.target).text())]);
  });
  gutter.on('click', '.guttermouseable', function() {
    fireEvent('clickgutter', [pane, parseInt($(event.target).text())]);
  });
}

function mimeTypeSupportsBlocks(mimeType) {
  return /x-pencilcode|coffeescript/.test(mimeType);
}

function setPaneEditorBlockMode(pane, useblocks) {
  var paneState = state.pane[pane];
  if (!paneState.meltEditor) return false;
  useblocks = !!useblocks;
  if (paneState.meltEditor.currentlyUsingBlocks == useblocks) return false;
  if (useblocks && !mimeTypeSupportsBlocks(paneState.mimeType)) return false;
  var togglingSucceeded = paneState.meltEditor.toggleBlocks();
  if (!togglingSucceeded) return false;
  fireEvent('toggleblocks', [pane, paneState.meltEditor.currentlyUsingBlocks]);
  return true;
}

function getPaneEditorBlockMode(pane) {
  var paneState = state.pane[pane];
  if (!paneState.meltEditor) return false;
  return paneState.meltEditor.currentlyUsingBlocks;
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

function setupAutofoldScriptPragmas(paneState) {
  var editor = paneState.editor,
      session = editor.getSession(),
      foldlines = autofoldScriptPragmas(editor),
      selfmove = 0;
  if (foldlines) {
    // Don't allow the cursor to be on the same line as the fold
    function onChangeCursor() {
      if (selfmove) return;
      var curpos = editor.getCursorPosition(),
          fold = session.getFoldAt(curpos.row, curpos.column);
      if (fold && fold.placeholder == '#@script' &&
          foldlines.length > curpos.row) {
        // If the fold has text after it on the same line (a newline
        // was deleted, then insert a newline here.
        if (curpos.column > 0 &&
            session.getLine(curpos.row).length > curpos.column) {
          session.insert(curpos, '\n');
        }
        selfmove += 1;
        editor.selection.moveCursorTo(foldlines.length, 0);
        selfmove -= 1;
      }
    };
    session.on('changeFold', function(e) {
      // Don't do anything special if changeHandler is suppressed.
      if (paneState.changeHandler &&
          paneState.changeHandler.suppressChange) return;
      var value;
      if (e.action == 'remove' && e.data && e.data.placeholder == '#@script') {
        // Don't allow the fold to be deleted.
        value = editor.getValue();
        if (foldlines && value.indexOf(foldlines.join('\n')) < 0) {
          setTimeout(function() {
            if (paneState.editor === editor) {
              changeEditorText(paneState, foldlines.join('\n') +
                  ((value.indexOf('\n') != 0) ? '\n' : '') + value);
              foldlines = autofoldScriptPragmas(editor);
              onChangeCursor();
            }
          }, 0);
        } else {
          setTimeout(function() {
            foldlines = autofoldScriptPragmas(editor);
            if (foldlines) {
              editor.selection.clearSelection();
              onChangeCursor();
            }
          }, 1000);
        }
      }
    });
    editor.selection.on('changeSelection', onChangeCursor);
    editor.selection.on('changeCursor', onChangeCursor);
  }
}

function autofoldScriptPragmas(editor) {
  var session = editor.getSession(),
      lines = session.getLength(),
      curpos = editor.getCursorPosition(),
      foldlines = [], folds,
      newpos, j, line, foldrange;
  if (!lines) { return; }
  for (j = 0; j < lines; ++j) {
    line = session.getLine(j);
    if (!/^#\s*@script\b/.test(line)) {
      break;
    }
    foldlines.push(line);
  }
  // First remove all folds inside this line range.
  // (In case the autofolder has inserted some folds for a multiline comment)
  folds = session.getAllFolds();
  for (j = 0; j < folds.length; ++j) {
    if (folds[j].range.endRow < foldlines.length) {
      session.removeFold(folds[j]);
    }
  }
  // autofold only if cursor is not inside script pragmas.
  if (foldlines.length > 0 && (
      curpos.row >= foldlines.length || curpos.column == 0)) {
    foldrange = new (ace.require('ace/range').Range)(
        0, 0, foldlines.length - 1, Infinity);
    session.addFold('#@script', foldrange);
    return foldlines;
  }
  return null;
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
      paneState.editor.focus();
    }
  }
}

function setPaneEditorReadOnly(pane, ro) {
  var paneState = state.pane[pane];
  if (!paneState.editor) { return; }
  paneState.editor.setReadOnly(ro);
  $(paneState.editor.container).find('.ace_content').css({
    backgroundColor: ro ? 'gainsboro' : 'transparent'
  });
  // Only if the editor is read only do we want to blur it.
  if (ro) {
    paneState.editor.blur();
  }
}

function isPaneEditorDirty(pane) {
  var paneState = state.pane[pane];
  if (!paneState.editor) { return false; }
  if (paneState.dirtied) {
    return true;
  }
  var text = paneState.meltEditor.getValue();
  // TODO: differentiate with
  // paneState.editor.getSession().getValue();
  if (text != paneState.cleanText) {
    paneState.dirtied = true;
    return true;
  }
  return false;
}

function getPaneEditorText(pane) {
  var paneState = state.pane[pane];
  if (!paneState.editor) {
    return null;
  }
  var text = paneState.meltEditor.getValue();
  // TODO: differentiate with
  // paneState.editor.getSession().getValue();
  text = normalizeCarriageReturns(text);
  // TODO: pick the right mime type
  return {text: text, mime: paneState.mimeType };
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
    if (paneState.meltEditor.currentlyUsingBlocks) {
      paneState.meltEditor.markLine(zline, {
        color: (markclass in meltMarkClassColors ?
                meltMarkClassColors[markclass] : '#FF0'),
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
  paneState.meltEditor.unmarkLine(zline, markclass);
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
  paneState.meltEditor.clearLineMarks(markclass);
}

function notePaneEditorCleanText(pane, text) {
  text = normalizeCarriageReturns(text);
  var paneState = state.pane[pane];
  if (!paneState.editor) {
    return;
  }
  var editortext = paneState.editor.getSession().getValue();
  paneState.cleanText = text;
  if ((text == editortext) == (paneState.dirtied)) {
    paneState.dirtied = (text != editortext);
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
    paneState.editor.getSession().setMode(modeForMimeType(paneState.mimeType));
    if (!mimeTypeSupportsBlocks(paneState.mimeType)) {
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

window.FontLoader = FontLoader;
window.fontloader = fontloader;

return window.pencilcode.view;

});

