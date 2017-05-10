const logger = require('../lib/logger');
const td = require('testdouble');
const mockAuthHandler = require('./api/helpers/auth/mock_auth_handler');

module.exports.App = startServer();

function startServer() {
  forceTestEnvironment();
  installMockAuthHandler();
  logger.profile('started the server');
  const server = require('../app');
  logger.profile('started the server');
  return server;
}

function forceTestEnvironment() {
  const conf = require('../config/config.js');
  conf.set('env', 'test');
  conf.loadFile('config/test.json');
  conf.validate({allowed: 'strict'});
}

function installMockAuthHandler() {
  // for testing we'll stub out the admin_checker
  td.replace('../api/helpers/auth/request_admin_checker', mockAuthHandler.handler);
}
