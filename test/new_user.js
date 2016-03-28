var phantom = require('node-phantom-simple'),
    phantomjs = require('phantomjs'),
    assert = require('assert'),
    testutil = require('./lib/testutil'),
    one_step_timeout = 8000,
    refreshThen = testutil.refreshThen,
    asyncTest = testutil.asyncTest;

describe('new user', function() {
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
        // Set the size to a modern laptop size.
        page.set('viewportSize', { width: 1200, height: 900 }, function(err) {
          assert.ifError(err);
          // Point it to a blank page to start
          page.open('about:blank', function(err, status){
            assert.ifError(err);
            assert.equal(status,'success');
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
  it('should serve static editor HTML', function(done) {
    // Give a few milliseconds before opening this page: it seems
    // to help avoid crashing phantomjs.
    setTimeout(function() {
      // The #new hash is the magic signup URL: it should
      // show the "Create account" dialog.
      _page.open('http://pencilcode.net.dev/edit/intro#new',
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
    }, 100);
  });
  it('should load code', function(done) {
    asyncTest(_page, one_step_timeout, null, null, function() {
      // Poll until the element with class="editor" appears on the page.
      if (!$('.editor').length) return;
      // Poll until a dialog is shown.
      if (!$('.dialog').length) return;
      // Reach in and return the text that is shown within the editor.
      var ace_editor = ace.edit($('.droplet-ace')[0]);
      return {
        text: ace_editor.getSession().getValue(),
        active: document.activeElement &&
            document.activeElement.getAttribute('class'),
        preview: $('.preview').length,
        saved: $('#save').prop('disabled'),
        login: $('#login').length,
        logout: $('#logout').length
      };
    }, function(err, result) {
      assert.ifError(err);
      // The editor text should contain this line of code.
      assert.ok(/# Welcome/.test(result.text), 'Got ' + result.text);
      // The save button should not be disabled (even though unmodified).
      assert.equal(result.saved, false);
      // There should be one login button.
      assert.equal(result.login, 1);
      // There should be no logout buton.
      assert.equal(result.logout, 0);
      // The element with focus should NOT be the editor - it should be
      // the username field.
      assert.equal(result.active, 'username');
      done();
    });
  });
  it('should show login prompt when saving', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // We should not need to click on the save button:
      // The signup dialog should show already.
      // $('#save').click();
    }, function() {
      // Wait for the login dialog to pop up.
      if (!$('.dialog').is(':visible')) return;
      return {
        itext: $('.dialog .info').html(),
        udisabled: $('.username').is(':disabled'),
        uval: $('.username').val(),
        pdisabled: $('.password').is(':disabled'),
        pval: $('.password').val()
      };
    }, function(err, result) {
      assert.ifError(err);
      // The login dialog should link to terms of service and privacy policy.
      assert.ok(/href="[^"]*\/privacy.html\"/.test(result.itext));
      assert.ok(/href="[^"]*\/terms.html\"/.test(result.itext));
      // The username should be enabled and start empty.
      assert.equal(false, result.udisabled);
      assert.equal('', result.uval);
      // The password should be enabled and start empty.
      assert.equal(false, result.pdisabled);
      assert.equal('', result.pval);
      done();
    });
  });
  it('should reject a low-complexity username', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Enter a low-complexity username, and click OK.
      $('.username').val('zkkg');
      $('.username').trigger('keyup');
    }, function() {
      // Wait for the info prompt to show a message without "privacy.html"
      if (!$('.info').is(':visible')) return;
      if ($('.info').html().indexOf('privacy.html') >= 0) return;
      return {
        infotext: $('.info').text()
      };
    }, function(err, result) {
      assert.ifError(err);
      // The message should report that the password is wrong.
      assert.equal('Name \"zkkg\" reserved.', result.infotext);
      done();
    });
  });
  it('should reject a too-long username', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Enter a low-complexity username, and click OK.
      $('.username').val('thisusernameistwenty1');
      $('.username').trigger('keyup');
    }, function() {
      // Wait for the info prompt to show a message without "zkkg"
      if (!$('.info').is(':visible')) return;
      if ($('.info').text().match(/zkkg/)) return;
      if ($('.info').html().indexOf('privacy.html') >= 0) return;
      return {
        infotext: $('.info').text()
      };
    }, function(err, result) {
      assert.ifError(err);
      // The message should report that the password is wrong.
      assert.equal('Username too long.', result.infotext);
      done();
    });
  });
  it('should reject an email-looking username', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Enter a low-complexity username, and click OK.
      $('.username').val('bobatmitedu');
      $('.username').trigger('keyup');
    }, function() {
      // Wait for the info prompt to show a message without "too long"
      if (!$('.info').is(':visible')) return;
      if ($('.info').text().match(/too long/)) return;
      if ($('.info').html().indexOf('privacy.html') >= 0) return;
      return {
        infotext: $('.info').text()
      };
    }, function(err, result) {
      assert.ifError(err);
      // The message should report that the password is wrong.
      assert.equal('Name should not end with "edu".', result.infotext);
      done();
    });
  });
  it('should accept an OK username', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Enter the correct password, and click OK again.
      $('.username').val('zkgtest');
      $('.username').trigger('keyup');
    }, function() {
      // Wait for the info prompt to show a message without "zkkg"
      if (!$('.info').is(':visible')) return;
      if ($('.info').text().match(/zkkg/)) return;
      if ($('.info').html().indexOf('privacy.html') >= 0) return;
      return {
        infotext: $('.info').text()
      };
    }, function(err, result) {
      assert.ifError(err);
      // The butterbar should show that the document is saved.
      assert.ok(/Will create zkgtest/.test(result.infotext));
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
