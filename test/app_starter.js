const logger = require('../lib/logger');

module.exports.App = startServer();

function startServer() {
  forceTestEnvironment();
  logger.profile('started the server');
  const server = require('../app');
  logger.profile('started the server');
  return server;
}

function forceTestEnvironment() {
  const conf = require('../config/config.js');
  conf.set('env', 'test');
  conf.loadFile('config/test.json');

  // Perform validation
  conf.validate({strict: true});
}
