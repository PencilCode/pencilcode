///////////////////////////////////////////////////////////////////////////
// VIEW SUPPORT
///////////////////////////////////////////////////////////////////////////

define(['jquery', 'tooltipster', 'see', 'draw-protractor', 'ZeroClipboard'],
function($, tooltipster, see, drawProtractor, ZeroClipboard) {

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

//
// Zeroclipboard seems very flakey.  The documentation says
// that this configuration should not be necessary but it seems to be
//

ZeroClipboard.config({
   moviePath : '/lib/zeroclipboard/ZeroClipboard.swf',
   allowScriptAccess : 'always'
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
  setPaneTitle: function(pane, html) { $('#' + pane + 'title').html(html); },
  clearPane: clearPane,
  setPaneEditorText: setPaneEditorText,
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
  parseTemplateWrapper: parseTemplateWrapper
};

function publish(method, args){
  if (state.subscriber) { state.subscriber(method, args); }
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
  // if (window.console) {
  //   window.console.log('fired', tag, args);
  // }
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

$('#filename').on('blur', function() {
  var sel = $('#filename');
  var enteredtext = sel.text();
  var fixedtext = enteredtext.replace(/\s|\xa0|[^\w\/.-]/g, '')
      .replace(/^\/[*]/, '').replace(/\/\/+/g, '/');
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
    filename = 'http://' + window.pencilcode.domain + '/edit/';
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

  bodyText = 'Check out this program that I created on http://pencilcode.net!\r\n\r\n';
  bodyText = bodyText + 'Running program: ' + opts.shareRunURL + '\r\n\r\n';
  bodyText = bodyText + 'Program code: ' + opts.shareEditURL + '\r\n\r\n';
  if (opts.shareClipURL)
    bodyText = bodyText + 'Shortened URL: ' + opts.shareClipURL + '\r\n\r\n';

  subjectText = 'Pencilcode program: ' + opts.title;

  // Need to escape the text since it will go into a url link
  bodyText = escape(bodyText);
  subjectText = escape(subjectText);

  opts.prompt = (opts.prompt) ? opts.prompt : 'Share';
  opts.content = (opts.content) ? opts.content :
      '<div class="content">' +
       (opts.shareActivityURL ?
        '<div class="field">' +
          '<a target="_blank" class="quiet" ' +
          'title="Link to student activity file" href="' +
          opts.shareActivityURL + '">New Activity</a> <input type="text" value="' +
          opts.shareActivityURL + '"><button class="copy" data-clipboard-text="' +
          opts.shareActivityURL + '"><img src="/copy.png" title="Copy"></button>' +
        '</div>' : '') +
        (opts.shareRunURL ?
        '<div class="field">' +
          '<a target="_blank" class="quiet" ' +
          'title="Run without showing code" href="' +
          opts.shareRunURL + '">Full Screen</a> <input type="text" value="' +
          opts.shareRunURL + '"><button class="copy" data-clipboard-text="' +
          opts.shareRunURL + '"><img src="/copy.png" title="Copy"></button>' +
        '</div>' : '') +
        '<div class="field">' +
          '<a target="_blank" class="quiet" ' +
          'title="Link showing the code" href="' +
          opts.shareEditURL + '">Code</a> <input type="text" value="' +
          opts.shareEditURL + '"><button class="copy" data-clipboard-text="' +
          opts.shareEditURL + '"><img src="/copy.png" title="Copy"></button>' +
        '</div>' +
        (opts.shareClipURL ?
        '<div class="field">' +
          '<a target="_blank" class="quiet" ' +
          'title="Copy this code snippet" href="' +
          opts.shareClipURL + '">Copy</a> <input type="text" value="' +
          opts.shareClipURL + '"><button class="copy" data-clipboard-text="' +
          opts.shareClipURL + '"><img src="/copy.png" title="Copy"></button>' +
         '</div>' : '') +
      '</div><br>' +
    '<button class="ok" title="Share by email">Email</button>' +
    '<button class="cancel">Cancel</button>';

  opts.init = function(dialog) {
    dialog.find('a.quiet').tooltipster();
    dialog.find('button.ok').tooltipster();
    dialog.find('button.copy').tooltipster();
    dialog.find('.field input').each(function() {
      this.scrollLeft = this.scrollWidth;
    });
    var clipboardClient = new ZeroClipboard(dialog.find('button.copy'));
    var tooltipTimer = null;
    clipboardClient.on('complete', function(client, args) {
      var button = this;
      // Hide any other copy tooltips in this dialog.
      dialog.find('button.copy').not(button).tooltipster('hide');
      // Just flash tooltipster for a couple seconds, because mouseleave
      // doesn't appear to work.
      $(button).tooltipster('content', 'Copied!').tooltipster('show');
      // Select the text in the copied field.
      $(button).closest('.field').find('input').select();
      clearTimeout(tooltipTimer);
      tooltipTimer = setTimeout(function() {
        $(button).tooltipster('hide');
      }, 1500);
    });
    dialog.find('button.ok').focus();
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
  var dialog = $('<div class="dialog"><div class="prompt">' +
    (opts.prompt ? opts.prompt : '') +
    '<div class="info">' +
    (opts.info ? opts.info : '') +
    '</div>' +
    (opts.content ? opts.content : '') +
    '</div></div>').appendTo(overlay);

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

    dialog.find('input:not([disabled])').eq(0).focus();
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

// TODO Move next few functions related to wrapping into another file so
// they're more accessible outside of this file.
function wrapTurtle(text) {
  return (
'<!doctype html>\n<html>\n<head>\n<script src="http://' +
window.pencilcode.domain + '/turtlebits.js"><\057script>\n' +
'</head>\n<body><script type="text/coffeescript">\neval $.turtle()\n\n' +
text + '\n<\057script></body></html>');
}

function parseTemplateWrapper(wrapperText) {
  // Find the lines that demark the default implementation of the assignment.
  var startRe = /^.*{{start-default-text((?:;[^=]+=[^;}]*)*)}}$/gm,
      startMatch = startRe.exec(wrapperText),
      endRe = /^.*{{end-default-text}}$/gm,
      endMatch = endRe.exec(wrapperText);
  if (!startMatch) {
    console.log("Unable to find {{start-default-text}} in wrapper.");
    return;
  }
  if (!endMatch) {
    console.log("Unable to find {{end-default-text}} in wrapper.");
    return;
  }
  var result = {
    before: wrapperText.substr(0, startMatch.index),
    startLine: startMatch[0],
    defaultText: wrapperText.substring(startRe.lastIndex+1, endMatch.index),
    endLine: endMatch[0],
    after: wrapperText.substr(endRe.lastIndex)
  };
  if (startMatch[1]) {
    var parts = startMatch[1].substr(1).split(';'), vars = {};
    $.each(parts, function(n, part) {
      var offset = part.indexOf('='),
          key = part.substr(0, offset),
          value = part.substr(offset+1);
      if (vars.hasOwnProperty(key)) {
        console.log('Duplicate property (' + key + ') in start marker:\n' + startMatch[0]);
        return;
      }
      vars[key] = value;
    });
    result.vars = vars;
  }
  // TODO(jamessynge): Remove linePrefix or indentBy*' ' from beginning of each line
  // of the defaultText.
  return result;
}

// Given a template object and some edited code, expands the
// template for the running version of the code. Note that when
// first opening a file in the editor, code is "" (empty string),
// rather than the file's content. Wrapper authors made need to handle
// that case, or we made need to do something different (e.g. just
// use the default wrapper only in this case, as it displays the grid
// and default turtle).
function expandRunTemplate(template, code) {
  // Remove "#!pencil... at start of file, replace with a \n so we don't change line numbers.
  var cleanedCode = code.replace(/^#!pencil[^\n\r]*($|[\n\r])/, '\n'),
      tmpl = template.wrapper.data,
      wrapper = parseTemplateWrapper(tmpl);
  if (!wrapper) {
    return code;
  }
  if (wrapper.vars) {
    var prefix;
    if (wrapper.vars.linePrefix) {
      prefix = wrapper.vars.linePrefix;
    } else if (wrapper.vars.indentBy) {
      var indentBy = +wrapper.vars.indentBy;
      if (indentBy > 0) {
        prefix = "                               ".substr(0, indentBy);
      }
    }
    if (prefix != undefined) {
      var lines = cleanedCode.split('\n');
      cleanedCode = prefix + lines.join('\n' + prefix) + '\n';
    }
  }
  var result = wrapper.before + cleanedCode + wrapper.after;
  console.log("Added user's code to custom wrapper");
  // TODO Consider adding support for multiple levels of wrapping (i.e. where
  // metadata in first wrapper specifies path to next wrapper). For the moment,
  // if the wrapper's file name has no extension, we assume that the wrapper is
  // coffee script, to be wrapped in the standard code which adds turtlebits
  // and creates the default turtle.
  var mimeType = mimeForFilename(template.wrapper.file);
  if (mimeType && /^text\/x-pencilcode/.test(mimeType)) {
    result = wrapTurtle(result);
  }
  return result;
}

function modifyForPreview(text, template, filename, targetUrl) {
  var mimeType = mimeForFilename(filename);
  if (mimeType && /^text\/x-pencilcode/.test(mimeType)) {
    if (template && template.wrapper) {
      text = expandRunTemplate(template, text);
    } else {
      console.log("Wrapping user's code in default wrapper");
      text = wrapTurtle(text);
    }
    mimeType = mimeType.replace(/\/x-pencilcode/, '/html');
  }
  if (!text) return '';
  if (mimeType && !/^text\/html/.test(mimeType)) {
    return '<PLAINTEXT>' + text;
  }
  if (targetUrl && !/<base/i.exec(text)) {
    // Insert a <base href="target_url" /> in a good location.
    var firstLink = text.match(
          /(?:<link|<script|<style|<body|<img|<iframe|<frame|<meta|<a)\b/i),
        insertLocation = [
          text.match(/(?:<head)\b[^>]*>\n?/i),
          text.match(/<html\b[^>]*>\n?/i),
          text.match(/<\!doctype\b[^>]*>\n?/i)
        ],
        insertAt = 0, j, match;
    for (j = 0; j < insertLocation.length; ++j) {
      match = insertLocation[j];
      if (match && (!firstLink || match.index < firstLink.index)) {
        insertAt = match.index + match[0].length;
        break;
      }
    }
    return text.substring(0, insertAt) +
             '<base href="' + targetUrl + '" />\n' +
             text.substring(insertAt);
  }
  return text;
}

function setPaneRunText(pane, text, template, filename, targetUrl) {
  clearPane(pane);
  var paneState = state.pane[pane];
  paneState.running = true;
  paneState.filename = filename;
  updatePaneTitle(pane);
  // Assemble text and insert <base>, <plaintext>, etc., as appropriate.
  var code = modifyForPreview(text, template, filename, targetUrl);
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
      framedoc.write(code);
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
  if (paneState.editor) {
    paneState.editor.destroy();
  }
  paneState.editor = null;
  paneState.filename = null;
  paneState.cleanText = null;
  paneState.cleanLineCount = 0;
  paneState.marked = {};
  paneState.mimeType = null;
  paneState.dirtied = false;
  paneState.links = null;
  paneState.running = false;
  $('#' + pane).html(loading ? '<div class="vcenter">' +
      '<div class="hcenter"><div class="loading"></div></div></div>' : '');
  $('#' + pane + 'title').html('');
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
  var prefix = '', suffix = '';
  if (paneState.editor) {
    if (/^text\/plain/.test(paneState.mimeType)) {
      suffix = ' text';
    } else if (/^text\/xml/.test(paneState.mimeType) ||
        /^application\/json/.test(paneState.mimeType)) {
      suffix = ' data';
    } else {
      suffix = ' code';
    }
  } else if (paneState.links) {
    suffix = ' directory';
  } else if (paneState.running) {
    prefix = '<a target="_blank" href="/home/' + paneState.filename + '">';
    suffix = ' preview</a>';
  }
  var shortened = paneState.filename || '';
  shortened = shortened.replace(/^.*\//, '');
  $('#' + pane + 'title').html(prefix + shortened + suffix);
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

// Initializes an (ACE) editor into a pane, using the given text and the
// given filename.
// @param pane the id of a pane - alpha, bravo or charlie.
// @param text the initial text to edit.
// @param filename the filename to use.
// @param instructionHTML instructions to show near the editor.
function setPaneEditorText(pane, text, filename, instructionHTML) {
  clearPane(pane);
  text = normalizeCarriageReturns(text);
  var id = uniqueId('editor');
  var paneState = state.pane[pane];
  paneState.filename = filename;
  paneState.mimeType = mimeForFilename(filename);
  paneState.cleanText = text;
  paneState.dirtied = false;
  var paneHTML = '<div id="' + id + '" class="editor"></div>';
  // if the instructionHTML is provided, then create another
  // div inside this pane for the instructions.
  if (instructionHTML) {
    paneHTML =
       '<div class="instructions">' + instructionHTML + '</div>' +
       paneHTML;
  }
  $('#' + pane).html(paneHTML);
  var editor = paneState.editor = ace.edit(id);
  fixRepeatedCtrlFCommand(editor);
  updatePaneTitle(pane);
  editor.setTheme("ace/theme/chrome");
  editor.setBehavioursEnabled(false);
  editor.setHighlightActiveLine(false);
  editor.getSession().setFoldStyle('markbeginend');
  editor.getSession().setUseWrapMode(true);
  editor.getSession().setTabSize(2);
  editor.getSession().setMode(modeForMimeType(paneState.mimeType));
  var lineArr = text.split('\n');
  var lines = lineArr.length;
  var dimensions = getTextRowsAndColumns(text);
  // A big font char is 14 pixels wide and 29 pixels high.
  var big = { width: 14, height: 29 };
  // We're "long" if we bump out of the pane rectangle.
  var long = ((dimensions.rows + 2) * big.height > $('#' + pane).height() ||
              (dimensions.columns + 5) * big.width > $('#' + pane).width());
  if (long) {
    // Use a small font for long documents.
    $('#' + pane + ' .editor').css({fontWeight: 500, lineHeight: '119%'});
    editor.setFontSize(16);
  } else {
    // Use a giant font for short documents.
    $('#' + pane + ' .editor').css({fontWeight: 600, lineHeight: '121%'});
    editor.setFontSize(24);
  }
  editor.setValue(text);
  var um = editor.getSession().getUndoManager();
  um.reset();
  publish('update', [text]);
  editor.getSession().setUndoManager(um);
  editor.getSession().on('change', function() {
    ensureEmptyLastLine(editor);
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
        $('#' + pane + ' .editor').css({fontWeight: 500, lineHeight: '119%'});
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
    editor.gotoLine(editor.getSession().getLength() - 1, 0);
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
  var text = paneState.editor.getSession().getValue();
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
  var text = paneState.editor.getSession().getValue();
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

function noteNewFilename(pane, filename) {
  var paneState = state.pane[pane];
  paneState.filename = filename;
  if (paneState.editor) {
    paneState.mimeType = mimeForFilename(filename);
    paneState.editor.getSession().clearAnnotations();
    paneState.editor.getSession().setMode(modeForMimeType(paneState.mimeType));
  }
  updatePaneTitle(pane);
}

eval(see.scope('view'));

$('#owner,#filename,#folder').tooltipster();

return window.pencilcode.view;

});

