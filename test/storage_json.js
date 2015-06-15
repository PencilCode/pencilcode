var http = require('http'),
    assert = require('assert');

function get(user, path, enc, onResult) {
  var options = {
    host: '127.0.0.1',
    headers: { Host: (user ? user + '.' : '') + 'pencilcode.net.dev' },
    port: 8193,
    path: path
  };
  var req = http.get(options, function(res) {
    var output = '';
    res.setEncoding(enc);
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
  get(user, path, 'utf8', function(status, data) {
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
  var thumbData =
    'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACAUlEQVRYw+2WPUhb' +
    'URTHH7SDY8AOVfM1OYiDFMGtX9KlZLCjnRw7uHQV2klNmqR5CdbaxVZiQ6vSTRFC' +
    '0S4i+LH4UZPBWB4RBCt9tkHqR+7fc555URMbheZdEfzD4cGD3N/vnnvuI4piUWwq' +
    'bHYVv6l8iuwY8DASDhVZZxigZ5t8eBgHDoZTSZMohDtNuAyJf8GlSDC8thdr96LA' +
    'g8FiuKUSJvwhgbW/R/UoJknCbHt9H7IM1nFUF5Hg+q8rWnjm7fFjgfMkcgKCvxNl' +
    'HbiLSOTgBwRP8jpln/ZSEpbDS0nw7ZACP0uCBe5HjaGTAz8pwfDmj0BtD35IhZtn' +
    'Xv8O4tLgUs/8Gn714RVBuOjHm5cC51SH4HWqQFNwO1XZiT9S4Rx7CBOeD1tA6gue' +
    '9GvJGy+QlgbnuMJi/218SbBAZmEo0xj4qUmDV4XQyItqS+NGB7iefZ6dUToQtxxu' +
    'tF9FoK5nLw/n2l0Z2X0+ODXd4NdXb3mRsQyea//i09jGKQGzdpaHd1rep7/ffIl1' +
    'S+Ac3tnQtzlxloBZd4O/NLsV8JrX8LCAdzRRBOWZ8I0lhGdgi9ovQDdls6xwDv09' +
    'HnbT4izRTRKfJudFKx1H3Zs9451LFfu08681IXTxx0opd5yq0AkAd0Tkp9wdyS5Q' +
    'q19V+3FHsTrUAd6lTs/+2xE8ViTnEOOz7/iDE5YXAAAAAElFTkSuQmCC';
  var thumb = 'data:image/png;base64,' + thumbData;
  it('correctly creates the thumbnail when saving a file', function(done) {
    // Create a new file
    json('zzz', '/save/thumbtest?data=abcdefgh&thumbnail=' +
        encodeURIComponent(thumb), function(s, obj) {
      assert.equal(obj.saved, '/zzz/thumbtest');
      get('zzz', '/thumb/thumbtest.png', 'base64', function(s, out) {
        assert.equal(s, 200);  // Load thumbnail successfully
        assert.equal(out, thumbData);
        done();
      });
    });
  });
  it('correctly moves the thumbnail when moving a file', function(done) {
    // Now move it
    json('zzz', '/save/testthumb?source=zzz/thumbtest&mode=mv',
         function(s, obj) {
      get('zzz', '/thumb/testthumb.png', 'base64', function(s, out) {
        assert.equal(s, 200);  // Thumbnail gets renamed too.
        assert.equal(out, thumbData);
        done();
      });
    });
  });
  it('correctly copies the thumbnail when copying a file', function(done) {
    // Now copy it
    json('zzz', '/save/testthumb2?source=zzz/testthumb',
         function(s, obj) {
      get('zzz', '/thumb/testthumb2.png', 'base64', function(s, out) {
        assert.equal(s, 200);  // Thumbnail gets copied too.
        assert.equal(out, thumbData);
        done();
      });
    });
  });
  it('correctly deletes the thumbnail when deleting a file', function(done) {
    json('zzz', '/save/testthumb?data=', function(s, obj) {
      assert.equal(obj.deleted, 'zzz/testthumb');
      get('zzz', '/thumb/testthumb.png', 'base64', function(s) {
        assert.equal(s, 404);  // Thumbnail gets deleted too.
        json('zzz', '/save/testthumb2?data=', function(s, obj) {
          assert.equal(obj.deleted, 'zzz/testthumb2');
          get('zzz', '/thumb/testthumb2.png', 'base64', function(s) {
            assert.equal(s, 404);  // Another thumbnail gets deleted too.
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
  it('loads the root directory', function(done) {
    json(null, '/load/', function(s, obj) {
      assert.equal(obj.directory, '/');
      assert.ok(obj.list.length > 0);
      // Check for expected files
      var expected = { aaa: 'drwx', bbb: 'drwx', callie: 'drwx',
        calvin: 'drwx', carl: 'drwx', ccc: 'drwx', first: 'rw', intro: 'rw',
        livetest: 'drwx', withpass: 'drwx', zzz: 'drwx' };
      var count = 0;
      for (var i = 0; i < obj.list.length; i++) {
        if (expected.hasOwnProperty(obj.list[i].name)) {
          assert.equal(obj.list[i].mode, expected[obj.list[i].name]);
          assert.ok(obj.list[i].mtime > 0);
          count += 1;
        }
      }
      assert.equal(count, 11);
      done();
    });
  });
  it('loads the root with a short prefix', function(done) {
    json(null, '/load/?prefix=c', function(s, obj) {
      assert.equal(obj.directory, '/');
      assert.equal(obj.list.length, 4);
      // Check for expected files
      var count = 0;
      var expected =
          { callie: 'drwx', calvin: 'drwx', carl: 'drwx', ccc: 'drwx' };
      for (var i = 0; i < obj.list.length; i++) {
        if (expected.hasOwnProperty(obj.list[i].name)) {
          assert.equal(obj.list[i].mode, expected[obj.list[i].name]);
          assert.ok(obj.list[i].mtime > 0);
          count += 1;
        }
      }
      assert.equal(count, 4);
      done();
    });
  });
  it('loads the root with a prefix', function(done) {
    json(null, '/load/?prefix=ca', function(s, obj) {
      assert.equal(obj.directory, '/');
      assert.equal(obj.list.length, 3);
      // Check for expected files
      var count = 0;
      var expected = { callie: 'drwx', calvin: 'drwx', carl: 'drwx' };
      for (var i = 0; i < obj.list.length; i++) {
        if (expected.hasOwnProperty(obj.list[i].name)) {
          assert.equal(obj.list[i].mode, expected[obj.list[i].name]);
          assert.ok(obj.list[i].mtime > 0);
          count += 1;
        }
      }
      assert.equal(count, 3);
      done();
    });
  });
  it('loads the root with a longer prefix', function(done) {
    json(null, '/load/?prefix=cal', function(s, obj) {
      assert.equal(obj.directory, '/');
      assert.equal(obj.list.length, 2);
      // Check for expected files
      var count = 0;
      var expected = { callie: 'drwx', calvin: 'drwx' };
      for (var i = 0; i < obj.list.length; i++) {
        if (expected.hasOwnProperty(obj.list[i].name)) {
          assert.equal(obj.list[i].mode, expected[obj.list[i].name]);
          assert.ok(obj.list[i].mtime > 0);
          count += 1;
        }
      }
      assert.equal(count, 2);
      done();
    });
  });
  it('loads the root with an exact match', function(done) {
    json(null, '/load/?prefix=carl', function(s, obj) {
      assert.equal(obj.directory, '/');
      assert.equal(obj.list.length, 1);
      // Check for expected files
      var count = 0;
      var expected = { carl: 'drwx' };
      for (var i = 0; i < obj.list.length; i++) {
        if (expected.hasOwnProperty(obj.list[i].name)) {
          assert.equal(obj.list[i].mode, expected[obj.list[i].name]);
          assert.ok(obj.list[i].mtime > 0);
          count += 1;
        }
      }
      assert.equal(count, 1);
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
    get('zzz', '/code/jsfile', 'utf8', function(s, data, res) {
      assert.equal('alert("hello");', data);
      assert.equal(res.headers['content-type'], 'text/javascript; charset=utf-8');
      done();
    });
  });
  it('loads a file from home', function(done) {
    get('zzz', '/home/jsfile', 'utf8', function(s, data) {
      assert(/<script type="text\/javascript">[^<]*alert\("hello"\);[\s},0);]*<\/script>/.test(data), data);
      done();
    });
  });
});

