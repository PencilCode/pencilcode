var $    = require('jquery'),
    view = require('view');


var guideShown = false;
var guideFrame = $('#guidepane iframe');

function showGuide(show, instant) {
  if (show === undefined) { show = true; }
  if (show == guideShown) return;
  var goal = (show ? '0' : '-50%');
  $('#guidepane').css('transition', instant ? 'right 0' : 'right 0.5s')
                 .css('right', goal);
  guideShown = show;
}

function isGuideVisible() {
  return guideShown;
}

var allowedOrigins = {};

function addGuideOrigin(url) {
  var originmatch = /^(https?:\/\/[a-z0-9]+(?:[\.-][a-z0-9]+)*)(?:\/|$)/
        .exec(url);
  if (originmatch) {
    allowedOrigins[originmatch[1]] = true;
  }
}

function setGuideUrl(url) {
  addGuideOrigin(url);
  guideFrame.attr('src', url);
}

var callbacks = {};
function setCallback(event, fn) {
  if (!callbacks.hasOwnProperty(event)) {
    callbacks[event] = [];
  }
  callbacks[event].push(fn);
}

function triggerCallback(event, args) {
  var cbarray = callbacks[event];
  for (var j = 0; j < cbarray.length; ++j) {
    cbarray[j].apply(null, args);
  }
}

$(window).on('message', function(event) {
  if (event.originalEvent) { event = event.originalEvent; }
  var guideWindow = guideFrame.prop('contentWindow');
  var data = event.data;
  if (event.source != guideWindow ||
      !allowedOrigins.hasOwnProperty(event.origin) ||
      !data || 'object' != typeof data || !data.type) {
    return;
  }
  if (data.type == 'guideurl') {
    if ('string' == typeof data.url && data.url.indexOf(event.origin) == 0) {
      triggerCallback('guideurl', [data.url]);
    }
  }
  if (data.type == 'allow') {
    if ('string' == typeof data.url) {
      addGuideOrigin(data.url);
    }
  }
  if (data.type == 'login') {
    triggerCallback('login', [data.options]);
  }
  if (data.type == 'session') {
    triggerCallback('session', [data.options]);
  }
  if (data.type == 'show') {
    showGuide(true);
  }
  if (data.type == 'hide') {
    showGuide(false);
  }
  if (data.type == 'query') {
    var model = require('controller');
    var pane = view.paneid('left');
    var doc = view.getPaneEditorData(pane);
    var state = {
      owner: model.ownername,
      user: model.username,
      filename: model.pane[pane].filename,
      isdir: model.pane[pane].isdir,
      doc: doc
    };
    guideWindow.postMessage(
        {type: 'response', id: data.id, state: state}, event.origin);
  }
});

module.exports = {
  show: showGuide,
  isVisible: isGuideVisible,
  setUrl: setGuideUrl,
  on: setCallback
};
