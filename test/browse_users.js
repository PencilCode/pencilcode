var phantom = require('node-phantom-simple'),
    phantomjs = require('phantomjs-prebuilt'),
    http = require('http'),
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
    phantom.create({
      path: phantomjs.path,
      parameters: {proxy: '127.0.0.1:8193', 'local-storage-quota': 0}
    }, function(error, ph) {
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
    });
  });
  after(function() {
    _ph.exit();
  });
  it('responds to a touch', function(done) {
    // Touch the "z" user so that it should be chronologically first.
    http.get({
      host: '127.0.0.1',
      headers: { Host: 'zzz.pencilcode.net.dev' },
      port: 8193,
      path: '/save/touch?data=x'
    }, function(resp) {
      assert.equal(resp.statusCode, 200);
      done();
    }).on('error', function(e) {
      console.log('error', e);
    });
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
      assert.ok(result.split(' ').length > 1);
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
      assert.ok(/aaa .*bbb .*ccc .*livetest .*zzz/
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
      if (!/zzz .*b/.test(r)) return null;
      return r;
    }, function(err, result) {
      assert.ifError(err);
      assert.ok(/z .*b/
          .test(result));
      done();
    });
  });
  // it('should show default thumbnail for user aaa', function(done) {
  //   pollPage(_page, 5000, function() {
  //     return $('img.thumbnail[alt="aaa"]').attr('src');
  //   }, function(err, result) {
  //     assert.ifError(err);
  //     assert.ok(result.indexOf('/image/user-128.png') >= 0);
  //     done();
  //   });
  // });
});
