var phantom = require('node-phantom-simple'),
    phantomjs = require('phantomjs'),
    assert = require('assert');

function pollPage(page, timeout, predicate, callback) {
  var startTime = +(new Date);
  (function retry() {
    page.evaluate(predicate, function(err, result) {
      if (err) {
        callback(err);
      } else if (result !== undefined && result !== null) {
        callback(err, result);
      } else if (+(new Date) - startTime > timeout) {
        throw (new Error('timeout'));
      } else {
        setTimeout(retry, 100);
      }
    });
  })();
}

describe('browse users in edit mode', function() {
  var _ph, _page;
  before(function(done) {
    phantom.create(function(error, ph) {
      assert.ifError(error);
      _ph = ph;
      _ph.createPage(function(err, page) {
        _page = page;
        page.open('about:blank', function(err, status){
          assert.ifError(err);
          assert.equal(status,'success');
          done();
        });
      });
    }, {
      phantomPath: phantomjs.path,
      parameters: {proxy: '127.0.0.1:8193', 'local-storage-quota': 0}
    });
  });
  after(function() {
    _ph.exit();
  });
  it('can open', function(done) {
    _page.open('http://pencilcode.net.dev/edit/', function(err, status){
      assert.ifError(err);
      assert.equal(status, 'success');
      done();
    });
  });
  it('should have lots of users', function(done) {
    pollPage(_page, 5000, function() {
      if (!$('.directory').length) return;
      var dirs = [];
      $('.directory a').each(function() { dirs.push($(this).text()); });
      return dirs.join(' ');
    }, function(err, result) {
      assert.ifError(err);
      assert.ok(result.split(' ').length > 100);
      done();
    });
  });
  it('should list users in alpha order', function(done) {
    pollPage(_page, 5000, function() {
      var dirs = [];
      $('#byname').click();
      $('.directory a').each(function() { dirs.push($(this).text()); });
      return dirs.join(' ');
    }, function(err, result) {
      assert.ifError(err);
      assert.ok(/ abc123 .* cody .* david .* guide .* piper .* zog /
          .test(result));
      done();
    });
  });
  it('should list users in date order', function(done) {
    pollPage(_page, 5000, function() {
      var dirs = [];
      $('#bydate').click();
      $('.directory a').each(function() { dirs.push($(this).text()); });
      var r = dirs.join(' ');
      if (!/ david .* abc123 /.test(r)) return null;
      return r;
    }, function(err, result) {
      assert.ifError(err);
      assert.ok(/ david .* abc123 /
          .test(result));
      done();
    });
  });
});
