var chai = require('chai'),
    expect = chai.expect,
    assert = chai.assert,
    testutil = require('./lib/testutil'),
    startChrome = testutil.startChrome,
    pollScript = testutil.pollScript;
chai.use(require('chai-as-promised'));

describe('python editor', function() {
  var _driver;
  before(function() {
    _driver = startChrome();
  });
  after(function() {
    _driver.quit();
  });

  it('should serve static editor HTML', function() {
    // Visit the website of the user "aaa."
    _driver.get('http://aaa.pencilcode.net.dev/edit/');
    expect(pollScript(_driver, function() {
      if (!document.title) { return; }
      // Inject a script that clears the login cookie for a clean start.
      document.cookie='login=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      // And also clear localStorage for this site.
      localStorage.clear();
      return document.title;
    })).to.eventually.equal('aaa');
  });

  it('should open py palette with .py extension', function() {
    // Create a new file with an extension .py
    _driver.get('http://pencilcode.net.dev/edit/test.py');
    expect(_driver.getTitle()).to.eventually.contain('test.py');
    _driver.findElement({css: '.left .panetitle a'}).click();
    pollScript(_driver, function() {
      // If tooltipster test isnt' ready, wait for it
      if (document.querySelector('.droplet-hover-div.tooltipstered') == null) {
        return;
      }
      return {
        // Content of first palette block
        text: $('.droplet-hover-div.tooltipstered').eq(0)
              .tooltipster('content')
      }
    }).then(function(result) {
      assert.equal(result.text, 'Import Functions on the pencilcode file');
    });
    return _driver;
  });

  it('should be able to enter a python program', function() {
    pollScript(_driver, function() {
      if (document.querySelector('.droplet-ace') == null) { return; }
    }).then(function(result) {
      // Modify the text in the editor.
      var ace_editor = ace.edit($('.droplet-ace')[0]);
      $('.editor').mousedown();
      ace_editor.getSession().setValue(
        "from pencilcode import *\n" +
        "speed(100)\n" +
        "pen('purple', 10)\n" +
        "fd(100)\n"
      );
    });
  });

  it('should be able to run a python program', function() {
    _driver.executeScript(function() {
      // Click on the triangle run button.
      $('#run').mousedown();
      $('#run').click();
    });
    pollScript(_driver, function() {
      try {
        // Wait for the preview frame to show
        if (!$('.preview iframe').length) return;
        if (!$('.preview iframe')[0].contentWindow.see) return;
        // Evaluate some expression in the coffeescript evaluation window.
        var seval = $('.preview iframe')[0].contentWindow.see.eval;
        // And also wait for the turtle to start turning, then stop moving.
        if (!seval) return;
        if (seval('getxy()')[1] < 99) {
          return;
        }
        return {
          getxy: seval('getxy()'),
          touchesred: seval("touches('red')"),
          touchespurple: seval("touches('purple')")
        };
      }
      catch(e) {
        return {poll: true, error: e};
      }
    }).then(function(result) {
      // Verify dimensions can be read.
      assert(Math.abs(result.getxy[0] - 0) < 1e-6);
      assert(result.getxy[1] >= 99);
      assert(!result.touchesred);
      assert(result.touchespurple);
    });
    return _driver;
  });
});
