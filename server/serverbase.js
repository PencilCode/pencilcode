var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    http = require('http'),
    url = require('url'),
    save = require('./save.js'),
    load = require('./load.js'),
    config = require('./config'),
    utils = require('./utils.js');

exports.initialize = function(app) {
  // Remap any relative directories in the config to base off __dirname
  for (var dir in config.dirs) {
    config.dirs[dir] = path.join(__dirname, config.dirs[dir]);
  }
  app.locals.config = config;
  process.pencilcode = {
    domain: config.host
  };
  console.log('using', process.env.NODE_ENV, 'mode, on port', process.env.PORT);
};
exports.initialize2 = function(app) {
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

  app.use(bodyParser.urlencoded({ extended: false }));

  app.use('/save', function(req, res) {
    save.handleSave(req, res, app);
  });
  app.use('/load', function(req, res) {
    load.handleLoad(req, res, app, 'json');
  });

  // Rewrite user.pencilcode.net/filename to user.pencilcode.net/user/filename,
  // and then serve the static data.
  var rawUserData = express.static(config.dirs.datadir);
  function rewrittenUserData(req, res, next) {
    var user = utils.getUser(req, app);
    req.url =
      req.url.replace(/^((?:[^\/]*\/\/[^\/]*)?\/)/, "$1" + user + "/");
    rawUserData(req, res, next);
  }

  app.use('/code', rewrittenUserData);
  app.use('/home', function(req, res, next) {
    if (!/(?:\.(?:js|css|html|txt|xml|json|png|gif|jpg|jpeg|ico|bmp|pdf))$/.
        test(req.url)) {
      load.handleLoad(req, res, app, 'execute');
    }
    else {
      rewrittenUserData(req, res, next);
    }
  });
  if (config.servesrc) {
    app.use(express.static(path.join(config.dirs.staticdir, 'src')));
  }
  app.use(express.static(config.dirs.staticdir));
  app.get('*', function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('404 - ' + req.url);
  });
};

