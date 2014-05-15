var express = require('express'),
    cnUtils = require('connect').utils,
    path = require('path'),
    http = require('http'),
    url = require('url'),
    serverbase = require('../site/node/serverbase.js'),
    httpProxy = require('http-proxy'),
    app = module.exports = express(),
    proxy = new httpProxy.RoutingProxy();

function rewriteRules(req, res, next) {
  var u = cnUtils.parseUrl(req);
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
  var u = cnUtils.parseUrl(req);
  var exp = (req.app.locals.config.useProxy) ?
    /^\/(?:code|home|load|save|proxy)(?=\/)/ : /^\/(?:proxy)(?=\/)/;
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
  var u = cnUtils.parseUrl(req);
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


serverbase.initialize(app);
app.use(rewriteRules);
app.use(proxyRules);
app.use(proxyPacGenerator);
serverbase.initialize2(app);
app.listen(process.env.PORT, function() {
  console.log('Express server listening on ' + process.env.PORT);
});
