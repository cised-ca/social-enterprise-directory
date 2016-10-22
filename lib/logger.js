var logger = require('winston');

var conf = require('../config/config.js');
logger.level = conf.get('loglevel');

var transports;
var logFile = conf.get('logFile');
if (logFile) {
  transports = {
    transports: [
      new (logger.transports.File)({
        level: logger.level,
        filename: logFile,
        handleExceptions: true,
        maxsize: 10485760, //10MB
        maxFiles: 5,
        timestamp: true,
        json: true,
        colorize: false
      })
    ]
  };
} else {
  transports = {
    transports: [
      new (logger.transports.Console)({'level': logger.level, 'timestamp':true, 'colorize': true})
    ]
  };
}

module.exports = new (logger.Logger)(transports);
