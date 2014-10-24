define([
  'jquery'
], function(
  $
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
  var data = event.data;
  if (event.source != $('#guidepane iframe').prop('contentWindow') ||
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
  if (data.type == 'show') {
    showGuide(true);
  }
  if (data.type == 'hide') {
    showGuide(false);
  }
});

return {
  show: showGuide,
  isVisible: isGuideVisible,
  setUrl: setGuideUrl,
  on: setCallback
};

});
