const logger = require('../lib/logger');
const td = require('testdouble');

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
  conf.validate({strict: true});
}

function installMockAuthHandler() {
  // for testing we'll stub out the admin_helper to simulate all users as directory administrators
  td.replace('../api/helpers/auth/admin_helper',
    {
      'isDirectoryAdmin': function() { return true; }
    }
  );
}
