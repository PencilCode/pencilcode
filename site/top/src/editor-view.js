///////////////////////////////////////////////////////////////////////////
// VIEW SUPPORT
///////////////////////////////////////////////////////////////////////////

define(['jquery', 'tooltipster', 'see'],
function($, tooltipster, see) {

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
  depth: window.history.state && window.history.state.depth || 0,
  aborting: false,
  pane: {
    alpha: initialPaneState(),
    bravo: initialPaneState(),
    charlie: initialPaneState()
  },
}

window.pencilcode.view = {
  // Listens to events
  on: function(tag, cb) { state.callbacks[tag] = cb; },
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
  noteNewFilename: noteNewFilename,
  setPaneEditorReadOnly: setPaneEditorReadOnly,
  isPaneEditorDirty: isPaneEditorDirty,
  setPaneLinkText: setPaneLinkText,
  setPaneRunText: setPaneRunText,
  setPrimaryFocus: setPrimaryFocus,
  // setPaneRunUrl: setPaneRunUrl,
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
  showMiddleButton: showMiddleButton,
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
  setVisibleUrl: setVisibleUrl
};

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

// Global hotkeys for this application.  Ctrl- (or Command-) key functions.
var hotkeys = {
  '\r': function() { fireEvent('run'); return false; },
  'S': function() { fireEvent('save'); return false; },
  'H': forwardCommandToEditor,
  'F': forwardCommandToEditor
};

// Capture global keyboard shortcuts.
// TODO(davibau): This is only a start at preventing the browser from
// bringing up its unhelpful Save and Find dialogs when Ctrl-S or Ctrl-F.
// Other keyboard traps include Backspace (for browser "back"), and
// also, all these keys when the focus is on the nested frame.  We should
// capture those cases as well, but that is not yet done.
$('body').on('keydown', function(e) {
  if (e.ctrlKey || e.metaKey) {
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
      .replace(/^\/*/, '').replace(/\/\/+/g, '/');
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
  
  // set tooltip for the save button after the buttons are
  // registered with the buttonbar
  $('#save').tooltipster();
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

function centerMiddle() {
  var m = $('#middle');
  m.css({left:($(window).width() - m.outerWidth()) / 2});
}

$(window).on('resize.middlebutton', centerMiddle);

function showMiddleButton(which) {
  if (which == 'run') {
    $('#middle').find('div').eq(0).html(
      '<button id="run" title="Ctrl+Enter"><div class="triangle"></div></button>');
    if (state.previewMode) {
      $('#middle').show();
      centerMiddle();
    }
    // set tooltip for the run button
    $('#run').tooltipster();
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
}

///////////////////////////////////////////////////////////////////////////
// SHARE DIALOG
///////////////////////////////////////////////////////////////////////////

function showShareDialog(opts) {
  if (!opts) {
    opts = new Object();
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
        '<div class="field">' + 
          'Full Screen <input type="text" value="' + opts.shareRunURL + '"><button class="copy" url="' + opts.shareRunURL + '"><img src="/copy.png"></button>' + 
        '</div>' + 
        '<div class="field">' + 
          'Code <input type="text" value="' + opts.shareEditURL + '"><button class="copy" url="' + opts.shareEditURL + '"><img src="/copy.png"></button>' + 
        '</div>' + 
        (opts.shareClipURL ?
        '<div class="field">' + 
   	  'Shortened <input type="text" value="' + opts.shareClipURL + '"><button class="copy" url="' + opts.shareClipURL + '"><img src="/copy.png"></button>' + 
	 '</div>' : '') + 
      '</div><br>' + 
    '<button class="ok"><a id="sharehlink" target="_blank" href="mailto:?body='+bodyText+'&subject='+subjectText+'">Email</a></button>' +
    '<button class="cancel">Cancel</button>';

  opts.init = function(dialog) {
    dialog.find('#sharehlink').focus();
  }

  opts.onclick = function(e, dialog, state) {
    if ($(e.target).hasClass("copy"))
      buttonObj = $(e.target);
    else
      buttonObj = $(e.target).parents(".copy");
    if (buttonObj && buttonObj[0]) {
      prompt('URL to copy:', buttonObj[0].attributes.url.value);
    }
  }

  showDialog(opts);
}

function showDialog(opts) {
  var overlay = $('#overlay').show();
  if (!opts) { opts = {}; }
  overlay.html('');
  var dialog = $('<div class="dialog"><div class="prompt">' +
    (opts.prompt ? opts.prompt : '') +
    '</div>' + 
    (opts.content ? opts.content : '') + 
    '<div class="info">' +
    (opts.info ? opts.info : '') +
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
        if (!x)
          return;

        if (x[0].tagName == "INPUT") {
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
      retVal = new Object();

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
    opts = new Object();

  opts.content = 
    '<div class="content">' + 
    '<div class="field">Name:<div style="display:inline-table">'+ 
      '<input class="username"' +
      (opts.username ? ' value="' + opts.username + '" disabled' : '') +
      '>' +
      (opts.switchuser ? '<div class="fieldlink">&nbsp;' +
       '<a href="//' + window.pencilcode.domain + '/" class="switchuser">' +
       'Not me?</a></div>' : '') +
    '</div></div>' +
      (opts.setpass ?
      '<div class="field">Old password:<input type="password" class="password"></div>' +
      '<div class="field">New password:<input type="password" class="newpass"></div>' :
      '<div class="field">Password:<input type="password" class="password"></div>') + 
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

function wrapTurtle(text) {
  return (
'<!doctype html>\n<html>\n<head>\n<script src="http://' +
window.pencilcode.domain + '/turtlebits.js"><\057script>\n' +
'</head>\n<body>\n<script type="text/coffeescript">\neval $.turtle()\n\n' +
text + '\n<\057script>\n</body>\n</html>\n');
}

function modifyForPreview(text, filename, targetUrl) {
  var mimeType = mimeForFilename(filename);
  if (mimeType && /^text\/x-pencilcode/.test(mimeType)) {
    text = wrapTurtle(text);
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

function setPaneRunText(pane, text, filename, targetUrl) {
  clearPane(pane);
  var paneState = state.pane[pane];
  paneState.running = true;
  paneState.filename = filename;
  updatePaneTitle(pane);
  // Assemble text and insert <base>, <plaintext>, etc., as appropriate.
  var code = modifyForPreview(text, filename, targetUrl);
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
    }
    $(this).dequeue();
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
  return text.replace(/\r\n|\r/g, "\n");
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

// Initializes an (ACE) editor into a pane, using the given text and the
// given filename.
// @param pane the id of a pane - alpha, bravo or charlie.
// @param text the initial text to edit.
// @param filename the filename to use.
function setPaneEditorText(pane, text, filename) {
  clearPane(pane);
  text = normalizeCarriageReturns(text);
  var id = uniqueId('editor');
  var paneState = state.pane[pane];
  paneState.filename = filename;
  paneState.mimeType = mimeForFilename(filename);
  paneState.cleanText = text;
  paneState.dirtied = false;
  $('#' + pane).html('<div id="' + id + '" class="editor"></div>');
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
  var lines = text.split('\n').length;
  var long = (lines * 24 * 1.4 > $('#' + pane).height());
  if (long) {
    $('.editor').css({fontWeight: 500, lineHeight: '129%'});
    editor.setFontSize(16);
  } else {
    $('.editor').css({fontWeight: 600, lineHeight: '121%'});
    editor.setFontSize(24);
  }
  editor.setValue(text);
  var um = editor.getSession().getUndoManager();
  um.reset();
  editor.getSession().setUndoManager(um);
  editor.getSession().on('change', function() {
    ensureEmptyLastLine(editor);
    clearPaneEditorMarks(pane);
    if (editor.getFontSize() > 16) {
      if (editor.getSession().getLength() *
          editor.getFontSize() * 1.4 > $('#' + pane).height()) {
        editor.setFontSize(16);
        $('.editor').css({fontWeight: 500, lineHeight: '119%'});
      }
    }
    if (!paneState.dirtied) {
      fireEvent('dirty', [pane]);
    }
  });
  if (long) {
    editor.gotoLine(0);
  } else {
    editor.gotoLine(lines, editor.getSession().getLine(lines - 1).length);
  }
  setPrimaryFocus();
  editor.on('focus', function() {
    fireEvent('editfocus', [pane]);
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
  var idMap = paneState.marked[markclass];
  if (zline in idMap) {
    return;  // Nothing to do if already highlighted.
  }
  var r = paneState.editor.session.highlightLines(zline, zline, markclass);
  // Save the mark ID so that it can be cleared later.
  idMap[zline] = r.id;
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
  session.removeMarker(id);
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
      session.removeMarker(idMap[zline]);
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

