(function(ww) {
  if (ww.ide == null) try {
    ww.ide = null;
    // Propagate the ide variable from the parent window, if present.
    // When running framed inside in the pencilcode ide, this object
    // is set up by debug.js.
    if (ww.parent !== ww && ww.parent.ide &&
        'function' == typeof(ww.parent.ide.bindframe)) {
      ww.ide = ww.parent.ide;
    }
    ww.ide.bindframe(ww);
  } catch (e) {
    console.log(e);
  }
})(this);
