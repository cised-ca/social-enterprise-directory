/* eslint-env node, mocha */
var should = require('should');
var dbUtil = require('../../helpers/db/db_util');
var postUtil = require('../../helpers/enterprise/post_util');

describe('POST /enterprise', function() {

  beforeEach(function(done) {
    dbUtil.dropDatabase(done);
  });

  it('should create testEnterprise1', function(done) {
    postUtil.postTestEnterprise1(done);
  });

  it('should create testEnterprise2', function(done) {
    postUtil.postTestEnterprise2(done);
  });

  it('should create testEnterprise3', function(done) {
    postUtil.postTestEnterprise3(done);
  });
});
