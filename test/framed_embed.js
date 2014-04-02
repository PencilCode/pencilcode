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
      // Poll until the element with class="editor" appears on the page.
      if (!window.PencilCodeEmbed) return;
      // Reach in and return the text that is shown within the editor.
      var pco = new PencilCodeEmbed(document.getElementById("embed"));
      var longcode = "pen red\\n";
      for (var j = 0; j < 1000; ++j) {
        longcode += "fd 50; rt " + j + ", 50\\n";
      }
      pco.setCode(longcode);
      return {
        src: document.getElementsByTagName('iframe')[0].src
      };
    }, function(err, result) {
      assert.ifError(err);
      assert.ok(/rt%20999/.test(result.src));
      done();
    });
  });
});
