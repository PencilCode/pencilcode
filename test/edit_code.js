var phantom = require('node-phantom-simple'),
    phantomjs = require('phantomjs'),
    assert = require('assert'),
    testutil = require('./lib/testutil'),
    one_step_timeout = 8000,
    refreshThen = testutil.refreshThen,
    asyncTest = testutil.asyncTest;

describe('code editor', function() {
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
    // Navigate to see the editor for the program named "first".
    _page.open('http://livetest.pencilcode.net.dev/edit/first',
        function(err, status) {
      assert.ifError(err);
      assert.equal(status, 'success');
      asyncTest(_page, one_step_timeout, null, null, function() {
        // Poll until the element with class="editor" appears on the page.
        if (!$('.editor').length) return;
        // Reach in and return the text that is shown within the editor.
        var ace_editor = ace.edit($('.ice-ace')[0]);
        return {
          text: ace_editor.getSession().getValue()
        };
      }, function(err, result) {
        assert.ifError(err);
        // The editor text should contain this line of code.
        assert.ok(/pen red/.test(result.text));
        done();
      });
    });
  });
  it('should navigate to parent dir', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Click on the folder icon.
      $('#folder').click();
    }, function() {
      // Wait for both the directory div and the create link to appear.
      if (!$('.directory').length) return;
      if (!$('.create').length) return;
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
  it('should be able to start a new file', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Click on the "Create new program" link.
      $('.create').click();
    }, function() {
      // The panes will scroll horizontally.  Look for a panetitle that
      // is up against the left edge.
      var lefttitle = $('.panetitle').filter(
          function() { return $(this).position().left == 0; }).find('.panetitle-text');
      // Wait for this title to say "code" in it.
      if (!lefttitle.length || !/code/.test(lefttitle.text())) return;
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
      // The title should say code
      assert.equal('> code', result.title);
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
  it('should show the login dialog when login is pressed', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Click on the login button.
      $('#login').click();
    }, function() {
      // Wait for the login dialog to be visible.
      if (!$('.dialog').is(':visible')) return;
      return {
        udisabled: $('.username').is(':disabled'),
        uval: $('.username').val(),
        pdisabled: $('.password').is(':disabled'),
        pval: $('.password').val()
      };
    }, function(err, result) {
      assert.ifError(err);
      // Username should be disabled and show the current username.
      assert.equal(true, result.udisabled);
      assert.equal('livetest', result.uval);
      // Password should be enabled and start blank.
      assert.equal(false, result.pdisabled);
      assert.equal('', result.pval);
      done();
    });
  });
  it('should login using a numeric hashed password', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Enter the 3-digit hash of the actual password, and click OK.
      $('.password').val('123');
      $('.ok').click();
    }, function() {
      // Wait for the overlay to be dismissed.
      if ($('#overlay').is(':visible')) return;
      return {
        notifytext: $('#notification').text(),
        saved: $('#save').prop('disabled'),
        cookie: document.cookie
      };
    }, function(err, result) {
      assert.ifError(err);
      // The login should be accepted.
      assert.equal('Logged in as livetest.', result.notifytext);
      // The save button should be disabled.
      assert.equal(true, result.saved);
      // The login cookie should be present.
      assert.ok(/login=/.test, result.cookie);
      done();
    });
  });
  it('should enable the save button after editing a program', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Modify the text in the editor.
      var ace_editor = ace.edit($('.ice-ace')[0]);
      $('.editor').mousedown();
      ace_editor.getSession().setValue("speed 10\npen blue\nrt 180, 100");
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
      // Intentional: we should always add an extra empty line at the bottom.
      assert.equal("speed 10\npen blue\nrt 180, 100\n", result.text);
      // Preview is still shown.
      assert.equal(1, result.preview);
      // The save button is no longer disabled, because the doc is dirty.
      assert.equal(false, result.saved);
      done();
    });
  });
  it('should be able to run the program', function(done) {
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
        if (!seval('direction()')) return;
        if (seval('turtle.queue().length')) return;
        return {
          direction: seval('direction()'),
          getxy: seval('getxy()'),
          touchesred: seval('touches red'),
          touchesblue: seval('touches blue'),
          queuelen: seval('turtle.queue().length')
        };
      }
      catch(e) {
        return {poll: true, error: e};
      }
    }, function(err, result) {
      assert.ifError(err);
      // The turtle should be pointing down at the end of the run.
      assert.equal(180, result.direction);
      // The turtle should be near the point (200, 0).
      assert.ok(Math.abs(result.getxy[0] - 200) < 1e-6);
      assert.ok(Math.abs(result.getxy[1] - 0) < 1e-6);
      // The turtle should not be touching any red pixels.
      assert.equal(false, result.touchesred);
      // The turtle should be touching blue pixels that it drew.
      assert.equal(true, result.touchesblue);
      // There should be no further animations on the turtle queue.
      assert.equal(0, result.queuelen);
      done();
    });
  });
  var name = 'test' + ('' + Math.random()).substring(2);
  it('should be able to set the name of the file', function(done) {
    asyncTest(_page, one_step_timeout, [name], function(name) {
      // Alter the editable filename and give up focus.
      $('#filename').text(name).focus().blur();
    }, function() {
      try {
        // Wait for the notifcation butter bar to show
        if (!$('#notification').is(':visible')) return;
        var lefttitle = $('.panetitle').filter(
            function() { return $(this).position().left == 0; }).find('.panetitle-text');
        return {
          notification: $('#notification').text(),
          lefttitle: lefttitle.text(),
          url: window.location.href
        };
      }
      catch(e) {
        return {error: e};
      }
    }, function(err, result) {
      assert.ifError(err);
      // The butter bar should show the new name.
      assert.equal(result.notification, 'Using name ' + name + '.');
      // The editor title should say 'code'
      assert.equal(result.lefttitle, '> code');
      // The url should reflect the new name.
      assert.equal(result.url,
          'http://livetest.pencilcode.net.dev/edit/' + name);
      done();
    });
  });
  it('should log out when logout is pressed', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Click the logout button.
      $('#logout').mousedown();
      $('#logout').click();
    }, function() {
      // Wait for the butterbar to show.
      if (!$('#notification').is(':visible')) return;
      return {
        notifytext: $('#notification').text(),
        login: $('#login').is(':visible'),
        cookie: document.cookie
      };
    }, function(err, result) {
      assert.ifError(err);
      // The butterbar should report the logout.
      assert.equal("Logged out.", result.notifytext);
      // The login button should be showing.
      assert.ok(result.login);
      // The login cookie should be gone.
      assert.ok(!/login=/.test(result.cookie));
      done();
    });
  });
  it('should show login prompt when saving', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Click on the save button.
      $('#save').click();
    }, function() {
      // Wait for the login dialog to pop up.
      if (!$('.dialog').is(':visible')) return;
      return {
        udisabled: $('.username').is(':disabled'),
        uval: $('.username').val(),
        pdisabled: $('.password').is(':disabled'),
        pval: $('.password').val()
      };
    }, function(err, result) {
      assert.ifError(err);
      // The username should be disabled and show the current username.
      assert.equal(true, result.udisabled);
      assert.equal('livetest', result.uval);
      // The password should not be disable and should start blank.
      assert.equal(false, result.pdisabled);
      assert.equal('', result.pval);
      done();
    });
  });
  it('should reject the wrong password', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Enter an incorrect password, and click OK.
      $('.password').val('wrong');
      $('.ok').click();
    }, function() {
      // Wait for the info prompt to show a message without "...".
      if (!$('.info').is(':visible')) return;
      if ($('.info').text().match(/\.\.\./)) return;
      return {
        infotext: $('.info').text()
      };
    }, function(err, result) {
      assert.ifError(err);
      // The message should report that the password is wrong.
      assert.equal('Wrong password.', result.infotext);
      done();
    });
  });
  it('should accept the right password', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Fill the textarea with some code to ensure
      // we do not get "deleted" message.
      var ace_editor = ace.edit($('.ice-ace')[0]);
      
      ace_editor.getSession().setValue("speed 10\npen blue\nrt 180, 100");

      // Enter the correct password, and click OK again.
      $('.password').val('test');
      $('.ok').click();
    }, function() {
      // Wait for the overlay to be dismissed.
      if ($('#overlay').is(':visible')) return;
      return {
        notifytext: $('#notification').text()
      };
    }, function(err, result) {
      assert.ifError(err);
      // The butterbar should show that the document is saved.
      assert.equal('Saved.', result.notifytext);
      done();
    });
  });
  it('should reload using the cookie when refreshed', function(done) {
    refreshThen(_page, function() {
      // Now test the save and the login cookie by refreshing the page.
      asyncTest(_page, one_step_timeout, null, null, function() {
        if (!window.$) return;
        if (!$('.editor').is(':visible')) return;
        var ace_editor = ace.edit($('.ice-ace')[0]);
        if (!ace_editor.getValue()) return;
        return {
          url: window.location.href,
          loaded: ace_editor.getValue(),
          login: $('#login').is(':visible'),
          logout: $('#logout').is(':visible'),
          cookie: document.cookie
        };
      }, function(err, result) {
        assert.ifError(err);
        // The url should have the chosen name.
        assert.equal(result.url,
            'http://livetest.pencilcode.net.dev/edit/' + name);
        // The editor text should be the last saved program.
        assert.equal("speed 10\npen blue\nrt 180, 100\n", result.loaded);
        // The login button should not be shown.
        assert.equal(false, result.login);
        // The logout button should be shown.
        assert.equal(true, result.logout);
        // The login cookie should be present.
        assert.ok(/login=/.test(result.cookie));
        done();
      });
    });
  });
  it('should delete when empty is saved', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Delete all the text in the editor!
        var ace_editor = ace.edit($('.ice-ace')[0]);
      ace_editor.getSession().setValue('');
      // Then click the save button.
      $('#save').mousedown();
      $('#save').click();
    }, function() {
      // Wait for a notification message other than the loading animation.
      if (!$('#notification').is(':visible')) return;
      if ($('#notification').hasClass('loading')) return;
      // Also wait for a title to slide into the left position.
      var lefttitle = $('.panetitle').filter(
          function() { return $(this).position().left == 0; });
      // Wait for the title of the left pane to contain "dir".
      if (!lefttitle.length || !/dir/.test(lefttitle.text())) return;
      return {
        notifytext: $('#notification').text(),
        login: $('#login').is(':visible'),
        logout: $('#logout').is(':visible'),
        title: lefttitle.text()
      };
    }, function(err, result) {
      assert.ifError(err);
      // The butterbar should report that the file is deleted.
      assert.equal("Deleted " + name + ".", result.notifytext);
      // The login button should not be shown.
      assert.ok(!result.login);
      // The logout button should be shown.
      assert.ok(result.logout);
      // And the file should not be shown: instead the parent directory.
      assert.equal("directory", result.title.trim());
      done();
    });
  });
  it('should log out when logout is pressed', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Click the log out button again.
      $('#logout').mousedown();
      $('#logout').click();
    }, function() {
      // Wait for a notification message.
      if (!$('#notification').is(':visible')) return;
      return {
        notifytext: $('#notification').text(),
        login: $('#login').is(':visible'),
        cookie: document.cookie
      };
    }, function(err, result) {
      assert.ifError(err);
      // Verify that it reports the logout.
      assert.equal("Logged out.", result.notifytext);
      // The login button should be shown.
      assert.ok(result.login);
      // The login cookie should be gone.
      assert.ok(!/login=/.test(result.cookie));
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
