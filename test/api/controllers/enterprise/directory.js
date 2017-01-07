/* eslint-env node, mocha */
const should = require('should');
const dbUtil = require('../../helpers/db/db_util');
const requestUtil = require('../../helpers/request_util');
const postUtil = require('../../helpers/enterprise/post_util');
const enterpriseVerifier = require('../../helpers/enterprise/enterprise_verifier');

const url = '/directory';

describe('GET /directory', function() {

  beforeEach(function(done) {
    dbUtil.cleanDatabase(done);
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
    postUtil.postTestEnterprise1()
    .then( () => {
      requestUtil.buildGetRequest(url)
        .end(function(err, res) {
          should.not.exist(err);
          enterpriseVerifier.verifyEnterprise1Public(res.body[0]);
          done();
        });
    });
  });

  it('should return multiple enterprises in alphabetical order', function(done) {
    postUtil.postAllEnterprises()
    .then( () => {
      requestUtil.buildGetRequest(url)
          .end(function(err, res) {
            should.not.exist(err);
            enterpriseVerifier.verifyEnterprise3Public(res.body[0]);
            enterpriseVerifier.verifyEnterprise1Public(res.body[1]);
            enterpriseVerifier.verifyEnterprise2Public(res.body[2]);
            done();
          });
    });

  });

  it('should limit enterprises when count parameter set', function(done) {
    postUtil.postAllEnterprises()
    .then( () => {
      requestUtil.buildGetRequest(url + '?count=2')
        .end(function(err, res) {
          should.not.exist(err);
          res.body.length.should.equal(2);
          done();
        });
    });
  });

  it('should offset enterprises when offset parameter set', function(done) {
    postUtil.postAllEnterprises()
    .then( () => {
      requestUtil.buildGetRequest(url + '?count=1&offset=2')
        .end(function(err, res) {
          should.not.exist(err);
          res.body.length.should.equal(1);
          enterpriseVerifier.verifyArrayContainsEnterprise2(res.body);
          done();
        });
    });
  });


});
