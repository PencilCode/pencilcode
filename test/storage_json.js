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
      onResult(res.statusCode, output, res);
    });
  });
  req.on('error', function(err) {
    onResult(0, null, err);
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
  it('fails to save an empty file name', function(done) {
    var teststr1 = 'abcdefghij';
    json('zzz', '/save?data=' + teststr1, function(s, obj) {
      assert.ok(/Bad filename/.test(obj.error));
      done();
    });
  });
  it('fails to save to an unauthorized user dir', function(done) {
    var teststr1 = 'abcdefghij';
    json('withpass', '/save/abc?data=' + teststr1, function(s, obj) {
      assert.equal(obj.error, 'Password protected.');
      done();
    });
  });
  it('fails to save with invalid password', function(done) {
    var teststr1 = 'abcdefghij';
    json('withpass', '/save/abc?key=key&data=' + teststr1, function(s, obj) {
      assert.equal(obj.error, 'Incorrect password.');
      done();
    });
  });
  it('fails to set password on child dir', function(done) {
    var teststr1 = 'abcdefghij';
    json('withpass', '/save/abc/def?mode=setkey&key=123&data=' +
         teststr1, function(s, obj) {
      assert.equal(obj.error, 'Can only set key on a top-level user directory.');
      done();
    });
  });
  it('clears password successfully', function(done) {
    json('withpass', '/save?mode=setkey&key=123',
         function(s, obj) {
      assert.equal(obj.keycleared, 'withpass');
      done();
    });
  });
  it('sets password successfully', function(done) {
    json('withpass', '/save?mode=setkey&data=123',
         function(s, obj) {
      assert.equal(obj.keyset, 'withpass');
      done();
    });
  });
  it('fails to copy a file that doesnt exist', function(done) {
    json('zzz', '/save/test1?source=notexist',
         function(s, obj) {
      assert.ok(/Source file does not exist./.test(obj.error));
      done();
    });
  });
  it('fails to copy a file to root', function(done) {
    json('zzz', '/save?source=newfile',
         function(s, obj) {
      assert.ok(/Bad filename./.test(obj.error));
      done();
    });
  });
  it('fails to move a file without authz', function(done) {
    json('zzz', '/save/file2?source=withpass/file1&mode=mv',
         function(s, obj) {
      assert.equal(obj.error, 'Source password protected.');
      done();
    });
  });
  it('fails to replace an existing file', function(done) {
    json('withpass', '/save/file1?source=zzz/newfile&mode=mv&key=123',
         function(s, obj) {
      assert.equal(obj.error.indexOf('Cannot replace existing file'), 0);
      done();
    });
  });
  it('correctly moves a file', function(done) {
    // Create a new file
    var filename = new Date().getTime();
    json('zzz', '/save/' + filename + '?data=abcdefgh', function(s, obj) {
      assert.equal(obj.saved, '/zzz/' + filename);
      // Now move it
      json('zzz', '/save/mvfile?source=zzz/' + filename + '&mode=mv',
          function(s, obj) {
        assert.equal(obj.saved, '/zzz/mvfile');
        // Make sure it loads
        json('zzz', '/load/mvfile', function(s, obj) {
          assert.equal(obj.file, '/zzz/mvfile');
          // Now delete it
          json('zzz', '/save/mvfile?data=', function(s, obj) {
            assert.equal(obj.deleted, 'zzz/mvfile');
            done();
          });
        });
      });
    });
  });
  it('correctly copies a file', function(done) {
    // Generate a new file name
    var filename = new Date().getTime();
    // Now issue the copy
    json('zzz', '/save/' + filename + '?source=zzz/newfile', function(s, obj) {
      assert.equal(obj.saved, '/zzz/' + filename);
      done();
    });
  });
  it('fails to load a file thats not present', function(done) {
    json('zzz', '/load/randomfile', function(s, obj) {
      assert.equal(obj.error, 'could not read file zzz/randomfile');
      assert.ok(obj.newfile);
      done();
    });
  });
  it('loads a file thats present', function(done) {
    json('zzz', '/load/newfile', function(s, obj) {
      assert.equal(obj.file, '/zzz/newfile');
      assert.equal(obj.mime, 'text/x-pencilcode;charset=utf-8');
      assert.equal(obj.data, 'fd 1000\n');
      assert.ok(obj.mtime > 0);
      done();
    });
  });
  it('loads a directory thats present', function(done) {
    json('zzz', '/load', function(s, obj) {
      assert.equal(obj.directory, '/zzz/');
      assert.ok(obj.list.length > 0);
      // Check to see if file is present in list
      var i;
      for (i = 0; i < obj.list.length; i++) {
        if (obj.list[i].name == 'newfile') {
          assert.equal(obj.list[i].mode, 'rw');
          assert.equal(obj.list[i].size, 8);
          assert.ok(obj.list[i].mtime > 0);
          break;
        }
      }
      assert.ok(i < obj.list.length); // make sure the object was found.
      done();
    });
  });
  it('saves a file with metadata', function(done) {
    json('zzz', '/save/jsfile?data=alert("hello");' +
                '&meta={"type":"text/javascript"}', function(s, obj) {
      assert.equal(obj.saved, '/zzz/jsfile');
      done();
    });
  });
  it('loads a file with metadata', function(done) {
    json('zzz', '/load/jsfile', function(s, obj) {
      assert.equal(obj.file, '/zzz/jsfile');
      assert.equal(obj.mime, 'text/x-pencilcode;charset=utf-8');
      assert.equal(obj.data, 'alert("hello");');
      assert.deepEqual(obj.meta, {type: "text/javascript"});
      assert.ok(obj.mtime > 0);
      done();
    });
  });
  it('loads a file from code', function(done) {
    get('zzz', '/code/jsfile', function(s, data, res) {
      assert.equal('alert("hello");', data);
      assert.equal(res.headers['content-type'], 'text/javascript; charset=utf-8');
      done();
    });
  });
  it('loads a file from home', function(done) {
    get('zzz', '/home/jsfile', function(s, data) {
      assert(/<script type="text\/javascript">[^<]*alert\("hello"\);[\s},0);]*<\/script>/.test(data), data);
      done();
    });
  });
});

