var cluster = require('cluster'),
    express = require('express'),
    path = require('path'),
    save = require('./save.js'),
    load = require('./load.js'),
    config = require('./config'),
    app = module.exports = express(),
    serverbase = require('./serverbase.js'),
    utils = require('./utils.js');

if (cluster.isMaster) {
  console.log('starting master');
} else {
  console.log('starting worker', cluster.worker.id);
}

if (config.compactjson) {
  app.set('json spaces', 0);
}

serverbase.initialize(app);
serverbase.initialize2(app);

app.listen(process.env.PORT, function() {
  // Switch users.
  if (config.gid) { process.setgid(config.gid); }
  if (config.uid) { process.setuid(config.uid); }
});
