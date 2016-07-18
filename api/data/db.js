var mongoose = require('mongoose');
var dbURL = 'mongodb://localhost:27017/socialEnterpriseDirectory';

mongoose.connect(dbURL);

mongoose.connection.on('connected', function() {
  // do something if necessary when we connect to mongo
});
mongoose.connection.on('error', function(err) {
  console.log('Mongoose failed to connect to ' + dbURL + ' ' + err);
});
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose disconnected');
});

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
function shutdown(msg, callback) {
  mongoose.connection.close(function() {
    console.log('Mongoose disconnected through ' + msg);
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
