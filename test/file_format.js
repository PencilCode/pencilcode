var filetype = require('../content/src/filetype');
    chai = require('chai'),
    assert = chai.assert;

describe('meta string parser', function() {

  it('should parse a simple file with META.', function() {
    assert.deepEqual(
      filetype.parseMetaString('file\ntext\n' +
          '###@META\n { "a": "b##\\u0023" } \nMETA@###\n'),
      {
        data: "file\ntext\n",
        meta: { "a": "b###" }
      }
    );
  });

  it('should print a simple file with meta.', function() {
    assert.equal(
      filetype.printMetaString("abc\ndef", { "something": "####data####"}),
      'abc\ndef###@META\n{"something":"##\\u0023#data##\\u0023#"}\nMETA@###');
  });

  it('should parse a simple javascript file with META.', function() {
    assert.deepEqual(
      filetype.parseMetaString('/* this is a test file */\n' +
          '/**@META\n { "a": "b/**\\/" } \nMETA@**/\n\n\n'),
      {
        data: "/* this is a test file */\n",
        meta: { "a": "b/**/" }
      }
    );
  });

  it('should print a simple javascript file.', function() {
    assert.equal(
      filetype.printMetaString("hello();", {
         "type": "text/javascript", "something": "/*data*/" }),
      'hello();/**@META\n{"type":"text/javascript",' +
      '"something":"/*data*\\/"}\nMETA@**/');
  });

  var randstring = ['type', 'f()', '*', '###', '/', '\n'];

  function randValue() {
    var r = Math.random();
    if (r < 0.1) return Math.tan(r * Math.PI / 0.2);
    if (r < 0.2) return false;
    if (r < 0.3) return true;
    if (r < 0.4) return null;
    return randString();
  }
  function randString() {
    var s = '';
    var r = Math.random() * Math.random();
    while (Math.random() > r) {
      s += randstring[Math.floor(Math.random() * randstring.length)];
    }
    return s;
  }
  function randJson(depth) {
    var count = Math.ceil(Math.random() * 3), result, key;
    if (Math.random() > 0.5) {
      result = [];
      while (count-- > 0) {
        if (Math.floor(Math.random() * depth)) {
          result.push(randJson(depth - 1));
        } else {
          result.push(randValue());
        }
      }
    } else {
      result = {};
      while (count-- > 0) {
        if (Math.floor(Math.random() * depth)) {
          result[randString()] = randJson(depth - 1);
        } else {
          result[randString()] = randValue();
        }
      }
    }
    return result;
  }
  function randData() {
    var x = randJson(6);
    if (!(x instanceof Array) && Math.random() < .5) {
      x.type = 'javascript';
    }
    return x;
  }

  it('should round-trip 100 random files.', function() {
    for (var j = 0; j < 100; ++j) {
      var v = { data: randString(), meta: randData() };
      var s = filetype.printMetaString(v.data, v.meta);
      var r = filetype.parseMetaString(s);
      assert.deepEqual(v, r);
    }
  });

});
