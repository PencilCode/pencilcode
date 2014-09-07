var express = require('express'),
    path = require('path'),
    save = require('./save.js'),
    load = require('./load.js'),
    config = require('./config'),
    app = module.exports = express(),
    serverbase = require('./serverbase.js'),
    utils = require('./utils.js');

require('log-timestamp');

if (config.compactjson) {
  app.set('json spaces', 0);
}
app.disable('x-powered-by');

serverbase.initialize(app);
serverbase.initialize2(app);

app.listen(process.env.PORT, function() {
  // Switch users.
  if (config.gid) { process.setgid(config.gid); }
  if (config.uid) { process.setuid(config.uid); }
  console.log('Pencil Service listening on ' + process.env.PORT +
      ' serving data from ' + config.dirs.datadir);
});
