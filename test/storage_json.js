var http = require('http'),
    assert = require('assert');

function get(user, path, onResult) {
  var options = {
    host: '127.0.0.1',
    headers: { Host: (user ? user + '.' : '') + 'pencilcode.net.dev' },
    port: 8193,
    path: path
  };
  var req = http.get(options, function(res) {
    var output = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      output += chunk;
    });
    res.on('end', function() {
      onResult(res.statusCode, output);
    });
  });
  req.on('error', function(err) {
    onResult(0, null);
  });
  req.end();
}

function json(user, path, onResult) {
  get(user, path, function(status, data) {
    if (status >= 200 && status < 300) {
      onResult(status, JSON.parse(data));
    } else {
      onResult(status, null);
    }
  });
}

describe('test of server json apis', function() {
  it('saves a file', function(done) {
    // Round down to closest second for systems with 1s mtime resolution.
    var startTime = Math.floor((new Date()).getTime() / 1000) * 1000;
    var firstmtime = 0;
    var teststr1 = 'abcdefghij'.substr(Math.floor(Math.random() * 10));
    var teststr2 = 'klmnopqrst'.substr(Math.floor(Math.random() * 10));
    json('zzz', '/save/testfile?data=' +
        teststr1 + '%0A' + teststr2, function(s, obj) {
      assert.equal(obj.saved, '/zzz/testfile');
      assert.equal(obj.size, teststr1.length + 1 + teststr2.length);
      assert.ok(obj.mtime >= startTime, obj.mtime + ' vs ' + startTime);
      assert.ok(obj.mtime <= startTime + 1000);
      firstmtime = obj.mtime;
      json('zzz', '/load/testfile', function(s, obj) {
        assert.deepEqual(obj, {
          file: '/zzz/testfile',
          data: teststr1 + '\n' + teststr2,
          auth: false,
          mtime: firstmtime,
          mime: 'text/x-pencilcode;charset=utf-8'
        });
        done();
      });
    });
  });
});
