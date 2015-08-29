var phantom = require('node-phantom-simple'),
    phantomjs = require('phantomjs'),
    assert = require('assert'),
    testutil = require('./lib/testutil'),
    one_step_timeout = 8000,
    refreshThen = testutil.refreshThen,
    asyncTest = testutil.asyncTest;

describe('code debugger', function() {
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
  it('should show run button when loading code', function(done) {
    // Navigate to see the editor for the program named "first".
    _page.open('http://livetest.pencilcode.net.dev/edit/hi',
        function(err, status) {
      assert.ifError(err);
      assert.equal(status, 'success');
      asyncTest(_page, one_step_timeout, null, null, function() {
        // Poll until the element with class="editor" appears on the page.
        if (!$('.editor').length) return;
        // Reach in and return the text that is shown within the editor.
        var ace_editor = ace.edit($('.droplet-ace')[0]);
        return {
          text: ace_editor.getSession().getValue(),
          runbuttoncount: $('#run').length
        };
      }, function(err, result) {
        assert.ifError(err);
        // The editor text should contain this line of code.
        assert.ok(/pen blue/.test(result.text));
        assert.equal(result.runbuttoncount, 1);
        done();
      });
    });
  });
  it('should be able to run the program', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Click on the triangle run button.
      $('#run').mousedown();
      $('#run').click();
    }, function() {
      try {
        // Wait for the preview frame to show.
        if (!$('.preview iframe').length) return;
        if (!$('.preview iframe')[0].contentWindow.see) return;
        // Evaluate some expression in the coffeescript evaluation window.
        var seval = $('.preview iframe')[0].contentWindow.see.eval;
        // And also wait for the turtle to start moving.
        if (seval('getxy()')[1] < 10) return;
        return {
          direction: seval('direction()'),
          getxy: seval('getxy()'),
          touchesred: seval('touches red'),
          touchesblue: seval('touches blue'),
          queuelen: seval('turtle.queue().length'),
          stopcount: $('#stop').length      
        };
      }
      catch(e) {
        return {poll: true, error: e};
      }
    }, function(err, result) {
      assert.ifError(err);
      // The first move is forward....
      assert.equal(0, result.direction);
      assert.ok(Math.abs(result.getxy[0] - 0) < 1e-6);
      // The turtle should not be touching any red pixels.
      assert.equal(false, result.touchesred);
      // The turtle should be touching blue pixels that it drew.
      assert.equal(true, result.touchesblue);
      // The turtle should still have lots of queued actions.
      assert.ok(result.queuelen > 0);
      // The stop button should be showing
      assert.equal(1, result.stopcount);
      done();
    });
  });
  it('should be able to stop the program', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Click on the square stop button.
      $('#stop').mousedown();
      $('#stop').click();
    }, function() {
      try {
        if (!$('.preview iframe').length) return;
        if (!$('.preview iframe')[0].contentWindow.see) return;
        // Evaluate some expression in the coffeescript evaluation window.
        var seval = $('.preview iframe')[0].contentWindow.see.eval;
        // Reset interrupts so that we can evaluate some expressions.
        seval('interrupt("reset")');
        // And also wait for the turtle to start moving.
        return {
          touchesred: seval('touches red'),
          touchesblue: seval('touches blue'),
          queuelen: seval('turtle.queue().length'),
          debugtracecount: $('.debugtrace').length,
          debugtracetop: $('.debugtrace').css('top')
        };
      }
      catch(e) {
        return {poll: true, error: e};
      }
    }, function(err, result) {
      assert.ifError(err);
      // The turtle should not be touching any red pixels.
      assert.equal(false, result.touchesred);
      // The turtle should be touching blue pixels that it drew.
      assert.equal(true, result.touchesblue);
      // The turtle should not be moving any more.
      assert.equal(0, result.queuelen);
      // A line of code should be traced.
      assert.equal(1, result.debugtracecount);
      // The traced code should be around line 4 or beyond.
      assert.ok(parseInt(result.debugtracetop) > 80);
      done();
    });
  });
  it('should be able to highlight lines when hovered', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Click on the triangle run button.
      $('#run').mousedown();
      $('#run').click();
      // Create function to simulate mouse movements.
      window._simulate = function simulate(type, target, options) {
        if ('string' == typeof(target)) {
          target = $(target).get(0);
        }
        options = options || {};
        var pageX = pageY = clientX = clientY = dx = dy = 0;
        var location = options.location || target;
        if (location) {
          if ('string' == typeof(location)) {
            location = $(location).get(0);
          }
          var gbcr = location.getBoundingClientRect();
          clientX = gbcr.left,
          clientY = gbcr.top,
          pageX = clientX + window.pageXOffset;
          pageY = clientY + window.pageYOffset;
          dx = Math.floor((gbcr.right - gbcr.left) / 2);
          dy = Math.floor((gbcr.bottom - gbcr.top) / 2);
        }
        if ('dx' in options) dx = options.dx;
        if ('dy' in options) dy = options.dy;
        pageX = (options.pageX == null ? pageX : options.pageX) + dx;
        pageY = (options.pageY == null ? pageY : options.pageY) + dy;
        clientX = pageX - window.pageXOffset;
        clientY = pageY - window.pageYOffset;
        var opts = {
            bubbles: options.bubbles || true,
            cancelable: options.cancelable || true,
            view: options.view || target.ownerDocument.defaultView,
            detail: options.detail || 1,
            pageX: pageX,
            pageY: pageY,
            clientX: clientX,
            clientY: clientY,
            screenX: clientX + window.screenLeft,
            screenY: clientY + window.screenTop,
            ctrlKey: options.ctrlKey || false,
            altKey: options.altKey || false,
            shiftKey: options.shiftKey || false,
            metaKey: options.metaKey || false,
            button: options.button || 0,
            which: options.which || 1,
            relatedTarget: options.relatedTarget || null,
        }
        var evt;
        try {
          // Modern API supported by IE9+
          evt = new MouseEvent(type, opts);
        }
        catch (e) {
            // Old API still required by PhantomJS.
            evt = target.ownerDocument.createEvent('MouseEvents');
            evt.initMouseEvent(type, opts.bubbles, opts.cancelable, opts.view,
            opts.detail, opts.screenX, opts.screenY, opts.clientX, opts.clientY,
            opts.ctrlKey, opts.altKey, opts.shiftKey, opts.metaKey, opts.button,
            opts.relatedTarget);
        }
          target.dispatchEvent(evt);
        }
    }, function() {
      try {
        if (!$('.preview iframe').length) return;
        if (!$('.preview iframe')[0].contentWindow.see) return;
        if (!$('.ace_gutter-cell').length) return;
        // Simulate hovering over a program line.
        window._simulate('mouseover', $('.ace_gutter-cell')[2]);
        // Wait until hovering occurs.
        if ($('.debugfocus').length == 0) {
          return;
        } 
        if ($('.arrow').length == 0){
          return;
        }
        return {
          debugfocus: $('.debugfocus').length,
          arrows: $('.arrow').length
        };
      }
      catch(e) {
        return {poll: true, error: e};
      }
    }, function(err, result) {
      assert.ifError(err);
      // A line of code should be highlighted.
      assert.equal(1, result.debugfocus);
      assert.ok(result.arrows > 0);
      done();
    });
  });
  it('should be able to unhighlight lines when unhovered', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
        // Click on the triangle run button.
        $('#run').mousedown();
        $('#run').click();
    }, function() {
        try {
          if (!$('.preview iframe').length) return;
          if (!$('.preview iframe')[0].contentWindow.see) return;
          if (!$('.ace_gutter-cell').length) return;
          // Have the mouse hover over the program line.
          window._simulate('mouseover', $('.ace_gutter-cell')[0]);
          // Have the mouse move away from the program line.
          window._simulate('mouseout', $('.ace_gutter-cell')[0]);
          // Wait until mouse moves away from the program line.
          if ($('.debugfocus').length != 0) {
            return;
          }
          return {
            debugfocus: $('.debugfocus').length,
          };
        }
         catch(e) {
          return {poll: true, error: e};
        }
       }, function(err, result) {
         assert.ifError(err);
         // A line of code should not be highlighted.
         assert.equal(0, result.debugfocus);
         done();
      });
  });
  it('should not trace commands in the test panel', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
        // Click on the square stop button.
        $('#stop').mousedown();
        $('#stop').click();
    }, function() {
        try {
          if (!$('.preview iframe').length) return;
          if (!$('.preview iframe')[0].contentWindow.see) return;
          // Keep track of the currently traced line.
          var curr_trace = $('.debugtrace').css('top');
          // Evaluate some expression in the coffeescript window.
          var seval = $('.preview iframe')[0].contentWindow.see.eval;
          seval('interrupt("reset")');
          seval('fd 100');
          return {
            originaltrace: curr_trace,
            debugtracecount: $('.debugtrace').length,
            debugtracetop: $('.debugtrace').css('top')
          };
        }
        catch(e) {
          return {poll: true, error: e};
        }
       }, function(err, result) {
         assert.ifError(err);
         // The same line should still be traced.
         assert.equal(parseInt(result.originaltrace), parseInt(result.debugtracetop));
         done();
    });
  });
 it('should show debugger when running code that loops', function(done) {
   asyncTest(_page, one_step_timeout, null, function() {
          // Click on the square stop button.
          $('#run').mousedown();
          $('#run').click();
      }, function() {
          try {
            if (!$('.preview iframe').length) return;
            if (!$('.preview iframe')[0].contentWindow.see) return;
            var slider = $(".scrubber").length
            if (slider === 0) {
              return;
            }
            return {
              slider: slider
            };
          }
          catch(e) {
            return {poll: true, error: e};
          }
         }, function(err, result) {
           assert.ifError(err);
           assert.equal(1, result.slider);
           done();
      });
  });
  it('should show trace when interacting with debugger in block mode', function(done) {
   asyncTest(_page, one_step_timeout, null, function() {
          // Click on the square stop button.
          // Note: this is the block mode test
          $('#run').mousedown();
          $('#run').click();
      }, function() {
          try {
            if (!$('.preview iframe').length) return;
            if (!$('.preview iframe')[0].contentWindow.see) return;
            else{
              return {
                debugtracecount: $(".debugtrace").length
              };
            }
          }
          catch(e) {
            return {poll: true, error: e};
          }
         }, function(err, result) {
           assert.ifError(err);
           assert.equal(1, result.debugtracecount);
           done();
      });
  });
  it('should show trace when interacting with debugger in text mode', function(done) {
   asyncTest(_page, one_step_timeout, null, function() {
          // Click on the square stop button.
          $('#run').mousedown();
          $('#run').click();
      }, function() {
          try {
            // click to transition from block to text mode
            $('.slide').click()
            if (!$('.preview iframe').length) return;
            if (!$('.preview iframe')[0].contentWindow.see) return;
            if (!$(".debugtraceprev").length) return;
            if (!$('.debugtraceprev').length) return;
            else{
              return {
                debugtracecount: $(".debugtrace").length,
                debugtraceprevcount: $(".debugtraceprev").length
              };
            }
          }
          catch(e) {
            return {poll: true, error: e};
          }
         }, function(err, result) {
           assert.ifError(err);
           assert.equal(1, result.debugtracecount);
           assert.equal(1, result.debugtraceprevcount);
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