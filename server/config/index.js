// Load the config appropriate to NODE_ENV
module.exports = require(
    './' + (process.env.NODE_ENV || 'development') + '.json');

