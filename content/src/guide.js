define([
  'jquery',
  'view',
  'controller'
], function(
  $,
  view,
  model
){

function showGuide(show, instant) {
  if (show === undefined) { show = true; }
  var width = $('#guidepane').width();
  var pos = parseInt($('#guidepane').css('right'));
  var goal = (show ? 0 : -Math.max(width, 640));
  if (pos != goal) {
    $('#guidepane').css('transition', instant ? 'right 0' : '')
                   .css('right', goal);
  }
}

function isGuideVisible() {
  var width = $('#guidepane').width();
  var pos = parseInt($('#guidepane').css('right'));
  return (pos + width > 0);
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
  $('#guidepane iframe').attr('src', url);
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
  var guideWindow = $('#guidepane iframe').prop('contentWindow');
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
  if (data.type == 'show') {
    showGuide(true);
  }
  if (data.type == 'hide') {
    showGuide(false);
  }
  if (data.type == 'query') {
    var pane = view.paneid('left');
    var doc = view.getPaneEditorData(pane);
    var state = {
      owner: model.ownername,
      user: model.username,
      filename: model.pane[pane].filename,
      isdir: model.pane[pane].isdir,
      doc: doc
    };
    postMessage({type: 'response', id: data.id, state: state}, event.origin);
  }
});

return {
  show: showGuide,
  isVisible: isGuideVisible,
  setUrl: setGuideUrl,
  on: setCallback
};

});
