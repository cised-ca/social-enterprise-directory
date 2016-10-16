var logger = require('winston');

var conf = require('../config/config.js');
logger.level = conf.get('loglevel');

module.exports = new (logger.Logger)({
  transports: [
    new (logger.transports.Console)({'level': logger.level, 'timestamp':true, 'colorize': true})
  ]
});
