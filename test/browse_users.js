var chai = require('chai'),
    expect = chai.expect,
    assert = chai.assert,
    http = require('http'),
    testutil = require('./lib/testutil'),
    startChrome = testutil.startChrome,
    pollScript = testutil.pollScript;
chai.use(require('chai-as-promised'));

describe('browse users in edit mode', function() {
  var _driver;
  before(function() {
    _driver = startChrome();
  });
  after(function() {
    _driver.quit();
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

  it('can open', function() {
    return _driver.get('http://pencilcode.net.dev/edit/')
  });

  it('should have lots of users', function() {
    pollScript(_driver, function() {
      if (document.querySelector('.directory') == null) return;
      var dirs = [];
      $('.directory a').each(function() { dirs.push($(this).text()); });
      return dirs.join(' ');
    }).then(function (result) {
      assert.isOk(result.split(' ').length > 1);
    });
    return _driver;
  });

  it('should list users in alpha order', function() {
    pollScript(_driver, function() {
      var dirs = [];
      if (document.querySelector('#byname') == null) return;
      $('#byname').click();
      $('.directory a').each(function() { dirs.push($(this).text()); });
      return dirs.join(' ');
    }).then(function (result) {
      assert.isOk(/aaa .*bbb .*ccc .*livetest .*zzz/
          .test(result));
    });
    return _driver;
  });

  it('should list users in date order', function() {
    pollScript(_driver, function() {
      var dirs = [];
      if (document.querySelector('#bydate') == null) return;
      $('#bydate').click();
      $('.directory a').each(function() { dirs.push($(this).text()); });
      var r = dirs.join(' ');
      if (!/zzz .*b/.test(r)) return null;
      return r;
    }).then(function (result) {
      assert.isOk(/z .*b/
          .test(result));
    });
    return _driver;
  });
});
