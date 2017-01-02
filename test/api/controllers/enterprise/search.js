/* eslint-env node, mocha */
const should = require('should');
const dbUtil = require('../../helpers/db/db_util');
const requestUtil = require('../../helpers/request_util');
const postUtil = require('../../helpers/enterprise/post_util');
const enterpriseVerifier = require('../../helpers/enterprise/enterprise_verifier');

const url = '/directory';

describe('Search /directory', function() {

  beforeEach(function(done) {
    dbUtil.cleanDatabase(done);
    postUtil.clean();
  });

  it('should return only the one enterprise matching search item', function(done) {
    let doSearchRequest = function() {
      requestUtil.buildGetRequest(url + '?q=cycle')
        .end(function(err, res) {
          should.not.exist(err);
          res.body.length.should.equal(1);
          enterpriseVerifier.verifyArrayContainsEnterprise1(res.body);
          done();
        });
    };

    postUtil.postAllEnterprises(doSearchRequest);
  });

  it('should return multiple enterprises matching search item', function(done) {
    let doSearchRequest = function() {
      requestUtil.buildGetRequest(url + '?q=social')
        .end(function(err, res) {
          should.not.exist(err);
          res.body.length.should.equal(2);
          enterpriseVerifier.verifyArrayContainsEnterprise1(res.body);
          enterpriseVerifier.verifyArrayContainsEnterprise2(res.body);
          done();
        });
    };

    postUtil.postAllEnterprises(doSearchRequest);
  });


  it('should return enterprises matching multiple search items', function(done) {
    let doSearchRequest = function() {
      requestUtil.buildGetRequest(url + '?q=cycle+good')
        .end(function(err, res) {
          should.not.exist(err);
          res.body.length.should.equal(2);
          enterpriseVerifier.verifyArrayContainsEnterprise1(res.body);
          enterpriseVerifier.verifyArrayContainsEnterprise2(res.body);
          done();
        });
    };

    postUtil.postAllEnterprises(doSearchRequest);
  });

  it('should weight enterprise name over description for search', function(done) {
    let doSearchRequest = function() {
      requestUtil.buildGetRequest(url + '?q=good+social')
        .end(function(err, res) {
          should.not.exist(err);
          res.body.length.should.equal(2);

          // expect results in this exact order
          enterpriseVerifier.verifyEnterprise2Public(res.body[0]);
          enterpriseVerifier.verifyEnterprise1Public(res.body[1]);
          done();
        });
    };

    postUtil.postAllEnterprises(doSearchRequest);
  });


  it('should match search on twitter handle', function(done) {
    let doSearchRequest = function() {
      requestUtil.buildGetRequest(url + '?q=abhoney')
        .end(function(err, res) {
          should.not.exist(err);
          res.body.length.should.equal(1);
          enterpriseVerifier.verifyEnterprise1Public(res.body[0]);
          done();
        });
    };
    postUtil.postAllEnterprises(doSearchRequest);
  });

});
