
module.exports.App = startServer();

function startServer() {
  forceTestEnvironment();
  var server = require('../app');
  return server;
}

function forceTestEnvironment() {
  var conf = require('../config/config.js');
  conf.set('env', 'test');
}
