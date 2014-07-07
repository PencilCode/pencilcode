var phantom = require('node-phantom-simple'),
    phantomjs = require('phantomjs'),
    assert = require('assert');


describe('dev server', function() {
  var _ph, _page;
  before(function(done) {
    phantom.create(function(error,ph) {
      assert.ifError(error);
      _ph = ph;
      _ph.createPage(function(err,page) {
        _page = page;
        page.open('about:blank', function(err, status){
          assert.ifError(err);
          assert.equal(status,'success');
          done();
        });
      });
    }, { phantomPath: phantomjs.path });
  });
  after(function() {
    _ph.exit();
  });
  it('should serve welcome page', function(done) {
    _page.open('http://localhost:8193', function(err, status) {
      assert.ifError(err);
      assert.equal(status, 'success');
      _page.evaluate(function() {
        return {
          h1: $('h1').eq(0).text(),
          a0: $('.choices a').eq(0).text().replace(/\s+/g, ' '),
          a1: $('.choices a').eq(1).text().replace(/\s+/g, ' '),
          a2: $('.choices a').eq(2).text().replace(/\s+/g, ' ')
        };
      }, function(err, result) {
        assert.ifError(err);
        assert.equal(result.h1, "Pencil");
        assert.equal(result.a0, "I'm new here. Let's play. blank editor");
        assert.equal(result.a1, "New account.");
        assert.equal(result.a2, "Browse users. random sample");
        done();
      });
    });
  });
  it('should serve proxy.pac', function(done) {
    _page.open('http://localhost:8193/proxy.pac', function(err, status) {
      assert.ifError(err);
      assert.equal(status, 'success');
      _page.get('content', function(err, content) {
        assert.ifError(err);
        assert.ok(/PROXY localhost:8193/.test(content));
        done();
      });
    });
  });
});
