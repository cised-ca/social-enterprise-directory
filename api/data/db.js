var winston = require('winston');
var mongoose = require('mongoose');
var conf = require('../../config/config.js');

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

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
function shutdown(msg, callback) {
  mongoose.connection.close(function() {
    winston.info('Mongoose disconnected through ' + msg);
    callback();
  });
}

// For restarts
process.once('SIGUSR2', function() {
  shutdown('restart', function() {
    process.kill(process.pid, 'SIGUSR2');
  });
});
// For app termination
process.on('SIGINT', function() {
  shutdown('SIGINT', function() {
    process.exit(0);
  });
});
process.on('SIGTERM', function() {
  shutdown('SIGTERM', function() {
    process.exit(0);
  });
});

require('./enterprise.model');
