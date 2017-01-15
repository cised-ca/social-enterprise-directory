/* eslint-env node, mocha */
const mongoose = require('mongoose');
const logger = require('../../../../lib/logger');

var indexBuiltCallback = function() {};

before(function(done){
  mongoose.model('EnterprisePublic').on('index', handleIndexBuild);
  done();
});

function handleIndexBuild(err) {
  if (err) {
    logger.error('Failed to rebuild index ' + err);
  }
  logger.debug('db_util handling index build');
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
  mongoose.connection.dropDatabase(function() {
    rebuildIndexes(done);
  });
};
