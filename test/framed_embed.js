var phantom = require('node-phantom-simple'),
    phantomjs = require('phantomjs'),
    assert = require('assert'),
    testutil = require('./lib/testutil'),
    one_step_timeout = 8000,
    refreshThen = testutil.refreshThen,
    asyncTest = testutil.asyncTest;

describe('framed embed', function() {
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
  it('should serve the embed script', function(done) {
    // Navigate to see the editor for the program named "first".
    _page.set('content',
       '<div id="embed" style="width:550px;height:350px"></div>' +
       '<script src="http://pencilcode.net.dev/lib/pencilcodeembed.js"><' +
       '/script>');
    asyncTest(_page, one_step_timeout, null, function() {
    }, function() {
      // wait until PencilCodeEmbed is ready
      if (!window.PencilCodeEmbed) return;
      return true;
    }, function(err, result){
      assert.ifError(err);

      asyncTest(_page, one_step_timeout, null, function() {

        // prepare code
        var code = "speed 100\npen red\n";
        for (var j = 0; j < 100; ++j) {
          code += "fd 50; rt " + j + ", 50\n";
        }

        // this object will hold various checks we do along the way
        window.test = {
          code: code,
          updatedCode: null,
          executedCode: null,
          loaded: false,
          updated: false,
          executed: false,
          error: false,
          loadedThis: false,
          updatedThis: false,
          executedThis: false
        };

        // created pencil code
        var pco = new PencilCodeEmbed(document.getElementById("embed"));

        pco.on('loaded', function() {
          window.test.loadedThis = this == pco;
          window.test.loaded = true;

          // watch editor changes
          pco.on('updated', function(code) {
            window.test.updatedThis = this == pco;
            window.test.updated = true;
            window.test.updatedCode = code;
          });

          // watch execution
          pco.on('executed', function () {
            window.test.executedThis = this == pco;
            window.test.executed = true;
            window.test.executedCode = pco.getCode();
          });

          // trap errors
          pco.on('error', function (error) {
            window.test.error = true;
          });

          // change visibility of controls
          pco.hideEditor();
          pco.showEditor();

          pco.hideMiddleButton();
          pco.showMiddleButton();

          pco.setReadOnly();
          pco.setEditable();

          pco.showNotification('Welcome!');
          pco.hideNotification();

          // put some code into the editor
          pco.setCode(code);

          // execute code loaded into the editor
          pco.beginRun();
        });
        pco.beginLoad();
      }, function() {
        // wait until PencilCodeEmbed is fully loaded and code has executed
        if (window.test.loaded && window.test.updated && window.test.executed){
          return window.test;
        }
        return false;
      }, function(err, result){
        assert.ifError(err);

        assert.ok(result.loaded);
        assert.ok(result.updated);
        assert.ok(result.executed);
        assert.ok(!result.error);

        assert.ok(result.loadedThis);
        assert.ok(result.updatedThis);
        assert.ok(result.executedThis);

        assert.ok(result.code == result.executedCode);
        assert.ok(result.code == result.updatedCode);
        done();
      });
    });
  });
});
