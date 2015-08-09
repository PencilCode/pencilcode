var phantom = require('node-phantom-simple'),
  phantomjs = require('phantomjs'),
  assert = require('assert'),
  testutil = require('./lib/testutil'),
  asyncTest = testutil.asyncTest,
  one_step_timeout = 10000,
  extended_timeout = 70000;

describe('filter textfield', function () {
  var _ph, _page;
  beforeEach(function (done) {
    // Create the headless webkit browser.
    phantom.create(function (error, ph) {
      assert.ifError(error);
      // Open a page for browsing.
      _ph = ph;
      _ph.createPage(function (err, page) {
        _page = page;
        page.onConsoleMessage = function (msg) {
          console.log(msg);
        }
        // Set the size to a modern laptop size.
        page.set('viewportSize', {width: 1200, height: 900}, function (err) {
          assert.ifError(err);
          // Point it to a blank page to start
          page.open('about:blank', function (err, status) {
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
  after(function () {
    // Be sure to kill the browser when the test is done, or else
    // we can leave orphan processes.
    _ph.exit();
  });

  describe('in root directory', function () {
    it('should filter the content by prefix', function (done) {
      _page.set('viewportSize', {width: 100, height: 200}, function (err) {
        assert.ifError(err);
        _page.open(
          'http://pencilcode.net.dev/edit/',
          function (err, status) {
            assert.ifError(err);
            assert.equal(status, 'success');
            asyncTest(
              _page, extended_timeout, null,
              function () {
              },
              function () {
                var result = this;
                result.filterPrefix = 's';
                if (!$('.directory').length)
                  return;

                //Identifying the links in the directory
                var list = [];
                $('.directory a').each(function () {
                  var label = $(this).text();
                  if (!label) {
                    return;
                  }
                  list.push(label);
                });

                if (!result.before) {
                  result.before = list;

                  //Type the prefix in filter bar
                  $('input.search-toggle').val(result.filterPrefix);
                  $('input.search-toggle').keyup();
                  return;
                } else {
                  result.after = list;
                }

                //Checking whether the filter result has been updated
                if (result.after) {
                  result.filterBarIsDisplayed = $('input.search-toggle').is(':visible');
                  result.filterBarText = $('input.search-toggle').val();
                  return result;
                }
                return null;
              },
              function (err, result) {
                assert.ifError(err);

                //Checking whether the filter result has the filtered prefix
                for (var x = 0; x < result.after.length; x++) {
                  assert.equal(0, result.after[x].indexOf(result.filterPrefix), result.after[x] + " does not have the prefix '" + result.filterPrefix + "'");
                }

                assert.equal(result.filterPrefix, result.filterBarText, "filter bar prefix should be remain even after the result has been updated");
                assert.ok(result.filterBarIsDisplayed, 'filter bar should not disappear after filtering');
                done();
              });
          });
      });
    });


    it('should show the filter bar when the scroll bars are needed', function (done) {
      _page.set('viewportSize', {width: 100, height: 50}, function (err) {
        assert.ifError(err);
        _page.open(
          'http://pencilcode.net.dev/edit/',
          function (err, status) {
            assert.ifError(err);
            assert.equal(status, 'success');
            asyncTest(
              _page, extended_timeout, null,
              function () {
              },
              function () {
                if (!$('.directory').length)
                  return;
                
                var result = this;
                result.filterBarIsDisplayed = $('input.search-toggle').is(':visible');
                return result;
              },
              function (err, result) {
                assert.ifError(err);
                assert.equal(true, result.filterBarIsDisplayed);
                done();
              });
          });
      });
    });
    it('should hide the filter bar when the scroll bars are not needed', function (done) {
      _page.set('viewportSize', {width: 1200, height: 1500}, function (err) {
        assert.ifError(err);
        _page.open(
          'http://pencilcode.net.dev/edit/',
          function (err, status) {
            assert.ifError(err);
            assert.equal(status, 'success');
            asyncTest(
              _page, extended_timeout, null,
              function () {
              },
              function () {
                if (!$('.directory').length)
                  return;
                
                var result = this;
                result.filterBarIsDisplayed = $('input.search-toggle').is(':visible');
                return result;
              },
              function (err, result) {
                assert.ifError(err);
                assert.equal(false, result.filterBarIsDisplayed);
                done();
              });
          });
      });
    });
  });

  describe('in user directory', function () {
    it('should filter the content by prefix', function (done) {
      _page.set('viewportSize', {width: 100, height: 200}, function (err) {
        assert.ifError(err);
        _page.open(
          'http://livetest.pencilcode.net.dev/edit/',
          function (err, status) {
            assert.ifError(err);
            assert.equal(status, 'success');
            asyncTest(
              _page, extended_timeout, null,
              function () {
                $('.thumb-toggle').click();
              },
              function () {
                var result = this;
                result.filterPrefix = 's';
                if (!$('.directory').length)
                  return;

                //Identifying the links in the directory
                var list = [];
                $('.directory a span').each(function () {
                  var label = $(this).text();
                  if (!label) {
                    return;
                  }
                  list.push(label);
                });

                if (!result.before) {
                  result.before = list;

                  //Type the prefix in filter bar
                  $('input.search-toggle').val(result.filterPrefix);
                  $('input.search-toggle').keyup();
                  return;
                } else {
                  result.after = list;
                }

                //Checking whether the filter result has been updated
                if (result.after) {
                  result.filterBarIsDisplayed = $('input.search-toggle').is(':visible');
                  result.filterBarText = $('input.search-toggle').val();
                  return result;
                }
                return null;
              },
              function (err, result) {
                assert.ifError(err);
                assert.equal("New file", result.after[result.after.length - 1], "Last link should be 'New file'");

                //Checking whether the filter result has the filtered prefix
                for (var x = 0; x < result.after.length - 1; x++) {
                  assert.equal(0, result.after[x].indexOf(result.filterPrefix), result.after[x] + " does not have the prefix '" + result.filterPrefix + "'");
                }

                assert.equal(result.filterPrefix, result.filterBarText, "filter bar prefix should be remain even after the result has been updated");
                assert.ok(result.filterBarIsDisplayed, 'filter bar should not disappear after filtering');
                done();
              });
          });
      });
    });
    it('should hide the filter bar when the scroll bars are needed', function (done) {
      _page.set('viewportSize', {width: 100, height: 50}, function (err) {
        assert.ifError(err);
        _page.open(
          'http://livetest.pencilcode.net.dev/edit/',
          function (err, status) {
            assert.ifError(err);
            assert.equal(status, 'success');
            asyncTest(
              _page, extended_timeout, null,
              function () {
//                $('.thumb-toggle').click();
              },
              function () {
                var result = this;
                result.filterBarIsDisplayed = $('input.search-toggle').is(':visible');
                return result;
              },
              function (err, result) {
                assert.ifError(err);
                assert.equal(true, result.filterBarIsDisplayed);
                done();
              });
          });
      });
    });
    it('should hide the filter bar when the scroll bars are not needed', function (done) {
      _page.set('viewportSize', {width: 1200, height: 1500}, function (err) {
        assert.ifError(err);
        _page.open(
          'http://livetest.pencilcode.net.dev/edit/',
          function (err, status) {
            assert.ifError(err);
            assert.equal(status, 'success');
            asyncTest(
              _page, extended_timeout, null,
              function () {
//                $('.thumb-toggle').click();
              },
              function () {
                var result = this;
                result.filterBarIsDisplayed = $('input.search-toggle').is(':visible');
                return result;
              },
              function (err, result) {
                assert.ifError(err);
                assert.equal(false, result.filterBarIsDisplayed);
                done();
              });
          });
      });
    });
  });







});
