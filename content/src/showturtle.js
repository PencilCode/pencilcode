(function(ww) {
  var script = document.currentScript || (function() {
     var scripts = document.getElementsByTagName("script");
     return scripts[scripts.length - 1];
  })();
  var map = {};
  if (script) {
    for (var j = 0, atts = script.attributes; j < atts.length; j++) {
      var value = atts[j].value;
      if (value == 'false') value = false;
      else if (value == 'true') value = true;
      else if (value == 'null') value = null;
      else if (/^(?:\d+\.?|\d*\.\d+)(?:e[-+]?\d+)?$/.test(value)) {
        value = Number(value);
      }
      map[atts[j].name] = value;
    }
  }
  $.turtle(map);
  if (ww.ide == null) try {
    ww.ide = null;
    // Propagate the ide variable from the parent window, if present.
    // When running framed inside in the pencilcode ide, this object
    // is set up by debug.js.
    if (ww.parent !== ww && ww.parent.ide &&
        $.isFunction(ww.parent.ide.getEditorText)) {
      ww.ide = ww.parent.ide;
    }
  } catch (e) {}
  ww._start_ide_ = function(pump) {
    if (ww.see) ww.see.init(pump);
    if (ww.ide && ww.ide.reportEvent) ww.ide.reportEvent('init');
    delete ww._start_ide_;
    delete ww._start_ide_cs_;
    delete ww._start_ide_js_;
  }
  ww._start_ide_cs_ = 'window._start_ide_(eval(window.see.cs))';
  ww._start_ide_js_ = 'window._start_ide_(eval(window.see.js))';
})(window);
