var phantom = require('node-phantom-simple'),
    phantomjs = require('phantomjs'),
    assert = require('assert'),
    testutil = require('./lib/testutil'),
    one_step_timeout = 8000,
    extended_timeout = 30000,
    refreshThen = testutil.refreshThen,
    asyncTest = testutil.asyncTest;

describe('wait_code', function() {
  var _ph, _page;
  before(function(done) {
    // Create the headless webkit browser.
    phantom.create({
      path: phantomjs.path,
      parameters: {
        // Use the test server as a proxy server, so that all requests
        // go to this server (instead of trying real DNS lookups).
        proxy: '127.0.0.1:8193',
        // Set the disk storage to zero to avoid persisting localStorage
        // between test runs.
        'local-storage-quota': 0
      }
    }, function(error, ph) {
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
    });
  });
  after(function() {
    // Be sure to kill the browser when the test is done, or else
    // we can leave orphan processes.
    _ph.exit();
  });
  it('should load code', function(done) {
    // Navigate to the directory of the 'livetest' user.
    _page.open('http://livetest.pencilcode.net.dev/edit/',
        function(err, status) {
      assert.ifError(err);
      assert.equal(status, 'success');
      asyncTest(_page, one_step_timeout, null, function() {
        addEventListener('error', function(e) { window.lasterrorevent = e; });
      }, function() {
        var lefttitle = $('.panetitle').filter(
            function() {
              return $(this).parent().position().left == 0;
            }).find('.panetitle-text');
        if (!lefttitle.length || !/dir/.test(lefttitle.text())) return;
        // Wait for both the directory div and the create link to appear.
        if (!$('.directory').length) return {poll:true, step:1,
          msg: window.lasterrorevent && window.lasterrorevent.message,
          fn: window.lasterrorevent && window.lasterrorevent.filename,
          line: window.lasterrorevent && window.lasterrorevent.lineno
        };
        if (!$('.create').length) return {poll:true, step:2,
          msg: window.lasterrorevent && window.lasterrorevent.message,
          fn: window.lasterrorevent && window.lasterrorevent.filename,
          line: window.lasterrorevent && window.lasterrorevent.lineno
        };
        // Race condition: also wait for 'first' to vanish from filename
        if (/first/.test($('#filename').text())) return {
          poll: true, step:3,
          filename: $('#filename').text(),
          msg: window.lasterrorevent && window.lasterrorevent.message,
          fn: window.lasterrorevent && window.lasterrorevent.filename,
          line: window.lasterrorevent && window.lasterrorevent.lineno
        };
        // Return an array of all the link text within the directory listing.
        var dirs = []
        $('.directory a').each(function() { dirs.push($(this).text()); });
        return dirs;
      }, function(err, result) {
        assert.ifError(err);
        // Verity that the name "first" appears within the listing.
        assert.ok(result.indexOf('first') >= 0);
        done();
      });
    });
  });
  it('should be able to start a new file', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Click on the "Create new program" link.
      $('.create').click();
    }, function() {
      // TODO: debug - not sure why we need to wait until here for first
      // to vanish from filename field.
      // if (/first/.test($('#filename').text())) return;
      // The panes will scroll horizontally.  Look for a panetitle that
      // is up against the left edge.
      var lefttitle = $('.panetitle').filter(
          function() {
            return $(this).parent().position().left == 0;
          }).find('.panetitle-text');
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
    }, function(err, result) {
      assert.ifError(err);
      // The filename chosen should start with the word "untitled"
      assert.ok(/^untitled/.test(result.filename), result.filename);
      // The title should say blocks
      assert.equal(result.title, 'blocks');
      // The program text should be empty.
      assert.equal(result.text, '');
      // The element with active focus should be the editable filename.
      assert.equal(result.activeid, 'filename');
      // There should be a visible preview div.
      assert.equal(result.preview, 1);
      // There sould be a login button.
      assert.ok(result.login);
      // There sould be no logout button.
      assert.ok(!result.logout);
      // The "save" button should be enabled only if not logged in.
      assert.equal(result.logout, result.saved);
      done();
    });
  });
  it('should flip into code mode', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Click on the "blocks" button
      var leftlink = $('.panetitle').filter(
          function() { return $(this).parent().position().left == 0; })
          .find('a');
      leftlink.click();
    }, function() {
      var lefttitle = $('.panetitle').filter(
          function() { return $(this).parent().position().left == 0; })
          .find('.panetitle-text');
      if (/blocks/.test(lefttitle.text())) return;
      return {
        filename: $('#filename').text(),
        title: lefttitle.text().trim(),
        saved: $('#save').prop('disabled')
      };
    }, function(err, result) {
      assert.ifError(err);
      // Filename is still shown and unchanged.
      assert.ok(/^untitled/.test(result.filename));
      // Intentional: we should always add an extra empty line at the bottom.
      assert.equal(result.title, 'code');
      // The save button is still enabled, because the user isn't logged in.
      assert.equal(result.saved, false);
      done();
    });
  });
  it('should be able to enter a program with await', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Modify the text in the editor.
      var ace_editor = ace.edit($('.droplet-ace')[0]);
      $('.editor').mousedown();
      ace_editor.getSession().setValue(
          "while true\n" +
          "  await read 'your question?', defer x\n" +
          "  if (x.match /who/)\n" +
          "    write 'Fred is my name.'\n");
    }, function() {
      var ace_editor = ace.edit($('.droplet-ace')[0]);
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
      // Intentional: trim the added extra empty line at the bottom.
      assert.equal(result.text.replace(/\n$/, ''),
          "while true\n" +
          "  await read 'your question?', defer x\n" +
          "  if (x.match /who/)\n" +
          "    write 'Fred is my name.'");
      // Preview is still shown.
      assert.equal(result.preview, 1);
      // The save button is no longer disabled, because the doc is dirty.
      assert.equal(result.saved, false);
      done();
    });
  });
  it('should be able to run a program with await', function(done) {
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
        if (!seval('$("label").text()')) return;
        return {
          getxy: seval('getxy()'),
          label: seval('$("label").text()'),
          queuelen: seval('turtle.queue().length')
        };
      }
      catch(e) {
        return {poll: true, error: e};
      }
    }, function(err, result) {
      assert.ifError(err);
      // There should be a question on the screen
      assert.ok(/question/.test(result.label));
      // The turtle should be near the point (0, 0).
      assert.ok(Math.abs(result.getxy[0]) < 1e-6);
      assert.ok(Math.abs(result.getxy[1]) < 1e-6);
      // There should be no further animations on the turtle queue.
      assert.equal(result.queuelen, 0);
      done();
    });
  });
  it('should be able to interact with text input', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Click on the triangle run button.
      var seval = $('.preview iframe')[0].contentWindow.see.eval;
      seval("$('.turtleinput').val('computer, who are you?')");
      seval("$('label button').click()");
    }, function() {
      try {
        // The preview frame should be showing...
        if (!$('.preview iframe')[0].contentWindow.see) return;
        // Evaluate some expression in the coffeescript evaluation window.
        var seval = $('.preview iframe')[0].contentWindow.see.eval;
        // Wait for a div to be printed out
        if (!seval('$("div").length')) return;
        return {
          divtext: seval('$("div").text()'),
          labellen: seval('$("label").length'),
          firstlabel: seval('$("label").eq(0).text()'),
          lastlabel: seval('$("label").eq(-1).text()'),
          inputlen: seval('$(".turtleinput").length'),
          queuelen: seval('turtle.queue().length')
        };
      }
      catch(e) {
        return {poll: true, error: e};
      }
    }, function(err, result) {
      assert.ifError(err);
      // We should have the answer showing.
      assert.equal('Fred is my name.', result.divtext);
      // The question should be inside the first label
      assert.equal('your question?\xA0computer, who are you?',
          result.firstlabel);
      // There should be a question in the second label
      assert.equal(result.labellen, 2);
      assert.ok(/question/.test(result.lastlabel));
      assert.ok(!/who/.test(result.lastlabel));
      // There should be an input on the screen.
      assert.equal(result.inputlen, 1);
      // There should be no further animations on the turtle queue.
      assert.equal(result.queuelen, 0);
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
