var filetype = require('../content/src/filetype');
    assert = require('assert');

describe('ok', function() {
  it('should parse a simple file with META at the bottom.');
  assert.deepEqual(
    filetype.parseMetaString('file\ntext\n' +
        '###@META\n { "a": "b##\\u0023" } \nMETA@###\n'),
    {
      data: "file\ntext\n",
      meta: { "a": "b###" }
    }
  );
  it('should print a simple file with META at the bottom.');
  assert.deepEqual(
    filetype.printMetaString("abc\ndef", { "something": "####data####"}),
    'abc\ndef###@META\n{"something":"##\\u0023#data##\\u0023#"}\nMETA@###');
});
