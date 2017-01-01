var chromedriver = require('chromedriver'),
    selenium = require('selenium-webdriver'),
    chai = require('chai'),
    expect = chai.expect,
    assert = chai.assert,
    testutil = require('./lib/testutil'),
    one_step_timeout = 8000,
    extended_timeout = 30000,
    refreshThen = testutil.refreshThen,
    pollScript = testutil.pollScript;
chai.use(require('chai-as-promised'));

args = [
  '--test-type',
  '--no-default-browser-check',
  '--no-first-run',
  '--disable-default-apps',
  '--no-startup-window',
  '--host-resolver-rules=MAP *pencilcode.net.dev localhost:8193',
  '--allow-running-insecure-content',
  '--ignore-certificate-errors=http://pencilcode.net.dev/'
];

describe('javascript editor', function() {
  var _driver;
  before(function() {
    capabilities = selenium.Capabilities.chrome();
    capabilities.set('chromeOptions', {args: args});
    _driver = new selenium.Builder().
      withCapabilities(capabilities).
      build();
    _driver.getWindowHandle()
    _driver.manage().timeouts().setScriptTimeout(one_step_timeout);
  });
  after(function() {
    _driver.quit();
  });

  it('should serve static editor HTML', function() {
    // Visit the website of the user "aaa."
    _driver.get('http://aaa.pencilcode.net.dev/edit/');
    expect(_driver.getTitle()).to.eventually.equal('aaa');
    return _driver.executeScript(function() {
      // Inject a script that clears the login cookie for a clean start.
      document.cookie='login=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      // And also clear localStorage for this site.
      localStorage.clear();
    });
  });

  it('should open js palette with .js extension', function() {
    // Create a new file with an extension .js
    _driver.get('http://pencilcode.net.dev/edit/test.js');
    expect(_driver.getTitle()).to.eventually.contain('test.js');
    _driver.findElement({css: '.left .panetitle a'}).click();
    expect(pollScript(_driver, function() {
      return $('.droplet-hover-div.tooltipstered').eq(0).tooltipster('content');
    })).to.eventually.equal('Move forward');
    return _driver;
  });

  it('should load code', function() {
    // Navigate to see the editor for the program named "first".
    _driver.get('http://aaa.pencilcode.net.dev/edit/first');
    expect(pollScript(_driver, function() {
      if (!$('.editor').length) return;
      var ace_editor = ace.edit($('.droplet-ace')[0]);
      return ace_editor.getSession().getValue();
    })).to.eventually.contain('(function() { dot(red); })()');
    return _driver;
  });

  it('should be able to run the program in javascript mode', function() {
    _driver.executeScript(function() {
      $('#run').mousedown();
      $('#run').click();
    });
    var pend = pollScript(_driver, function() {
      try {
        // Wait for the preview frame to show
        if (!$('.preview iframe').length) return;
        if (!$('.preview iframe')[0].contentWindow.see) return;
        // Evaluate some expression in the javascript evaluation window.
        var seval = $('.preview iframe')[0].contentWindow.see.eval;
        // seval('interrupt("reset")');
        if (seval('turtle.queue().length')) return;
        if (seval('getxy()')[1] < 99) {
          return;
        }
        var ret = {
          getxy: seval('getxy()'),
          touchesred: seval('touches(red)')
        };
        return ret;
      }
      catch(e) {
        return {poll: true, error: e};
      }
    });
    pend.then(function(result) {
      assert(Math.abs(result.getxy[0] - 0) < 1e-6);
      assert(result.getxy[1] >= 100);
      assert(result.touchesred);
    });
    return _driver;
  });

  it('is done', function() {
    _driver.executeScript(function() {
      localStorage.clear();
      document.cookie='login=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      return {
        cookie: document.cookie
      };
    }).then(function(result) {
      assert(!/login=/.test(result.cookie));
    });
  });
});
