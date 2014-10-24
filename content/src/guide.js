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
    if (instant) {
      $('#guidepane').css('transition', 'right 0');
    }
    $('#guidepane').css('right', goal);
    $('#guidepane').css('transition', '');
  }
}

function isGuideVisible() {
  var width = $('#guidepane').width();
  var pos = parseInt($('#guidepane').css('right'));
  return (pos + width > 0);
}

function setGuideUrl(url) {
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
  var data = event.data;
  if (data && 'object' == typeof data && data.type == 'guideurl' &&
      'string' == typeof data.url && data.url.indexOf(event.origin) == 0) {
    triggerCallback('guideurl', data.url);
  }
});

return {
  show: showGuide,
  isVisible: isGuideVisible,
  setUrl: setGuideUrl,
  on: setCallback
};

});
