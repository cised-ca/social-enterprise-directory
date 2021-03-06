const logger = require('../../lib/logger');
const mongoose = require('mongoose');
const conf = require('../../config/config.js');

mongoose.promise = Promise;

if (conf.get('loglevel') === 'debug') {
  mongoose.set('debug', true);
}

let dbURL = conf.get('dbURL');
let options = {
  server: {
    reconnectTries: Number.MAX_VALUE,
    socketOptions: { keepAlive: 120 }
  }
};
mongoose.connect(dbURL, options);

mongoose.connection.on('connected', function() {
  logger.info('Mongoose connected to', dbURL);
});
mongoose.connection.on('error', function(err) {
  logger.error('Mongoose failed to connect to ', dbURL, err);
});
mongoose.connection.on('disconnected', function() {
  logger.warn('Mongoose disconnected');
});

// Close db connection on signal
function disconnect(msg, callback) {
  mongoose.connection.close(function() {
    logger.info('Mongoose disconnected by ' + msg);
    callback();
  });
}

// For restarts
process.once('SIGUSR2', function() {
  disconnect('restart', function() {
    process.kill(process.pid, 'SIGUSR2');
  });
});
// For app termination
process.on('SIGINT', function() {
  disconnect('SIGINT', function() {
    process.exit(0);
  });
});
process.on('SIGTERM', function() {
  disconnect('SIGTERM', function() {
    process.exit(0);
  });
});

require('./enterprise.model');
