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
    postUtil.clean();
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
    var doDirectoryRequest = function() {
      requestUtil.buildGetRequest(url)
        .end(function(err, res) {
          should.not.exist(err);
          enterpriseVerifier.verifyEnterprise1Public(res.body[0]);
          done();
        });
    };

    postUtil.postTestEnterprise1(doDirectoryRequest);
  });

  it('should return multiple enterprises', function(done) {
    var doDirectoryRequest = function() {
      requestUtil.buildGetRequest(url)
          .end(function(err, res) {
            should.not.exist(err);
            enterpriseVerifier.verifyArrayContainsEnterprise1(res.body);
            enterpriseVerifier.verifyArrayContainsEnterprise2(res.body);
            enterpriseVerifier.verifyArrayContainsEnterprise3(res.body);
            done();
          });
    };

    postUtil.postAllEnterprises(doDirectoryRequest);
  });

});
