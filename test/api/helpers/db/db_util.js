var mongoose = require('mongoose');

module.exports.dropDatabase = function(done) {
  mongoose.connection.db.dropDatabase(done);
};
