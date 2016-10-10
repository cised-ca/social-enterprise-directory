var winston = require('winston');

module.exports.App = startServer();

function startServer() {
  forceTestEnvironment();
  winston.profile('started the server');
  var server = require('../app');
  winston.profile('started the server');
  return server;
}

function forceTestEnvironment() {
  var conf = require('../config/config.js');
  conf.set('env', 'test');
  conf.loadFile('config/test.json');

  // Perform validation
  conf.validate({strict: true});
}
