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

      var code = null;
      var event_code = null;
      var loaded = false;
      var ran = false;

      asyncTest(_page, one_step_timeout, null, function() {
        var pco = new PencilCodeEmbed(document.getElementById("embed"));

        pco.onLoadComplete = function() {
          loaded = true;

          // watch editor changes and code execution status
          pco.onDirty = function(code) {
            event_code = code;
          };
          pco.onRunComplete = function () {
            ran = true;
          };

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
          var code = "speed 100\npen red\\n";
          for (var j = 0; j < 100; ++j) {
            code += "fd 50; rt " + j + ", 50\\n";
          }
          pco.setCode(code);

          // execute code loaded into the editor
          pco.beginRun();
        };
        pco.beginLoad();
      }, function() {
        // wait until PencilCodeEmbed is fully loaded and code has ran
        return loaded && ran;
      }, function(err, result){
        assert.ifError(err);
        assert.ok(code == event_code);
        done();
      });
    });
  });
});
