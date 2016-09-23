/* eslint-env node, mocha */
var should = require('should');
var dbUtil = require('../../helpers/db/db_util');
var requestUtil = require('../../helpers/request_util');
var postUtil = require('../../helpers/enterprise/post_util');
var enterpriseVerifier = require('../../helpers/enterprise/enterprise_verifier');

var url = '/directory';

describe('GET /directory', function() {

  beforeEach(function(done) {
    dbUtil.dropDatabase(done);
  });

  it('should return empty directory', function(done) {
    requestUtil.buildGetRequest(url)
        .end(function(err, res) {
          should.not.exist(err);
          res.body.should.be.empty();
          done();
        });
  });

  it('should return one enterprise', function(done) {
    postUtil.postTestEnterprise1();
    requestUtil.buildGetRequest(url)
        .end(function(err, res) {
          should.not.exist(err);
          enterpriseVerifier.verifyEnterprise1Public(res.body[0]);
          done();
        });
  });

});
