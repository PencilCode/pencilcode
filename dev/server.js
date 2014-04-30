var express = require('express'),
    utils = require('connect').utils,
    path = require('path'),
    http = require('http'),
    url = require('url'),
    save = require('./save.js'),
    load = require('./load.js'),
    httpProxy = require('http-proxy'),
    app = module.exports = express(),
    config = require(process.argv[2]),
    proxy = new httpProxy.RoutingProxy();

function rewriteRules(req, res, next) {
  var u = utils.parseUrl(req);
  if (u.pathname == '/') { u.pathname = '/welcome.html'; }
  else if (/^\/edit\//.test(u.pathname)) {
    if (/^frame\./.test(req.headers['host'])) {
      u.pathname = '/framed.html';
    } else {
      u.pathname = '/editor.html';
    }
  }
  else if (/^\/home(?=\/).*\/$/.test(u.pathname)) { u.pathname = '/dir.html'; }
  else { next(); return; }
  req.url = url.format(u);
  next();
}

function proxyRules(req, res, next) {
  var u = utils.parseUrl(req);
  var exp = (config.proxyLoadSave) ? 
      /^\/(?:home|load|save)(?=\/)/ : /^\/(?:home)(?=\/)/;
  if (exp.test(u.pathname) &&
      /\.dev$/.test(u.host)) {
    var host = req.headers['host'] = u.host.replace(/\.dev$/, '');
    req.headers['url'] = u.path;
    proxy.proxyRequest(req, res, {
      host: host,
      port: 80,
      enable: { xforward: true }
    });
  } else {
    next();
  }
}

function proxyPacGenerator(req, res, next) {
  var u = utils.parseUrl(req);
  if (u.pathname == '/proxy.pac') {
    var hostHeader = req.get('host'),
        hostMatch = /^([^:]+)(?::(\d*))?$/.exec(hostHeader || ''),
        hostDomain = (hostMatch && hostMatch[1]) || 'localhost',
        hostPort = (hostMatch && hostMatch[2]) || process.env.PORT;
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.end(
        'function FindProxyForURL(url, host) {\n' +
        ' if (shExpMatch(host, "*.dev") || ' +
              'host == "drive.pencilcode.net") {\n' +
        '  return "PROXY ' + hostDomain + ':' + hostPort + '";\n' +
        ' }\n' +
        ' return "DIRECT";\n' +
        '}\n'
    );
  } else {
    next();
  }
}

// Remap any relative directories in the config to base off __dirname
for (var dir in config.dirs) {
  config.dirs[dir] = path.join(__dirname, config.dirs[dir]);
}
app.locals.config = config;
app.use(express.bodyParser());
app.use(rewriteRules);
console.log('using', process.env.NODE_ENV, 'mode, on port', process.env.PORT);
app.configure('development', function() {
  app.use(express.static(path.join(__dirname, '../site/top/src')));
});
app.use(express.static(path.join(__dirname, '../site/top')));
if (config.useProxy) {
  app.use(proxyRules);
  app.use(proxyPacGenerator);
}
app.use('/save', function(req, res) {
  save.handleSave(req, res, app);
});
app.use('/load', function(req, res) {
  load.handleLoad(req, res, app);
});
app.get('*', function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('404 - ' + req.url);
});

app.listen(process.env.PORT, function() {
  console.log('Express server listening on ' + process.env.PORT);
});
