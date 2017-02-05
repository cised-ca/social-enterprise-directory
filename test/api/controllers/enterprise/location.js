/* eslint-env node, mocha */
const should = require('should');
const dbUtil = require('../../helpers/db/db_util');
const testParameters = require('../../helpers/test_parameters');
const requestUtil = require('../../helpers/request_util');
const postUtil = require('../../helpers/enterprise/post_util');
const enterpriseVerifier = require('../../helpers/enterprise/enterprise_verifier');

const url = '/directory';

describe('GET /directory with location', function() {
  this.timeout(testParameters.TEST_TIMEOUT);

  beforeEach(function(done) {
    dbUtil.cleanDatabase(done);
    postUtil.clean();
  });

  it('should return multiple enterprises sorted by proximity (near enterprise 1)', function(done) {
    postUtil.postAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?at=45.425,-75.692'))
    .then( res => {
      enterpriseVerifier.verifyEnterprise1Public(res.body[0]);
      enterpriseVerifier.verifyEnterprise2Public(res.body[1]);
      enterpriseVerifier.verifyArrayDoesNotContainEnterprise3(res.body);
    })
    .then(done)
    .catch( err => should.not.exist(err));
  });

  it('should return multiple enterprises sorted by proximity (near enterprise 2)', function(done) {
    postUtil.postAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?at=43.725,-75.692'))
    .then( res => {
      enterpriseVerifier.verifyEnterprise2Public(res.body[0]);
      enterpriseVerifier.verifyEnterprise1Public(res.body[1]);
      enterpriseVerifier.verifyArrayDoesNotContainEnterprise3(res.body);
    })
    .then(done)
    .catch( err => should.not.exist(err));
  });

  it('should sort by proximity with count parameter set (near enterprise 2)', function(done) {
    postUtil.postAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?at=43.725,-75.692&count=1'))
    .then( res => {
      enterpriseVerifier.verifyEnterprise2Public(res.body[0]);
      enterpriseVerifier.verifyArrayDoesNotContainEnterprise1(res.body);
      enterpriseVerifier.verifyArrayDoesNotContainEnterprise3(res.body);
    })
    .then(done)
    .catch( err => should.not.exist(err));
  });

  it('should sort by proximity with count and offset parameter set (near enterprise 2)', function(done) {
    postUtil.postAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?at=43.725,-75.6921&offset=1&count=1'))
    .then( res => {
      enterpriseVerifier.verifyEnterprise1Public(res.body[0]);
      enterpriseVerifier.verifyArrayDoesNotContainEnterprise2(res.body);
      enterpriseVerifier.verifyArrayDoesNotContainEnterprise3(res.body);
    })
    .then(done)
    .catch( err => should.not.exist(err));
  });

});
