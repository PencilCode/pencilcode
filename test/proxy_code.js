var chai = require('chai'),
    expect = chai.expect,
    assert = chai.assert,
    testutil = require('./lib/testutil'),
    startChrome = testutil.startChrome,
    pollScript = testutil.pollScript;
chai.use(require('chai-as-promised'));

describe('proxy program', function() {
  var _driver;
  before(function() {
    return _driver = startChrome();
  });
  after(function() {
    _driver.quit();
  });
  it('should show create button when loading dir', function() {
    _driver.get('http://livetest.pencilcode.net.dev/edit/');
    pollScript(_driver, function() {
      if (!$('.create').length) return;
      return {
        bt: $('#bravotitle').text()
      };
    }).then(function(result) {
     assert(/irectory/.test(result.bt));
    });
    return _driver;
  });
  it('should be able to start a new file', function() {
    _driver.executeScript(function() {
      // Click on the "Create new program" link.
      $('.create').click();
    });
    pollScript(_driver, function() {
      // The panes will scroll horizontally.  Look for a panetitle that
      // is up against the left edge.
      var lefttitle = $('.panetitle').filter(
          function() { return $(this).parent().position().left == 0; }).
          find('.panetitle-text');
      // Wait for this title to say "blocks" in it.
      if (!lefttitle.length || !/blocks/.test(lefttitle.text())) return;
      // And wait for an editor to be rendered.
      if (!$('.editor').length) return;
      var ace_editor = ace.edit($('.droplet-ace')[0]);
      // Return a ton of UI state.
      return {
        filename: $('#filename').text(),
        title: lefttitle.text().trim(),
        text: ace_editor.getSession().getValue(),
        activeid: document.activeElement && document.activeElement.id,
        preview: $('.preview').length,
        saved: $('#save').prop('disabled'),
        login: $('#login').length,
        logout: $('#logout').length
      }
    }).then(function(result) {
      // The filename chosen should start with the word "untitled"
      assert(/^untitled/.test(result.filename));
      // The title should say blocks
      assert.equal('blocks', result.title);
      // The program text should be empty.
      assert.equal("", result.text);
      // The element with active focus should be the editable filename.
      assert.equal("filename", result.activeid);
      // There should be a visible preview div.
      assert.equal(1, result.preview);
      // There sould be a login button.
      assert(result.login);
      // There sould be no logout button.
      assert(!result.logout);
      // The "save" button should be enabled only if not logged in.
      assert.equal(result.logout, result.saved);
    });
    return _driver;
  });
  it('should flip out of blocks mode', function() {
    _driver.executeScript(function() {
      // Click on the "blocks" button
      var leftlink = $('.panetitle').filter(
          function() { return $(this).parent().position().left == 0; })
          .find('a');
      leftlink.click();
    });
    pollScript(_driver, function() {
      var lefttitle = $('.panetitle').filter(
          function() { return $(this).parent().position().left == 0; })
          .find('.panetitle-text');
      if (/blocks/.test(lefttitle.text())) return;
      return {
        filename: $('#filename').text(),
        title: lefttitle.text().trim(),
        saved: $('#save').prop('disabled'),
        logout: $('#logout').length
      };
    }).then(function(result) {
      // Filename is still shown and unchanged.
      assert(/^untitled/.test(result.filename));
      // Intentional: we should always add an extra empty line at the bottom.
      assert.equal('code', result.title);
      // The "save" button should be enabled only if not logged in.
      assert.equal(result.logout, result.saved);
    });
    return _driver;
  });
  it('should be able to enter a program that uses the proxy', function() {
    _driver.executeScript(function() {
      // Modify the text in the editor.
      var ace_editor = ace.edit($('.droplet-ace')[0]);
      $('.editor').mousedown();
      ace_editor.getSession().setValue(
          "proxy = (url) ->\n" +
          "  location.protocol + '//' + location.host + '/proxy/' + url\n" +
          "loadImageData = (url, cb) ->\n" +
          "  im = new Image\n" +
          "  im.addEventListener 'error', -> cb null\n" +
          "  im.addEventListener 'load', ->\n" +
          "    c = document.createElement 'canvas'\n" +
          "    c.width = im.width\n" +
          "    c.height = im.height\n" +
          "    ctx = c.getContext '2d'\n" +
          "    ctx.drawImage im, 0, 0\n" +
          "    imdata = ctx.getImageData 0, 0, c.width, c.height\n" +
          "    cb(imdata)\n" +
          "  im.src = proxy url\n" +
          "window.d = null\n" +
          "await loadImageData " +
            "'http://davidbau.com/images/art/enigma.jpg', defer window.d\n"
      );
    });
    pollScript(_driver, function() {
      var ace_editor = ace.edit($('.droplet-ace')[0]);
      return {
        filename: $('#filename').text(),
        text: ace_editor.getValue(),
        activeid: document.activeElement && document.activeElement.id,
        preview: $('.preview').length,
        saved: $('#save').prop('disabled')
      };
    }).then(function(result) {
      // Filename is still shown and unchanged.
      assert(/^untitled/.test(result.filename));
      // Editor text has the new code.
      assert(/enigma/.test(result.text));
      // Preview is still shown.
      assert.equal(1, result.preview);
      // The save button is no longer disabled, because the doc is dirty.
      assert.equal(false, result.saved);
    });
    return _driver;
  });
  it('should be able to access off-domain image bits', function() {
    _driver.executeScript(function() {
      // Click on the triangle run button.
      $('#run').mousedown();
      $('#run').click();
    });
    pollScript(_driver, function() {
      try {
        // Wait for the preview frame to show
        if (!$('.preview iframe').length) return;
        if (!$('.preview iframe')[0].contentWindow.see) return;
        // Evaluate some expression in the coffeescript evaluation window.
        var seval = $('.preview iframe')[0].contentWindow.see.eval;
        // And also wait for the turtle to start turning, then stop moving.
        if (!seval) return;
        if (!seval('window.d')) return;
        var d = seval('window.d');
        return {
          width: d.width,
          height: d.height,
          datalen: d.data.length,
          data10000: d.data[10000]
        };
      }
      catch(e) {
        return {poll: true, error: e};
      }
    }).then(function(result) {
      // Verify dimensions can be read.
      assert.equal(result.height, 316);
      assert.equal(result.width, 298);
      assert.equal(result.datalen, 298 * 316 * 4);
      // Verify that an arbitrary byte can be read from the image.
      assert.equal(result.data10000, 61);
    });
    return _driver;
  });
});
