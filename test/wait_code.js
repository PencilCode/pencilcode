var chai = require('chai'),
    expect = chai.expect,
    assert = chai.assert,
    testutil = require('./lib/testutil'),
    startChrome = testutil.startChrome,
    pollScript = testutil.pollScript;
chai.use(require('chai-as-promised'));

describe('wait_code', function() {
  var _driver;
  before(function() {
    _driver = startChrome();
  });
  after(function() {
    _driver.quit();
  });

  it('should load code', function() {
    // Visit the website of the user "aaa."
    _driver.get('http://livetest.pencilcode.net.dev/edit/');
    expect(_driver.getTitle()).to.eventually.equal('livetest');
    _driver.executeScript(function() {
      // Inject a script that clears the login cookie for a clean start.
      document.cookie='login=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      // And also clear localStorage for this site.
      localStorage.clear();
    });
    pollScript(_driver, function() {
      var lefttitle = $('.panetitle').filter(
          function() {
            return $(this).parent().position().left == 0;
          }).find('.panetitle-text');
      if (!lefttitle.length || !/dir/.test(lefttitle.text())) return;
      // Wait for both the directory div and the create link to appear.
      if (!$('.directory').length) return {poll:true, step:1,
        msg: window.lasterrorevent && window.lasterrorevent.message,
        fn: window.lasterrorevent && window.lasterrorevent.filename,
        line: window.lasterrorevent && window.lasterrorevent.lineno
      };
      if (!$('.create').length) return {poll:true, step:2,
        msg: window.lasterrorevent && window.lasterrorevent.message,
        fn: window.lasterrorevent && window.lasterrorevent.filename,
        line: window.lasterrorevent && window.lasterrorevent.lineno
      };
      // Race condition: also wait for 'first' to vanish from filename
      if (/first/.test($('#filename').text())) return {
        poll: true, step:3,
        filename: $('#filename').text(),
        msg: window.lasterrorevent && window.lasterrorevent.message,
        fn: window.lasterrorevent && window.lasterrorevent.filename,
        line: window.lasterrorevent && window.lasterrorevent.lineno
      };
      // Return an array of all the link text within the directory listing.
      var dirs = []
      $('.directory a').each(function() { dirs.push($(this).text()); });
      return dirs;
    }).then(function(result) {
      // Verity that the name "first" appears within the listing.
      assert.isOk(result.indexOf('first') >= 0);
    });
    return _driver;
  });
  it('should be able to start a new file', function() {
    _driver.executeScript(function() {
      // Click on the "Create new program" link.
      $('.create').click();
    });
    pollScript(_driver, function() {
      // TODO: debug - not sure why we need to wait until here for first
      // to vanish from filename field.
      // if (/first/.test($('#filename').text())) return;
      // The panes will scroll horizontally.  Look for a panetitle that
      // is up against the left edge.
      var lefttitle = $('.panetitle').filter(
          function() {
            return $(this).parent().position().left == 0;
          }).find('.panetitle-text');
      // Wait for this title to say "blocks" in it.
      if (!lefttitle.length || !/blocks/.test(lefttitle.text())) return;
      // And wait for an editor to be rendered.
      if (!$('.editor').length) return;
      var ace_editor = ace.edit($('.droplet-ace')[0]);
      // Return a ton of UI state.
      return {
        filename: $('#filename').text(),
        title: lefttitle.text().trim(),
        text: ace_editor.getSession().getValue(),
        activeid: document.activeElement && document.activeElement.id,
        preview: $('.preview').length,
        saved: $('#save').prop('disabled'),
        login: $('#login').length,
        logout: $('#logout').length
      }
    }).then(function (result) {
      // The filename chosen should start with the word "untitled"
      assert.isOk(/^untitled/.test(result.filename), result.filename);
      // The title should say blocks
      assert.equal(result.title, 'blocks');
      // The program text should be empty.
      assert.equal(result.text, '');
      // The element with active focus should be the editable filename.
      assert.equal(result.activeid, 'filename');
      // There should be a visible preview div.
      assert.equal(result.preview, 1);
      // There sould be a login button.
      assert.isOk(result.login);
      // There sould be no logout button.
      assert.isOk(!result.logout);
      // The "save" button should be enabled only if not logged in.
      assert.equal(result.logout, result.saved);
    });
    return _driver;
  });
  it('should flip into code mode', function() {
    _driver.executeScript(function() {
      // Click on the "blocks" button
      var leftlink = $('.panetitle').filter(
          function() { return $(this).parent().position().left == 0; })
          .find('a');
      leftlink.click();
    });
    pollScript(_driver, function() {
      var lefttitle = $('.panetitle').filter(
          function() { return $(this).parent().position().left == 0; })
          .find('.panetitle-text');
      if (/blocks/.test(lefttitle.text())) return;
      return {
        filename: $('#filename').text(),
        title: lefttitle.text().trim(),
        saved: $('#save').prop('disabled')
      };
    }).then(function (result) {
      // Filename is still shown and unchanged.
      assert.isOk(/^untitled/.test(result.filename));
      // Intentional: we should always add an extra empty line at the bottom.
      assert.equal(result.title, 'code');
      // The save button is still enabled, because the user isn't logged in.
      assert.equal(result.saved, false);
    });
    return _driver;
  });
  it('should be able to enter a program with await', function() {
    _driver.executeScript(function() {
      // Modify the text in the editor.
      var ace_editor = ace.edit($('.droplet-ace')[0]);
      $('.editor').mousedown();
      ace_editor.getSession().setValue(
          "while true\n" +
          "  await read 'your question?', defer x\n" +
          "  if (x.match /who/)\n" +
          "    write 'Fred is my name.'\n");
    });
    pollScript(_driver, function() {
      var ace_editor = ace.edit($('.droplet-ace')[0]);
      return {
        filename: $('#filename').text(),
        text: ace_editor.getValue(),
        activeid: document.activeElement && document.activeElement.id,
        preview: $('.preview').length,
        saved: $('#save').prop('disabled')
      };
    }).then(function(result) {
      // Filename is still shown and unchanged.
      assert.isOk(/^untitled/.test(result.filename));
      // Intentional: trim the added extra empty line at the bottom.
      assert.equal(result.text.replace(/\n$/, ''),
          "while true\n" +
          "  await read 'your question?', defer x\n" +
          "  if (x.match /who/)\n" +
          "    write 'Fred is my name.'");
      // Preview is still shown.
      assert.equal(result.preview, 1);
      // The save button is no longer disabled, because the doc is dirty.
      assert.equal(result.saved, false);
    });
    return _driver;
  });
  it('should be able to run a program with await', function() {
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
        if (!seval('$("label").text()')) return;
        return {
          getxy: seval('getxy()'),
          label: seval('$("label").text()'),
          queuelen: seval('turtle.queue().length')
        };
      }
      catch(e) {
        return {poll: true, error: e};
      }
    }).then(function (result) {
      // There should be a question on the screen
      assert.isOk(/question/.test(result.label));
      // The turtle should be near the point (0, 0).
      assert.isOk(Math.abs(result.getxy[0]) < 1e-6);
      assert.isOk(Math.abs(result.getxy[1]) < 1e-6);
      // There should be no further animations on the turtle queue.
      assert.equal(result.queuelen, 0);
    });
    return _driver;
  });
  it('should be able to interact with text input', function() {
    _driver.executeScript(function() {
      // Click on the triangle run button.
      var seval = $('.preview iframe')[0].contentWindow.see.eval;
      seval("$('.turtleinput').val('computer, who are you?')");
      seval("$('label button').click()");
    });
    pollScript(_driver, function() {
      try {
        // The preview frame should be showing...
        if (!$('.preview iframe')[0].contentWindow.see) return;
        // Evaluate some expression in the coffeescript evaluation window.
        var seval = $('.preview iframe')[0].contentWindow.see.eval;
        // Wait for a div to be printed out
        if (!seval('$("div").length')) return;
        return {
          divtext: seval('$("div").text()'),
          labellen: seval('$("label").length'),
          firstlabel: seval('$("label").eq(0).text()'),
          lastlabel: seval('$("label").eq(-1).text()'),
          inputlen: seval('$(".turtleinput").length'),
          queuelen: seval('turtle.queue().length')
        };
      }
      catch(e) {
        return {poll: true, error: e};
      }
    }).then(function(result) {
      // We should have the answer showing.
      assert.equal('Fred is my name.', result.divtext);
      // The question should be inside the first label
      assert.equal('your question?\xA0computer, who are you?',
          result.firstlabel);
      // There should be a question in the second label
      assert.equal(result.labellen, 2);
      assert.isOk(/question/.test(result.lastlabel));
      assert.isOk(!/who/.test(result.lastlabel));
      // There should be an input on the screen.
      assert.equal(result.inputlen, 1);
      // There should be no further animations on the turtle queue.
      assert.equal(result.queuelen, 0);
    });
    return _driver;
  });
  it('is done', function() {
    _driver.executeScript(function() {
      // Final cleanup: delete local storage and the cookie.
      localStorage.clear();
      document.cookie='login=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    });
    pollScript(_driver, function() {
      return {
        cookie: document.cookie
      };
    }).then(function(result) {
      assert.isOk(!/login=/.test(result.cookie));
    });
    return _driver;
  });
});
