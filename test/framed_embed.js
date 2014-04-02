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
      window.resetTest = function() {
        // this object will hold various checks we do along the way
        window.test = {
          code0: null,
          code1: null,
          code2: null,
          updatedCode: null,
          executedCode: null,
          loaded: 0,
          updated: 0,
          executed: 0,
          error: false,
          loadedThis: false,
          updatedThis: false,
          executedThis: false
        };
      };
      window.resetTest();
    }, function() {
      // wait until PencilCodeEmbed is ready
      if (!window.PencilCodeEmbed) return;
      window.test.pce = typeof(window.PencilCodeEmbed);
      return window.test;
    }, function(err, result){
      assert.ifError(err);
      assert.equal(0, result.loaded);
      assert.equal('function', result.pce);
      done();
    });
  });
  it('should set up the load event without firing it', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      window.resetTest();
      // create pencil code
      var pco = window.pco =
          new PencilCodeEmbed(document.getElementById("embed"));
      // Set up load handler.
      pco.on('load', function() {
        window.test.loadedThis = this == pco;
        window.test.loaded += 1;

        // watch editor changes
        pco.on('update', function(code) {
          window.test.updatedThis = this == pco;
          window.test.updated += 1;
          window.test.updatedCode = code;
        });

        // watch execution
        pco.on('execute', function () {
          window.test.executedThis = this == pco;
          window.test.executed += 1;
          window.test.executedCode = pco.getCode();
        });

        // trap errors
        pco.on('error', function (error) {
          window.test.error = true;
        });
      });
    }, function() {
      // wait until PencilCodeEmbed is fully loaded and code has executed
      if (window.pco && window.test) {
        return window.test;
      }
    }, function(err, result){
      assert.ifError(err);
      assert.ok(!result.loaded);
      assert.ok(!result.updated);
      assert.ok(!result.executed);
      assert.ok(!result.error);
      done();
    });
  });
  it('should load code via beginLoad and get update event', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // prepare long code, to exercise URL length
      var code = "speed 100\npen red\n";
      for (var j = 0; j < 1000; ++j) {
        code += "fd 50; rt " + j + ", 50\n";
      }
      window.test.code0 = code;
      pco.beginLoad(window.test.code0);
      window.test.code1 = pco.getCode();
    }, function() {
      // wait until PencilCodeEmbed is fully loaded and update event fires.
      if (window.test.updated) {
        window.test.code2 = pco.getCode();
        return window.test;
      }
      return false;
    }, function(err, result){
      assert.ifError(err);
      assert.ok(result.code0.length > 5000);
      assert.equal(result.code0, result.code1);
      assert.equal(result.code0, result.code2);
      assert.equal(1, result.loaded);
      assert.equal(1, result.updated);
      assert.ok(!result.executed);
      assert.ok(!result.error);

      assert.ok(result.loadedThis);
      assert.ok(result.updatedThis);

      assert.ok(!result.executedCode);
      assert.equal(result.code0, result.updatedCode);
      done();
    });
  });
  it('should load code via setCode and get update event', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      window.resetTest();
      // Prepare code without trailing \n, to force change.
      // (the editor will guarantee a trailing \n)
      window.test.code0 = 'speed 150\npen blue\nrt 90\nfd 100';
      pco.setCode(window.test.code0);
      window.test.code1 = pco.getCode();
    }, function() {
      // wait until PencilCodeEmbed is fully loaded and code has executed
      if (window.test.updated) {
        window.test.code2 = pco.getCode();
        return window.test;
      }
      return false;
    }, function(err, result){
      assert.ifError(err);
      assert.equal(result.code0, result.code1);
      assert.equal(result.code0 + '\n', result.code2);
      // Load event should not fire again.
      assert.ok(!result.loaded);
      // Update should have happened exactly once.
      assert.equal(1, result.updated);
      assert.ok(!result.executed);
      assert.ok(!result.error);

      assert.ok(result.updatedThis);

      assert.equal(result.code0 + '\n', result.updatedCode);
      done();
    });
  });
  it('should be able change visibility of controls', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      window.resetTest();

      // change visibility of controls
      pco.hideEditor();
      pco.showEditor();

      pco.hideMiddleButton();
      pco.showMiddleButton();

      pco.setReadOnly();
      pco.setEditable();

      pco.showNotification('Welcome!');
      pco.hideNotification();

      // Let the test go for 200ms
      setTimeout(function() { window.test.finished = true; }, 200);
    }, function() {
      // wait until run is completed.
      if (window.test.finished) {
        window.test.code0 = pco.getCode();
        return window.test;
      }
      return false;
    }, function(err, result){
      // No errors
      assert.ifError(err);
      // Code should be intact.
      assert.ok(/fd 100/.test(result.code0));
      // And no events should have fired.
      assert.ok(!result.loaded);
      assert.ok(!result.updated);
      assert.ok(!result.executed);
      assert.ok(!result.error);
      done();
    });
  });
  it('should run code via beginRun and get execute event', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      window.resetTest();
      window.test.code0 = pco.getCode();
      pco.beginRun();
    }, function() {
      // wait until run is completed.
      if (window.test.executed) {
        window.test.code1 = pco.getCode();
        return window.test;
      }
      return false;
    }, function(err, result){
      assert.ifError(err);
      assert.ok(/fd 100/.test(result.code0));
      assert.equal(result.code0, result.code1);
      // Load event should not fire again.
      assert.ok(!result.loaded);
      // Update should not have fired.
      assert.ok(!result.updated);
      // Run should happen once.
      assert.equal(1, result.executed);
      assert.ok(!result.error);
      assert.ok(result.executedThis);
      assert.equal(result.code0, result.executedCode);
      done();
    });
  });
});
