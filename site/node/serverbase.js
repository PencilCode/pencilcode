var express = require('express'),
    utils = require('connect').utils,
    path = require('path'),
    http = require('http'),
    url = require('url'),
    save = require('./save.js'),
    load = require('./load.js'),
    httpProxy = require('http-proxy'),
    config = require(process.argv[2]),
    utils2 = require('./utils.js'),
    proxy = new httpProxy.RoutingProxy();

exports.initialize = function(app) {
  // Remap any relative directories in the config to base off __dirname
  for (var dir in config.dirs) {
    config.dirs[dir] = path.join(__dirname, config.dirs[dir]);
  }
  app.locals.config = config;
  console.log('using', process.env.NODE_ENV, 'mode, on port', process.env.PORT);
  //app.use(express.logger());
};
exports.initialize2 = function(app) {
  app.use(express.bodyParser());

  app.use('/save', function(req, res) {
    save.handleSave(req, res, app);
  });
  app.use('/load', function(req, res) {
    load.handleLoad(req, res, app, 'json');
  });
  app.use('/home', function(req, res) {
    if (!/(?:\.(?:js|css|html|txt|xml|json|png|gif|jpg|jpeg|ico|bmp|pdf))$/.test(req.url)) {
      load.handleLoad(req, res, app, 'execute');
    }
    else {
      var user = utils2.getUser(req, app);
      var datapath = (user) ? path.join(config.dirs.datadir, user) : 
          config.dirs.datadir;
      app.all('*', express.static(datapath));
    }
  });
  app.configure('development', function() {
    app.use(express.static(path.join(config.dirs.staticdir, 'src')));
  });
  app.use(express.static(config.dirs.staticdir));
  app.get('*', function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('404 - ' + req.url);
  });
};

