$.turtle();
if (window.ide == null) try {
  window.ide = null;
  // Propagate the ide variable from the parent window, if present.
  // When running framed inside in the pencilcode ide, this object
  // is set up by editor-debug.js.
  if (window.parent !== window && window.parent.ide &&
      $.isFunction(window.parent.ide.getEditorText)) {
    window.ide = window.parent.ide;
  }
} catch (e) {}
