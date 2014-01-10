var phantom = require('node-phantom-simple'),
    phantomjs = require('phantomjs'),
    assert = require('assert');

function refreshThen(page, callback) {
  page.reload(function(err) {
    assert.ifError(err);
    // Wait a little time before interacting with the page after a refresh.
    setTimeout(callback, 100);
  });
}

function asyncTest(page, timeout, params, action, predicate, callback) {
  var startTime = +(new Date), evalTime = startTime,
      rt_args, ac_args;

  function handletry(err, result) {
    if (err || (result != null && !result.poll)) {
      callback(err, result);
    } else if (evalTime - startTime > timeout) {
      // Note that timeout is measured not from the time
      // of the callback, but the time of the call-in.
      // After a slow callback, we can try one more time.
      throw (new Error('timeout'));
    } else {
      if (result) { console.log(result); }
      setTimeout(retry, 100);
    }
  }
  function retry() {
    evalTime = +(new Date);
    page.evaluate.apply(page, rt_args);
  }
  function handleact(err, result) {
    if (err) {
      callback(err);
    }
    retry();
  }

  rt_args = [ predicate, handletry ];
  ac_args = [ action, handleact ];
  rt_args.push.apply(rt_args, params);
  ac_args.push.apply(ac_args, params);

  if (action) {
    page.evaluate.apply(page, ac_args);
  } else {
    retry();
  }
}

