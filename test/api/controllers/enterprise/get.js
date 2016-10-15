/* eslint-env node, mocha */
var should = require('should');
var dbUtil = require('../../helpers/db/db_util');
var requestUtil = require('../../helpers/request_util');
var postUtil = require('../../helpers/enterprise/post_util');
var enterpriseVerifier = require('../../helpers/enterprise/enterprise_verifier');

var url = '/enterprise/';

function doGetEnterprise1(done) {
  return function() {
    requestUtil.buildGetRequest(url + postUtil.getTestEnterprise1Id())
      .end(function(err, res) {
        should.not.exist(err);
        enterpriseVerifier.verifyEnterprise1Public(res.body);
        done();
      });
  };
}

function doGetEnterprise2(done) {
  return function() {
    requestUtil.buildGetRequest(url + postUtil.getTestEnterprise2Id())
        .end(function(err, res) {
          should.not.exist(err);
          enterpriseVerifier.verifyEnterprise2Public(res.body);
          done();
        });
  };
}

function doGetEnterprise3(done) {
  return function() {
    requestUtil.buildGetRequest(url + postUtil.getTestEnterprise3Id())
        .end(function(err, res) {
          should.not.exist(err);
          enterpriseVerifier.verifyEnterprise3Public(res.body);
          done();
        });
  };
}

describe('GET /enterprise', function() {

  beforeEach(function(done) {
    dbUtil.cleanDatabase(done);
    postUtil.clean();
  });

  it('should return enterprise', function(done) {
    postUtil.postTestEnterprise1(doGetEnterprise1(done));
  });

  it('should return enterprise when multiple enterprises in directory', function(done) {
    var doGetRequests = doGetEnterprise1(
                          doGetEnterprise2(
                            doGetEnterprise3(
                              done)));

    postUtil.postAllEnterprises(doGetRequests);
  });

});
