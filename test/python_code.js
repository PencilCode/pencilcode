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
    expect(_driver.getTitle()).to.eventually.equal('aaa');
    return _driver.executeScript(function() {
      // Inject a script that clears the login cookie for a clean start.
      document.cookie='login=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      // And also clear localStorage for this site.
      localStorage.clear();
    });
  });

  it('should open py palette with .py extension', function() {
    // Create a new file with an extension .py
    _driver.get('http://pencilcode.net.dev/edit/test.py');
    _driver.executeScript(function() {
      var leftlink = $('.panetitle').filter(
          function() { return $(this).parent().position().left == 0; })
          .find('a');
      leftlink.click();
     });
     pollScript(_driver, function() {
       // If tooltipster test isnt' ready, wait for it
       if (!$('.droplet-hover-div.tooltipstered')) return;
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

  it('should load code', function() {
    // Navigate to see the editor for the program named "first".
    _driver.get('http://aaa.pencilcode.net.dev/edit/first.py');
    expect(pollScript(_driver, function() {
      if (!$('.editor').length) return;
      var ace_editor = ace.edit($('.droplet-ace')[0]);
      return ace_editor.getSession().getValue();
    })).to.eventually.contain('(function() { dot(red); })()');
    return _driver;
  });
  
  it('should be able to enter a python program', function() {
    _driver.executeScript(function() {
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
  
  /*
     *This is a test found for the JavaScript.
     *Using it as a reference for comparison with the python code.
     *(Stevie Magaco).
    
    it('should be able to run the program', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Click on the triangle run button.
      $('#run').mousedown();
      $('#run').click();
    }, function() {
      try {
        // Wait for the preview frame to show.
        if (!$('.preview iframe').length) return;
        if (!$('.preview iframe')[0].contentWindow.see) return;
        // Evaluate some expression in the coffeescript evaluation window.
        var seval = $('.preview iframe')[0].contentWindow.see.eval;
        // And also wait for the turtle to start moving.
        if (seval('getxy()')[1] < 10) return;
        return {
          direction: seval('direction()'),
          getxy: seval('getxy()'),
          touchesred: seval('touches red'),
          touchesblue: seval('touches blue'),
          queuelen: seval('turtle.queue().length'),
          stopcount: $('#stop').length      
        };
      }
      catch(e) {
        return {poll: true, error: e};
      }
    }, function(err, result) {
      assert.ifError(err);
      // The first move is forward....
      assert.equal(0, result.direction);
      assert.ok(Math.abs(result.getxy[0] - 0) < 1e-6);
      // The turtle should not be touching any red pixels.
      assert.equal(false, result.touchesred);
      // The turtle should be touching blue pixels that it drew.
      assert.equal(true, result.touchesblue);
      // The turtle should still have lots of queued actions.
      assert.ok(result.queuelen > 0);
      // The stop button should be showing
      assert.equal(1, result.stopcount);
      done();
    });
  });*/
  
  /*it('should flip into code mode', function() {
    _driver.executeScript(function() {
      // Click on the "blocks" button
      var leftlink = $('.panetitle').filter(
          function() { return $(this).parent().position().left == 0; })
          .find('a');
      leftlink.click();
    }, function() {
      var lefttitle = $('.panetitle').filter(
          function() { return $(this).parent().position().left == 0; })
          .find('.panetitle-text');
      if (/blocks/.test(lefttitle.text())) return;
      return {
        filename: $('#filename').text(),
        title: lefttitle.text().trim(),
        saved: $('#save').prop('disabled')
      };
    }).then(function(err, result) {
      assert.ifError(err);
      // Filename is still shown and unchanged.
      assert.ok(/^untitled/.test(result.filename));
      // Intentional: we should always add an extra empty line at the bottom.#####
      assert.equal(result.title, 'code');
      // The save button is still disabled, because the doc is unmodified.
      assert.equal(result.saved, true);
      //done();
    });
    return _driver;
  });*/
  
  it('should flip into code mode', function() {
    _driver.executeScript(function() {
      // Click on the "blocks" button
      var leftlink = $('.panetitle').filter(
          function() { return $(this).parent().position().left == 0; })
          .find('a');
      leftlink.click();
    }, function() {
      var lefttitle = $('.panetitle').filter(
          function() { return $(this).parent().position().left == 0; })
          .find('.panetitle-text');
          
        pollScript(_driver, function() {
      try {
      if (/blocks/.test(lefttitle.text())) return;
      }
      catch(e) {
      return {
        filename: $('#filename').text(),
        title: lefttitle.text().trim(),
        saved: $('#save').prop('disabled'),
        error: e };
      }
    }).then(function(err, result) {
      assert.ifError(err);
      // Filename is still shown and unchanged.
      assert.ok(/^untitled/.test(result.filename));
      // Intentional: we should always add an extra empty line at the bottom.
      assert.equal(result.title, 'code');
      // The save button is still disabled, because the doc is unmodified.
      assert.equal(result.saved, true);
    });
    return _driver;
   });
  });
  


  it('should flip into blocks mode', function() {
    _driver.executeScript(function() {
      // Click on the "blocks" tabby button
      $('.blocktoggle').click();
    }, function() {
      var lefttitle = $('.panetitle').filter(
          function() { return $(this).parent().position().left == 0; })
          .find('.panetitle-text');
        
      pollScript(_driver, function() {
      try {
      if (/code/.test(lefttitle.text())) return;
       }
      catch(e) {
      return {
        filename: $('#filename').text(),
        title: lefttitle.text().trim(),
        saved: $('#save').prop('disabled'),
        error: e };
        }
    }).then(function(err, result) {
      assert.ifError(err);
      // Filename is still shown and unchanged.
      assert.ok(/^untitled/.test(result.filename));
      // Intentional: we should always add an extra empty line at the bottom.
      assert.equal(result.title, 'blocks');
      // The save button is still disabled, because the doc is unmodified.
      assert.equal(result.saved, true);
    });
    return _driver;
   });
  });

  /*it('should be able to drag out a block', function() {
    testutil.defineSimulate(_page);
    // Capture any /log/ HTTP request.
    var logged = null;
    _page.onResourceRequested = function(req) {
      if (/log/.test(req[0].url)) { logged = req[0].url; }
    }
    asyncTest(_page, one_step_timeout, null, function() {
      // Drag a block out: bk 100
      simulate('mousedown', '[data-id=bk]')
      simulate('mousemove', '.droplet-drag-cover',
        { location: '[data-id=bk]', dx: 5 })
      simulate('mousemove', '.droplet-drag-cover',
        { location: '.droplet-main-scroller' })
      simulate('mouseup', '.droplet-drag-cover',
        { location: '.droplet-main-scroller' })
    }, function() {
      var ace_editor = ace.edit($('.droplet-ace')[0]);
      // Return a ton of UI state.
      return {
        filename: $('#filename').text(),
        text: ace_editor.getSession().getValue(),
        saved: $('#save').prop('disabled')
      };
    }, function(err, result) {
      _page.onResourceRequested = null;
      assert.ifError(err);
      // The filename chosen should start with the word "untitled"
      assert.ok(/^untitled/.test(result.filename), result.filename);
      // The program text should be "bk 100".
      assert.equal(result.text.trim(), 'bk 100');
      // The "save" button should not be disabled now.
      assert.equal(result.saved, false);
      // And pickblock should have been logged
      assert.equal(logged,
        "http://livetest.pencilcode.net.dev/log/~pickblock?id=bk");
      done();
    });
  });*/
  
    it('should flip into text mode again', function() {
    _driver.executeScript(function() {
      // Click on the "text" tabby button
      $('.texttoggle').click();
    }, function() {
      var lefttitle = $('.panetitle').filter(
          function() { return $(this).parent().position().left == 0; })
          .find('.panetitle-text');
          
      pollScript(_driver, function() {
      	try { 
      if (/blocks/.test(lefttitle.text())) return;
      }
      catch(e) {
      return {
        filename: $('#filename').text(),
        title: lefttitle.text().trim(),
        saved: $('#save').prop('disabled')
      	};
      }
    }).then(function(err, result) {
      assert.ifError(err);
      // Filename is still shown and unchanged.
      assert.ok(/^untitled/.test(result.filename));
      // Intentional: we should always add an extra empty line at the bottom.
      assert.equal(result.title, 'code');
      // The save button is still enabled
      assert.equal(result.saved, false);
       });
    return _driver;
    });
  });
  
	 it('should be able to edit a program in text mode', function() {
    _driver.executeScript(function() {
      // Modify the text in the editor.
      var ace_editor = ace.edit($('.droplet-ace')[0]);
      $('.editor').mousedown();
      ace_editor.getSession().setValue("speed 10\npen blue\nrt 180, 100");
    }, function() {
    	
      pollScript(_driver, function() {
      try 
      { 
      var ace_editor = ace.edit($('.droplet-ace')[0]);
      }
      catch(e) 
      {
      return {
        filename: $('#filename').text(),
        text: ace_editor.getValue(),
        activeid: document.activeElement && document.activeElement.id,
        preview: $('.preview').length,
        saved: $('#save').prop('disabled')
      		};
      }
    }).then(function(err, result) {
      assert.ifError(err);
      // Filename is still shown and unchanged.
      assert.ok(/^untitled/.test(result.filename));
      // Intentional: trim the added extra empty line at the bottom.
      assert.equal(result.text.replace(/\n$/, ''),
          "speed 10\npen blue\nrt 180, 100");
      // Preview is still shown.
      assert.equal(result.preview, 1);
      // The save button is no longer disabled, because the doc is dirty.
      assert.equal(result.saved, false);
     });
    return _driver;
    });
  });
  
  it('should be able to switch to single-pane mode', function() {
    _driver.executeScript(function() {
      // Click on the triangle run button.
      $('#splitscreen').click();
    }, function() {
      
      pollScript(_driver, function() {
      try {
        // Wait for the preview frame to show
        if (!/100/.test($('#charliepanebox').prop('style').left)) return;
        return {
          bravowidth: $('#bravopanebox').prop('style').width,
          middleclass: $('#middle').prop('class')
        };
      }
      catch(e) {
        return {poll: true, error: e};
      }
    }).then(function(err, result) {
      assert.ifError(err);
      // The main pane should be 100% wide.
      assert.equal(result.bravowidth, '100%');
      // The middle button should be pulled right.
      assert.equal(result.middleclass, 'rightedge');
      });
    return _driver;
    });
  });
  
  /* Time-out Issues
   * Will try again with a faster computer and hopefully the faster
   * processor completes the task fast enough for the test not to time out
   * Stevie Magaco*/
  it('should be able to run the program', function() {
    _driver.executeScript(function() {
      // Click on the triangle run button.
      $('#run').mousedown();
      $('#run').click();
    }, function() {
    
      pollScript(_driver, function() {
      try {
        // Wait for the preview frame to show
        if (!$('.preview iframe').length) return;
        if (!$('.preview iframe')[0].contentWindow.see) return;
        // Evaluate some expression in the coffeescript evaluation window.
        var seval = $('.preview iframe')[0].contentWindow.see.eval;
        // And also wait for the turtle to start turning, then stop moving.
        if (!seval('direction()')) return;
        if (seval('turtle.queue().length')) return;
        return {
          direction: seval('direction()'),
          getxy: seval('getxy()'),
          touchesred: seval('touches red'),
          touchesblue: seval('touches blue'),
          bravowidth: $('#bravopanebox').prop('style').width,
          queuelen: seval('turtle.queue().length')
        	};
        }
      catch(e) 
      {
        return {poll: true, error: e};
      }
    }).then(function(err, result) {
      assert.ifError(err);
      // The turtle should be pointing down at the end of the run.
      assert.equal(result.direction, 180);
      // The turtle should be near the point (200, 0).
      assert.ok(Math.abs(result.getxy[0] - 200) < 1e-6);
      assert.ok(Math.abs(result.getxy[1] - 0) < 1e-6);
      // The turtle should not be touching any red pixels.
      assert.equal(result.touchesred, false);
      // The turtle should be touching blue pixels that it drew.
      assert.equal(result.touchesblue, true);
      // The main pane should be 50% wide again.
      assert.equal(result.bravowidth, '50%');
      // There should be no further animations on the turtle queue.
      assert.equal(result.queuelen, 0);
       });
    return _driver;
    });
  });
  
  it('should capture thumbnail when camera button is pressed', function() {
    _driver.executeScript(function() {
      // Then click the camera button.
      $('#screenshot').click();
    }, function() {
    
      pollScript(_driver, function() {
      try {
      // Wait for thumbnail to be flashed
      if (!$('.tooltipster-shadow').is(':visible')) return;
      if (!$('img[alt="thumbnail"]').is(':visible')) return;
      	  }
      catch(e) 
      {
      return {
        saveEnabled: !$('#save').attr('disabled'),
        dataurl: $('img[alt="thumbnail"]').attr('src')
      		};
      }
    }).then(function(err, result) {
      assert.ifError(err);
      assert.ok(result.saveEnabled);
      // Thumbnail should not be empty.
      assert.ok(result.dataurl.length > 0);
      });
    return _driver;
    });
  });
  
  it('should flash thumbnail after run and save', function() {
    _driver.executeScript(function() {
      $('.tooltipster-shadow').hide();
      // Then click the save button.
      $('#save').click();
    }, function() {
    
      pollScript(_driver, function() {
      try {
      // Wait for thumbnail to be flashed
      if (!$('.tooltipster-shadow').is(':visible')) return;
      if (!$('img[alt="thumbnail"]').is(':visible')) return;
       }
      catch(e) 
      {
      return {
        notification: $('#notification').text(),
        dataurl: $('img[alt="thumbnail"]').attr('src')
      		};
      }
    }).then(function(err, result) {
      assert.ifError(err);
      assert.equal(result.notification, 'Saved.');
      // Thumbnail should not be empty.
      assert.ok(result.dataurl.length > 0);
      });
    return _driver;
    });
  });
  
  /*
  var name = 'test' + ('' + Math.random()).substring(2);
  it('should be able to set the name of the file', function(done) {
    asyncTest(_page, one_step_timeout, [name], function(name) {
      // Alter the editable filename and give up focus.
      $('#filename').text(name).focus().blur();
    }, function() {
      try {
        // Wait for the notifcation butter bar to show
        if (!$('#notification').is(':visible')) return;
        // Skip "Using" and skip empty notification bar.
        if (/Using|Saved|^$/.test($('#notification').text())) return;
        var lefttitle = $('.panetitle').filter(
            function() { return $(this).parent().position().left == 0; })
            .find('.panetitle-text');
        return {
          notification: $('#notification').text(),
          lefttitle: lefttitle.text().trim(),
          url: window.location.href
        };
      }
      catch(e) {
        return {error: e};
      }
    }, function(err, result) {
      assert.ifError(err);
      // The butter bar should show the new name.
      assert.equal(result.notification, 'Renamed to ' + name + '.');
      // The editor title should say 'code' since it's flipped.
      assert.equal(result.lefttitle, 'code');
      // The url should reflect the new name.
      assert.equal(result.url,
          'http://livetest.pencilcode.net.dev/edit/' + name);
      done();
    });
  });*/
  
  it('should log out when logout is pressed', function() {
    _driver.executeScript(function() {
      // Click the logout button.
      $('#logout').mousedown();
      $('#logout').click();
    }, function() {
    
      pollScript(_driver, function() {
      try {
      // Wait for the logout button to vanish.
      if ($('#logout').is(':visible')) return;
      // Wait for the butterbar to show.
      if (!$('#notification').is(':visible')) return;
      }
      catch(e) 
      {
      return {
        notifytext: $('#notification').text(),
        login: $('#login').is(':visible'),
        cookie: document.cookie
      		};
      }
    }).then(function(err, result) {
      assert.ifError(err);
      // The butterbar should report the logout.
      assert.equal(result.notifytext, 'Logged out.');
      // The login button should be showing.
      assert.ok(result.login);
      // The login cookie should be gone.
      assert.ok(!/login=/.test(result.cookie));
       });
    return _driver;
    });
  });
  
  it('should show login prompt when saving', function() {
    _driver.executeScript(function() {
      // Click on the save button.
      $('#save').click();
    }, function() {
    
       pollScript(_driver, function() {
      try {
      // Wait for the login dialog to pop up.
      if (!$('.dialog').is(':visible')) return;
       }
      catch(e) 
      {
      return {
        udisabled: $('.username').is(':disabled'),
        uval: $('.username').val(),
        pdisabled: $('.password').is(':disabled'),
        pval: $('.password').val()
      		};
      }
    }).then(function(err, result) {
      assert.ifError(err);
      // The username should be disabled and show the current username.
      assert.equal(result.udisabled, true);
      assert.equal(result.uval, 'livetest');
      // The password should not be disable and should start blank.
      assert.equal(result.pdisabled, false);
      assert.equal(result.pval, '');
       });
    return _driver;
    });
  });
  
  it('should reject the wrong password', function() {
    _driver.executeScript(function() {
      // Enter an incorrect password, and click OK.
      $('.password').val('wrong');
      $('.ok').click();
    }, function() {
    
      pollScript(_driver, function() {
      try {
      // Wait for the info prompt to show a message without "...".
      if (!$('.info').is(':visible')) return;
      if ($('.info').text().match(/\.\.\./)) return;
       }
      catch(e) 
      {
      return {
        infotext: $('.info').text()
      		 };
      }
    }).then(function(err, result) {
      assert.ifError(err);
      // The message should report that the password is wrong.
      assert.equal(result.infotext, 'Wrong password.');
      });
    return _driver;
    });
  });
  
  it('should show the change-user dialog', function() {
    _driver.executeScript(function() {
      // Enter an incorrect password, and click OK.
      $('.switchuser').click();
    }, function() {
    
      pollScript(_driver, function() {
      try {
      // Wait for a dialog with a visible password box to appear.
      if (!$('.password').is(':visible')) return;
      }
      catch(e) 
      {
      return {
        // First sentence of prompt text.
        prompttext: $('.prompt').text().replace(/\..*$/, ''),
        username: $('.username').val(),
        password: $('.password').val()
      		};
      }
    }).then(function(err, result) {
      assert.ifError(err);
      // The dialog should have a blank username/pass
      assert.equal(result.prompttext, 'Choose an account name to save');
      assert.equal(result.username, '');
      assert.equal(result.password, '');
      });
    return _driver;
    });
  });
  
  it('should recognize existing user in save-as dialog', function() {
    _driver.executeScript(function() {
      // Enter an incorrect password, and click OK.
      $('.username').val('livetest').trigger('keyup')
    }, function() {
    
      pollScript(_driver, function() {
      try {
      // Wait for the terms of service to disappear.
      if (/terms of service/.test($('.info').text())) { return; }
      }
      catch(e) 
      {
      return {
        // First sentence of prompt text.
        infotext: $('.info').text()
      		};
      }
    }).then(function(err, result) {
      assert.ifError(err);
      // The dialog should have a blank username/pass
      assert.equal(result.infotext, 'Will log in as "livetest" and save.');
      });
    return _driver;
    });
  });
  
  it('should accept the right password', function() {
    _driver.executeScript(function() {
      // Fill the textarea with some code to ensure
      // we do not get "deleted" message.
      var ace_editor = ace.edit($('.droplet-ace')[0]);

      ace_editor.getSession().setValue("speed 10\npen blue\nrt 180, 100");

      // Enter the correct password, and click OK again.
      $('.password').val('test');
      $('.ok').click();
    }, function() {
    
      pollScript(_driver, function() {
      try {
      // Wait for the overlay to be dismissed.
      if ($('#overlay').is(':visible')) return;
      }
      catch(e) 
      {
      return {
        notifytext: $('#notification').text()
      	};
      }
    }).then(function(err, result) {
      assert.ifError(err);
      // The butterbar should show that the document is saved.
      assert.equal(result.notifytext, 'Saved.');
      });
    return _driver;
    });
  });
  
  /*it('should reload using the cookie when refreshed', function(done) {
    refreshThen(_page, function() {
      // Now test the save and the login cookie by refreshing the page.
      asyncTest(_page, one_step_timeout, null, null, function() {
        if (!window.$) return;
        if (!$('.editor').is(':visible')) return;
        var ace_editor = ace.edit($('.droplet-ace')[0]);
        if (!ace_editor.getValue()) return;
        return {
          url: window.location.href,
          loaded: ace_editor.getValue(),
          login: $('#login').is(':visible'),
          logout: $('#logout').is(':visible'),
          cookie: document.cookie
        };
      }, function(err, result) {
        assert.ifError(err);
        // The url should have the chosen name.
        assert.equal(result.url,
            'http://livetest.pencilcode.net.dev/edit/' + name);
        // The editor text should be the last saved program.
        assert.equal(result.loaded, "speed 10\npen blue\nrt 180, 100\n");
        // The login button should not be shown.
        assert.equal(result.login, false);
        // The logout button should be shown.
        assert.equal(result.logout, true);
        // The login cookie should be present.
        assert.ok(/login=/.test(result.cookie));
        done();
      });
    });
  });*/
  
  it('should delete when empty is saved', function() {
    _driver.executeScript(function() {
      // Delete all the text in the editor!
      var ace_editor = ace.edit($('.droplet-ace')[0]);
      ace_editor.getSession().setValue('');
      // Then click the save button.
      $('#save').mousedown();
      $('#save').click();
    }, function() {
    
      pollScript(_driver, function() {
      try {
      // Wait for a notification message other than the loading animation.
      if (!$('#notification').is(':visible')) return;
      if ($('#notification').hasClass('loading')) return;
      // Also wait for a title to slide into the left position.
      var lefttitle = $('.panetitle').filter(
          function() { return $(this).parent().position().left == 0; });
      // Wait for the title of the left pane to contain "dir".
      if (!lefttitle.length || !/dir/.test(lefttitle.text())) return;
      }
      catch(e) 
      {
      return {
        notifytext: $('#notification').text(),
        login: $('#login').is(':visible'),
        logout: $('#logout').is(':visible'),
        title: lefttitle.text().trim()
      		};
      }
    }).then(function(err, result) {
      assert.ifError(err);
      // The butterbar should report that the file is deleted.
      assert.equal(result.notifytext, 'Deleted ' + name + '.');
      // The login button should not be shown.
      assert.ok(!result.login);
      // The logout button should be shown.
      assert.ok(result.logout);
      // And the file should not be shown: instead the parent directory.
      assert.equal(result.title.trim(), 'directory');
      });
    return _driver;
    });
  });
  
  it('should log out when logout is pressed', function() {
     _driver.executeScript(function() {
      // Click the log out button again.
      $('#logout').mousedown();
      $('#logout').click();
    }, function() {
    
      pollScript(_driver, function() {
      try {
      // Wait for a notification message.
      if (!$('#notification').is(':visible')) return;
      }
      catch(e) 
      {
      return {
        notifytext: $('#notification').text(),
        login: $('#login').is(':visible'),
        cookie: document.cookie
      		};
      }
    }).then(function(err, result) {
      assert.ifError(err);
      // Verify that it reports the logout.
      assert.equal(result.notifytext, 'Logged out.');
      // The login button should be shown.
      assert.ok(result.login);
      // The login cookie should be gone.
      assert.ok(!/login=/.test(result.cookie));
      });
    return _driver;
    });
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
    return _driver;
  });
  
  /*
  it('is done', function(done) {
    asyncTest(_page, one_step_timeout, null, function() {
      // Final cleanup: delete local storage and the cookie.
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
  */

});
