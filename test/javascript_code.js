var phantom = require('node-phantom-simple'),
    phantomjs = require('phantomjs'),
    assert = require('assert'),
    testutil = require('./lib/testutil'),
    one_step_timeout = 8000,
    extended_timeout = 30000,
    refreshThen = testutil.refreshThen,
    asyncTest = testutil.asyncTest;

describe('javascript editor', function() {
  var _ph, _page;
  before(function(done) {
    // Create the headless webkit browser.
    phantom.create(function(error, ph) {
      assert.ifError(error);
      // Open a page for browsing.
      _ph = ph;
      _ph.createPage(function(err, page) {
        _page = page;
        page.onConsoleMessage = function(msg) {
          console.log(msg);
        }
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

  it('should serve static editor HTML', function(done) {
    // Visit the website of the user "livetest."
    _page.open('http://aaa.pencilcode.net.dev/edit',
        function(err, status) {
      assert.ifError(err);
      assert.equal(status, 'success');
      _page.evaluate(function() {
        // Inject a script that clears the login cookie for a clean start.
        document.cookie='login=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        // And also clear localStorage for this site.
        localStorage.clear();
      }, function(err) {
        assert.ifError(err);
        done();
      });
    });
  });

  it('should open js palette with .js extension', function(done) {
    //Create a new file with an extension .js
    _page.open('http://pencilcode.net.dev/edit/test.js',
      function(err, status) {
        assert.ifError(err);
        assert.equal(status, 'success');
        asyncTest(_page, one_step_timeout, null, function() {
          var leftlink = $('.panetitle').filter(
              function() { return $(this).parent().position().left == 0; })
              .find('a');
          leftlink.click();
        }, function() {
          //If tooltipster test isnt' ready, wait for it
          if (!$('.droplet-hover-div.tooltipstered')) return;
          return {
            //Content of first palette block
            text: $('.droplet-hover-div.tooltipstered').eq(0).tooltipster('content')
          }
        }, function(errs, result) {
          assert.ifError(err);
          //First block must be 'Move  forward'
          assert.equal(result.text, 'Move forward');
          done();
        });
      });
    });

  it('should load code', function(done) {
    // Navigate to see the editor for the program named "first".
    _page.open('http://aaa.pencilcode.net.dev/edit/first',
      function(err, status) {
      assert.ifError(err);
      assert.equal(status, 'success');
      asyncTest(_page, one_step_timeout, null, function() {
        addEventListener('error', function(e) { window.lasterrorevent = e; });
      }, function() {
        // Poll until the element with class="editor" appears on the page.
        if (!$('.editor').length) return;
        // Reach in and return the text that is shown within the editor.
        var ace_editor = ace.edit($('.droplet-ace')[0]);
        return {
          text: ace_editor.getSession().getValue()
        };
      }, function(err, result) {
        assert.ifError(err);
        // The editor text should contain this line of code.
        assert.ok(/\(function\(\) \{ dot\(red\); \}\)\(\)/.test(result.text));
        done();
      });
    });
  });

  it('should be able to run the program in javascript mode', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Click on the triangle run button.
      $('#run').mousedown();
      $('#run').click();
    }, function() {
      try {
        // Toggle javascript mode
        $(".gear").mousedown();
        $(".gear").click();
        $("input[value='text/javascript']").mousedown()
        $("input[value='text/javascript']").click()
        $(".ok").mousedown()
        $(".ok").click()
        // Wait for the preview frame to show
        if (!$('.preview iframe').length) return;
        if (!$('.preview iframe')[0].contentWindow.see) return;
        // Evaluate some expression in the javascript evaluation window.
        var seval = $('.preview iframe')[0].contentWindow.see.eval;
        seval('interrupt("reset")');
        // Wait for the turtle to start turning, then stop moving.
        if (seval('turtle.queue().length')) return;
        seval('jump(0,0)');
        seval('fd(100)');
        if(seval('getxy()')[1] < 99){
          return;
        }
        return {
          getxy: seval('getxy()'),
          touchesred: seval('touches(red)')
        };
      }
      catch(e) {
        return {poll: true, error: e};
      }
    }, function(err, result) {
      assert.ifError(err);
      assert.ok(Math.abs(result.getxy[0] - 0) < 1e-6);
      assert.ok(result.getxy[1] >= 100);
      assert.ok(result.touchesred);
      done();
    });
  });

  it('is done', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Final cleanup: delete local storage and the cookie.
      localStorage.clear();
      document.cookie='login=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    }, function() {
      return {
        cookie: document.cookie
      };
    }, function(err, result) {
      assert.ifError(err);
      assert.ok(!/login=/.test(result.cookie));
      done();
    });
  });
});
