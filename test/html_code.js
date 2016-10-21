var phantom = require('node-phantom-simple'),
    phantomjs = require('phantomjs-prebuilt'),
    assert = require('assert'),
    testutil = require('./lib/testutil'),
    one_step_timeout = 8000,
    asyncTest = testutil.asyncTest;

describe('html editor', function() {
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

  it('should serve static editor HTML', function(done) {
    // Visit the website of the user "livetest."
    _page.open('http://aaa.pencilcode.net.dev/edit/first.html',
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
      assert.ok(/^first.html/.test(result.filename));
      // Intentional: we should always add an extra empty line at the bottom.
      assert.equal(result.title, 'html');
      // The save button is enabled, because it's a new file.
      assert.equal(result.saved, false);
      done();
    });
  });
  it('should flip into block mode', function(done) {
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
      if (/html/.test(lefttitle.text())) return;
      return {
        filename: $('#filename').text(),
        title: lefttitle.text().trim(),
        saved: $('#save').prop('disabled')
      };
    }, function(err, result) {
      assert.ifError(err);
      // Filename is still shown and unchanged.
      assert.ok(/^first.html/.test(result.filename));
      // Intentional: we should always add an extra empty line at the bottom.
      assert.ok(/blocks/.test(result.title));
      // The save button is enabled, because it's a new file.
      assert.equal(result.saved, false);
      done();
    });
  });
  //Rename to a .coffee file
  var name = 'test' + ('' + Math.random()).substring(2) + '.coffee';
  it('should switch palette on filetype change', function(done) {
    asyncTest(_page, one_step_timeout, [name], function(name) {
      // Alter the editable filename and give up focus.
      $('#filename').text(name).focus().blur();
    }, function() {
      if (!$('.droplet-hover-div.tooltipstered')) return;
      return {
        //Content of first block in new mode
        text: $('.droplet-hover-div.tooltipstered').eq(0).tooltipster('content')
      }
    }, function(err, result) {
      assert.ifError(err);
      //First block should be that of coffeescript
      assert.equal(result.text, 'Move forward');
      done();
    });
  });
});
