var winston = require('winston');
var mongoose = require('mongoose');
var conf = require('../../config/config.js');

if (conf.get('loglevel') === 'debug') {
  mongoose.set('debug', true);
}

var dbURL = conf.get('dbURL');
mongoose.connect(dbURL);

mongoose.connection.on('connected', function() {
  winston.info('Mongoose connected to', dbURL);
});
mongoose.connection.on('error', function(err) {
  winston.error('Mongoose failed to connect to ', dbURL, err);
});
mongoose.connection.on('disconnected', function() {
  winston.warn('Mongoose disconnected');
});

// Close db connection on signal
function disconnect(msg, callback) {
  mongoose.connection.close(function() {
    winston.info('Mongoose disconnected by ' + msg);
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
