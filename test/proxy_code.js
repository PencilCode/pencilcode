var phantom = require('node-phantom-simple'),
    phantomjs = require('phantomjs'),
    assert = require('assert'),
    testutil = require('./lib/testutil'),
    one_step_timeout = 8000,
    refreshThen = testutil.refreshThen,
    asyncTest = testutil.asyncTest;

describe('proxy program', function() {
  var _ph, _page;
  before(function(done) {
    // Create the headless webkit browser.
    phantom.create(function(error, ph) {
      assert.ifError(error);
      // Open a page for browsing.
      _ph = ph;
      _ph.createPage(function(err, page) {
        _page = page;
        // Set the size to a modern laptop size.
        page.set('viewportSize', { width: 1200, height: 900 }, function(err) {
          assert.ifError(err);
          // Point it to a blank page to start
          page.open('about:blank', function(err, status){
            assert.ifError(err);
            assert.equal(status, 'success');
            done();
          });
        });
      });
    }, {
      // Launch phantomjs from the phantomjs package.
      phantomPath: phantomjs.path,
      parameters: {
        // Use the test server as a proxy server, so that all requests
        // go to this server (instead of trying real DNS lookups).
        proxy: '127.0.0.1:8193',
        // Set the disk storage to zero to avoid persisting localStorage
        // between test runs.
        'local-storage-quota': 0
      }
    });
  });
  after(function() {
    // Be sure to kill the browser when the test is done, or else
    // we can leave orphan processes.
    _ph.exit();
  });
  it('should show create button when loading dir', function(done) {
    // Navigate to see the top level directory for livetest.
    _page.open('http://livetest.pencilcode.net.dev/edit/',
        function(err, status) {
      assert.ifError(err);
      assert.equal(status, 'success');
      asyncTest(_page, one_step_timeout, null, null, function() {
        // Poll until the element with class="create" appears on the page.
        if (!$('.create').length) return;
        return {
          bt: $('#bravotitle').text()
        };
      }, function(err, result) {
        assert.ifError(err);
        assert.ok(/irectory/.test(result.bt));
        done();
      });
    });
  });
  it('should be able to start a new file', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Click on the "Create new program" link.
      $('.create').click();
    }, function() {
      // The panes will scroll horizontally.  Look for a panetitle that
      // is up against the left edge.
      var lefttitle = $('.panetitle').filter(
          function() { return $(this).position().left == 0; }).find('.panetitle-text');
      // Wait for this title to say "untitled" in it.
      if (!lefttitle.length || !/untitled/.test(lefttitle.text())) return;
      // And wait for an editor to be rendered.
      if (!$('.editor').length) return;
      var ace_editor = ace.edit($('.ice-ace')[0]);
      // Return a ton of UI state.
      return {
        filename: $('#filename').text(),
        title: lefttitle.text(),
        text: ace_editor.getSession().getValue(),
        activeid: document.activeElement && document.activeElement.id,
        preview: $('.preview').length,
        saved: $('#save').prop('disabled'),
        login: $('#login').length,
        logout: $('#logout').length
      }
    }, function(err, result) {
      assert.ifError(err);
      // The filename chosen should start with the word "untitled"
      assert.ok(/^untitled/.test(result.filename));
      // The title should reflect this name also
      assert.equal(result.filename + ' code', result.title);
      // The program text should be empty.
      assert.equal("", result.text);
      // The element with active focus should be the editable filename.
      assert.equal("filename", result.activeid);
      // There should be a visible preview div.
      assert.equal(1, result.preview);
      // There sould be a login button.
      assert.ok(result.login);
      // There sould be no logout button.
      assert.ok(!result.logout);
      // The "save" button should be enabled only if not logged in.
      assert.equal(result.logout, result.saved);
      done();
    });
  });
  it('should be able to enter a program that uses the proxy', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Modify the text in the editor.
      var ace_editor = ace.edit($('.ice-ace')[0]);
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
          "d = null\n" +
          "await loadImageData " +
            "'http://davidbau.com/images/art/enigma.jpg', defer d\n"
      );
    }, function() {
      var ace_editor = ace.edit($('.ice-ace')[0]);
      return {
        filename: $('#filename').text(),
        text: ace_editor.getValue(),
        activeid: document.activeElement && document.activeElement.id,
        preview: $('.preview').length,
        saved: $('#save').prop('disabled')
      };
    }, function(err, result) {
      assert.ifError(err);
      // Filename is still shown and unchanged.
      assert.ok(/^untitled/.test(result.filename));
      // Editor text has the new code.
      assert.ok(/enigma/.test(result.text));
      // Preview is still shown.
      assert.equal(1, result.preview);
      // The save button is no longer disabled, because the doc is dirty.
      assert.equal(false, result.saved);
      done();
    });
  });
  it('should be able to access off-domain image bits', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Click on the triangle run button.
      $('#run').mousedown();
      $('#run').click();
    }, function() {
      try {
        // Wait for the preview frame to show
        if (!$('.preview iframe').length) return;
        if (!$('.preview iframe')[0].contentWindow.see) return;
        // Evaluate some expression in the coffeescript evaluation window.
        var seval = $('.preview iframe')[0].contentWindow.see.eval;
        // And also wait for the turtle to start turning, then stop moving.
        if (!seval) return;
        if (!seval('d')) return;
        var d = seval('d');
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
    }, function(err, result) {
      // Verify dimensions can be read.
      assert.equal(result.height, 316);
      assert.equal(result.width, 298);
      assert.equal(result.datalen, 298 * 316 * 4);
      // Verify that an arbitrary byte can be read from the image.
      assert.equal(result.data10000, 57);
      done();
    });
  });
});
