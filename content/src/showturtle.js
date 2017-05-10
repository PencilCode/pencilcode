/** Sets up the jquery turtle object for the program window
*/
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
  ww._start_ide_ = function(pump) {
    if (ww.see) ww.see.init(pump);
    if (ww.ide && ww.ide.reportEvent) ww.ide.reportEvent('init');
    delete ww._start_ide_;
    delete ww._start_ide_cs_;
    delete ww._start_ide_js_;
  }
  ww._start_ide_cs_ = 'this._start_ide_(eval(this.see.cs))';
  ww._start_ide_js_ = 'this._start_ide_(eval(this.see.js))';
})(window);
