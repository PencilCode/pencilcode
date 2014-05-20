$.turtle();
if (window.ide == null) try {
  window.ide = null;
  if (window.parent !== window && window.parent.ide &&
      $.isFunction(window.parent.ide.getEditorText)) {
    window.ide = window.parent.ide;
  }
} catch (e) {}
