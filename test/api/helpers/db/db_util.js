/* eslint-env node, mocha */
var mongoose = require('mongoose');
var winston = require('winston');

var indexBuiltCallback = function() {};

before(function(done){
  mongoose.model('EnterprisePublic').on('index', handleIndexBuild);
  done();
});

function handleIndexBuild(err) {
  if (err) {
    winston.error('Failed to rebuild index ' + err);
  }
  winston.debug('db_util handling index build');
  indexBuiltCallback();

  // clear callback to avoid case where mongoose raises event multiple times
  // For testing we only care that the index was built at least once and now
  // it exists.
  indexBuiltCallback = function() {};
}

function rebuildIndexes(done) {
  indexBuiltCallback = done;
  mongoose.model('EnterprisePublic').ensureIndexes();
}

module.exports.cleanDatabase = function(done) {
  mongoose.connection.db.dropDatabase(function() {
    rebuildIndexes(done);
  });
};
