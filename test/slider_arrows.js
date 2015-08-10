var phantom = require('node-phantom-simple'),
    phantomjs = require('phantomjs'),
    assert = require('assert'),
    testutil = require('./lib/testutil'),
    one_step_timeout = 8000,
    extended_timeout = 30000,
    refreshThen = testutil.refreshThen,
    asyncTest = testutil.asyncTest;


describe('debugger', function() {
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
    _page.open('http://livetest.pencilcode.net.dev/edit',
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
  it('should load code', function(done) {
    // Navigate to see the editor for the program named "second".
    _page.open('http://livetest.pencilcode.net.dev/edit/second',
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
        assert.ok(/speed 2/.test(result.text));
        done();
      });
    });
  });

  it('should show slider when program runs', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Click on the triangle "run" button 
      $('#run').mousedown();
      $('#run').click();
    }, function() {
      try {
        // Wait for the slider to appear after automated delay
        if (!$('#slider').length) return;
        var lefttitle = $('.panetitle').filter(
            function() { return $(this).parent().position().left == 0; })
            .find('.panetitle-text').find('.debugtoggle');
        if (/blocks/.test(lefttitle.text())) return;
        return {
          slider: $('#slider').length,
          sliderpanel: $('.scrubbermark').length,
          backbutton: $('#backButton').length,
          forwardbutton: $('#forwardButton').length,
          pips: $('.ui-slider-pip').length,
          debugtoggle: lefttitle.text().trim(),
          label: $('.ui-slider-pip-selected').find('.ui-slider-label').text().trim(),
          slidertip: $('.ui-slider-tip').text().trim()

        };
      }
      catch(e) {
        return {poll: true, error: e};
      }
    }, function(err, result) {
      assert.ifError(err);
      // Assert that the panel containing slider exists
      assert.equal(result.sliderpanel, 1);
      // Assert that the slider element has appeared 
      assert.equal(result.slider, 1);
      // Assert that buttons to toggle steps exists
      assert.equal(result.backbutton, 1);
      assert.equal(result.forwardbutton, 1);
      // Assert number of steps on slider equals traceEvents length
      assert.equal(result.pips, 77);
      // Assert that slider tip reflects appropriate line number
      assert.equal(result.label, '0');
      assert.equal(result.slidertip, 'Line  1');
      // Assert that debug on toggle appears on pane
      assert.equal(result.debugtoggle, 'debug on');
      done();
    });
  }); 

  it('should allow users to use step buttons to see arrow/protractor', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Click on the triangle "run" button 
      $('#run').mousedown();
      $('#run').click();
    }, function() {
      try {
         // Wait for the slider to appear after automated delay
	   if (!$('#slider').length) return;
	   if (!$('#forwardButton').length) return;
           if (!$('.arrow').length) return;     
    
           // Click the forward button four times
           for (var i = 0; i < 4; i++) {
             $('#forwardButton').click();
           }	           
       return {
          label: $('.ui-slider-pip-selected').find('.ui-slider-label').text().trim(),
          protractor: $('.protractor').length,
          slidertip: $('.ui-slider-tip').text().trim(),
          arrows: $('.arrow').length
        };
      }
      catch(e) {
        return {poll: true, error: e};
      }
    }, function(err, result) {
      assert.ifError(err);
      // Assert that we are on the fourth tick
      assert.equal(result.label, '4');
      // Assert that the slider says line 5
      assert.equal(result.slidertip, 'Line  5');
      // Assert that protractor and arrows appear with slider
      assert.equal(result.protractor, 1);
      assert.ok(result.arrows > 0);
      done();
    });
  }); 

 it('should allow users to turn debugging on and off', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Click on the triangle "run" button
      $('#run').mousedown();
      $('#run').click();
    }, function() {
      try {
         // Wait for the slider to appear after automated delay
         if (!$('#slider').length) return;
         // Click on the 'debug on' text
         $('.debugtoggle').click();
       return {
          slider: $('#slider').length,
          toggletext: $('.debugtoggle').text().trim()
        };
      }
      catch(e) {
        return {poll: true, error: e};
      }
    }, function(err, result) {
      assert.ifError(err);
      // Assert that slider disappears when user clicks on toggle
      assert.equal(result.slider, 0);
      // Assert that toggle now displays 'debug off' 
      assert.equal(result.toggletext, 'debug off');
      done();
    });
  });


  it('should show arrows during runtime', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Click on the triangle "run" button 
      $('#run').mousedown();
      $('#run').click();
    }, function() {
      try {

    // Wait for the arrow to appear after automated delay
//     if (!$('.arrow').length) return; 
       return {
          label: $('.arrow').length
        };
      }
      catch(e) {
        return {poll: true, error: e};
      }
    }, function(err, result) {
      assert.ifError(err);
      assert.ok(result.label > 0);
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

