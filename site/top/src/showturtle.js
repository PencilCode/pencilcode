(function() {
  var scripts = document.getElementsByTagName('script'),
      thisScript = scripts.length && scripts[scripts.length - 1];
  if (!thisScript.hasAttribute('noturtle')) { $.turtle(); }
  if (window.ide == null) try {
    window.ide = null;
    // Propagate the ide variable from the parent window, if present.
    // When running framed inside in the pencilcode ide, this object
    // is set up by editor-debug.js.
    if (window.parent !== window && window.parent.ide &&
        'function' == typeof(window.parent.ide.getEditorText)) {
      window.ide = window.parent.ide;
    }
  } catch (e) {}
})();
