var express = require('express'),
    path = require('path'),
    save = require('./save.js'),
    load = require('./load.js'),
    app = module.exports = express(),
    config = require(process.argv[2]),
    serverbase = require('./serverbase.js'),
    utils = require('./utils.js');

serverbase.initialize(app);
serverbase.initialize2(app);
app.listen(process.env.PORT, function() {
  console.log('Express server listening on ' + process.env.PORT);
});