describe('code editor', function() {
  var _ph, _page;
  before(function(done) {
    phantom.create(function(error, ph) {
      assert.ifError(error);
      _ph = ph;
      _ph.createPage(function(err, page) {
        _page = page;
        page.set('viewportSize', { width: 1200, height: 900 }, function(err) {
          assert.ifError(err);
          page.open('about:blank', function(err, status){
            assert.ifError(err);
            assert.equal(status, 'success');
            done();
          });
        });
      });
    }, {
      phantomPath: phantomjs.path,
      parameters: {proxy: '127.0.0.1:8193', 'local-storage-quota': 0}
    });
  });
  after(function() {
    _ph.exit();
  });
  it('should serve static editor HTML', function(done) {
    _page.open('http://livetest.pencilcode.net.dev/edit',
        function(err, status) {
      assert.ifError(err);
      assert.equal(status, 'success');
      _page.evaluate(function() {
        document.cookie='login=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        localStorage.clear();
      }, function(err) {
        assert.ifError(err);
        done();
      });
    });
  });
  it('should load code', function(done) {
    _page.open('http://livetest.pencilcode.net.dev/edit/first',
        function(err, status) {
      assert.ifError(err);
      assert.equal(status, 'success');
      asyncTest(_page, 5000, null, null, function() {
        if (!$('.editor').length) return;
        var ace_editor = ace.edit($('.editor').attr('id'));
        return ace_editor.getSession().getValue();
      }, function(err, result) {
        assert.ifError(err);
        assert.ok(/pen red/.test(result));
        done();
      });
    });
  });
  it('should navigate to parent dir', function(done) {
    asyncTest(_page, 5000, null, function() {
      $('#icon').click();
    }, function() {
      if (!$('.directory').length) return;
      if (!$('.create').length) return;
      var dirs = []
      $('.directory a').each(function() { dirs.push($(this).text()); });
      return dirs;
    }, function(err, result) {
      assert.ifError(err);
      assert.ok(result.indexOf('first') >= 0);
      done();
    });
  });
  it('should be able to start a new file', function(done) {
    asyncTest(_page, 5000, null, function() {
      $('.create').click();
    }, function() {
      var lefttitle = $('.panetitle').filter(
          function() { return $(this).position().left == 0; });
      if (!lefttitle.length || !/untitled/.test(lefttitle.text())) return;
      if (!$('.editor').length) return;
      var ace_editor = ace.edit($('.editor').attr('id'));
      return {
        filename: $('#filename').text(),
        title: lefttitle.text(),
        text: ace_editor.getSession().getValue(),
        activeid: document.activeElement && document.activeElement.id,
        preview: $('.preview').length,
        saved: $('#save').prop('disabled'),
        login: $('#login').length,
        logout: $('#logout').length
      }
    }, function(err, result) {
      assert.ifError(err);
      assert.ok(/^untitled/.test(result.filename));
      assert.ok(/^untitled.*code$/.test(result.title));
      assert.equal("", result.text);
      assert.equal("filename", result.activeid);
      assert.equal(1, result.preview);
      assert.ok(result.login);
      assert.ok(!result.logout);
      assert.equal(!result.login, result.saved);
      done();
    });
  });
  it('should enable the save button after entering a program', function(done) {
    asyncTest(_page, 5000, null, function() {
      var ace_editor = ace.edit($('.editor').attr('id'));
      ace_editor.getSession().setValue("speed 10\npen blue\nrt 180, 100");
    }, function() {
      var ace_editor = ace.edit($('.editor').attr('id'));
      return {
        filename: $('#filename').text(),
        text: ace_editor.getValue(),
        activeid: document.activeElement && document.activeElement.id,
        preview: $('.preview').length,
        saved: $('#save').prop('disabled')
      };
    }, function(err, result) {
      assert.ifError(err);
      assert.ok(/^untitled/.test(result.filename));
      // Intentional: we should always add an extra empty line at the bottom.
      assert.equal("speed 10\npen blue\nrt 180, 100\n", result.text);
      assert.equal("filename", result.activeid);
      assert.equal(1, result.preview);
      assert.equal(false, result.saved);
      done();
    });
  });
  it('should be able to run the program', function(done) {
    asyncTest(_page, 5000, null, function() {
      $('#run').mousedown();
      $('#run').click();
    }, function() {
      try {
        // Wait for the preview frame to show
        if (!$('.preview iframe').length) return;
        if (!$('.preview iframe')[0].contentWindow.see) return;
        var seval = $('.preview iframe')[0].contentWindow.see.eval;
        // And also wait for the turtle to start turning, then stop moving.
        if (!seval('direction()')) return;
        if (seval('turtle.queue().length')) return;
        return {
          direction: seval('direction()'),
          getxy: seval('getxy()'),
          touchesred: seval('touches red'),
          touchesblue: seval('touches blue'),
          queuelen: seval('turtle.queue().length')
        };
      }
      catch(e) {
        return {poll: true, error: e};
      }
    }, function(err, result) {
      assert.ifError(err);
      assert.equal(180, result.direction);
      assert.ok(Math.abs(result.getxy[0] - 200) < 1e-6);
      assert.ok(Math.abs(result.getxy[1] - 0) < 1e-6);
      assert.equal(false, result.touchesred);
      assert.equal(true, result.touchesblue);
      assert.equal(0, result.queuelen);
      done();
    });
  });
  var name = 'test' + ('' + Math.random()).substring(2);
  it('should be able to set the name of the file', function(done) {
    asyncTest(_page, 5000, [name], function(name) {
      $('#filename').text(name).focus().blur();
    }, function() {
      try {
        // Wait for the notifcation butter bar to show
        if (!$('#notification').is(':visible')) return;
        var lefttitle = $('.panetitle').filter(
            function() { return $(this).position().left == 0; });
        return {
          notification: $('#notification').text(),
          lefttitle: lefttitle.text(),
          url: window.location.href
        };
      }
      catch(e) {
        return {error: e};
      }
    }, function(err, result) {
      assert.ifError(err);
      assert.ifError(result.error);
      assert.equal(result.notification, 'Using name ' + name + '.');
      assert.equal(result.lefttitle, name + ' code');
      assert.equal(result.url,
          'http://livetest.pencilcode.net.dev/edit/' + name);
      done();
    });
  });
  it('should show login prompt when saving', function(done) {
    asyncTest(_page, 5000, null, function() {
      $('#save').click();
    }, function() {
      if (!$('.login').is(':visible')) return;
      return {
        udisabled: $('.username').is(':disabled'),
        uval: $('.username').val(),
        pdisabled: $('.password').is(':disabled'),
        pval: $('.password').val()
      };
    }, function(err, result) {
      assert.ifError(err);
      assert.equal(true, result.udisabled);
      assert.equal('livetest', result.uval);
      assert.equal(false, result.pdisabled);
      assert.equal('', result.pval);
      done();
    });
  });
  it('should reject the wrong password', function(done) {
    asyncTest(_page, 5000, null, function() {
      $('.password').val('wrong');
      $('.ok').click();
    }, function() {
      if (!$('.info').is(':visible')) return;
      if ($('.info').text().match(/\.\.\./)) return;
      return {
        infotext: $('.info').text()
      };
    }, function(err, result) {
      assert.ifError(err);
      assert.equal('Wrong password.', result.infotext);
      done();
    });
  });
  it('should accept the right password', function(done) {
    asyncTest(_page, 5000, null, function() {
      $('.password').val('test');
      $('.ok').click();
    }, function() {
      if ($('#overlay').is(':visible')) return;
      return {
        notifytext: $('#notification').text()
      };
    }, function(err, result) {
      assert.ifError(err);
      assert.equal('Saved.', result.notifytext);
      done();
    });
  });
  it('should reload using the cookie when refreshed', function(done) {
    refreshThen(_page, function() {
      asyncTest(_page, 5000, null, null, function() {
        if (!window.$) return;
        if (!$('.editor').is(':visible')) return;
        var ace_editor = ace.edit($('.editor').attr('id'));
        if (!ace_editor.getValue()) return;
        return {
          url: window.location.href,
          loaded: ace_editor.getValue(),
          cookie: document.cookie
        };
      }, function(err, result) {
        assert.ifError(err);
        assert.equal(result.url,
            'http://livetest.pencilcode.net.dev/edit/' + name);
        assert.equal("speed 10\npen blue\nrt 180, 100\n", result.loaded);
        assert.ok(/login=/.test(result.cookie));
        done();
      });
    });
  });
  it('should delete when empty is saved', function(done) {
    asyncTest(_page, 5000, null, function() {
      var ace_editor = ace.edit($('.editor').attr('id'));
      ace_editor.getSession().setValue('');
      $('#save').mousedown();
      $('#save').click();
    }, function() {
      if (!$('#notification').is(':visible')) return;
      if ($('#notification').hasClass('loading')) return;
      return {
        notifytext: $('#notification').text(),
        login: $('#login').is(':visible'),
        logout: $('#logout').is(':visible')
      };
    }, function(err, result) {
      assert.ifError(err);
      assert.equal("Deleted " + name + ".", result.notifytext);
      assert.ok(!result.login);
      assert.ok(result.logout);
      done();
    });
  });
  it('should log out when logout is pressed', function(done) {
    asyncTest(_page, 5000, null, function() {
      $('#logout').mousedown();
      $('#logout').click();
    }, function() {
      if (!$('#notification').is(':visible')) return;
      return {
        notifytext: $('#notification').text(),
        login: $('#login').is(':visible'),
        cookie: document.cookie
      };
    }, function(err, result) {
      assert.ifError(err);
      assert.equal("Logged out.", result.notifytext);
      assert.ok(result.login);
      assert.ok(!/login=/.test(result.cookie));
      done();
    });
  });
  it('is done', function(done) {
    asyncTest(_page, 5000, null, function() {
      localStorage.clear();
      document.cookie='login=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    }, function() {
      return {
        cookie: document.cookie
      };
    }, function(err, result) {
      assert.ifError(err);
      assert.ok(!/login=/.test(result.cookie));
      done();
    });
  });
});
