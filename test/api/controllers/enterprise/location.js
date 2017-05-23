/* eslint-env node, mocha */
const dbUtil = require('../../helpers/db/db_util');
const requestUtil = require('../../helpers/request_util');
const postUtil = require('../../helpers/enterprise/post_util');
const enterpriseVerifier = require('../../helpers/enterprise/enterprise_verifier');
const TEST_TIMEOUT = require('../../../test_constants').TEST_TIMEOUT;
const failTest = require('../../helpers/test_util').failTest;

const url = '/directory';

describe('GET /directory with location', function() {
  this.timeout(TEST_TIMEOUT);

  beforeEach(function(done) {
    dbUtil.cleanDatabase(done);
    postUtil.clean();
  });

  it('should return multiple enterprises sorted by proximity (near enterprise 1)', function(done) {
    postUtil.postAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?at=45.425,-75.692'))
    .then( res => {
      enterpriseVerifier.verifyEnterprise1Public(res.body.enterprises[0]);
      enterpriseVerifier.verifyEnterprise2Public(res.body.enterprises[1]);
      enterpriseVerifier.verifyArrayDoesNotContainEnterprise3(res.body.enterprises);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return multiple enterprises sorted by proximity (near enterprise 2)', function(done) {
    postUtil.postAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?at=43.725,-75.692'))
    .then( res => {
      enterpriseVerifier.verifyEnterprise2Public(res.body.enterprises[0]);
      enterpriseVerifier.verifyEnterprise1Public(res.body.enterprises[1]);
      enterpriseVerifier.verifyArrayDoesNotContainEnterprise3(res.body.enterprises);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should sort by proximity with count parameter set (near enterprise 2)', function(done) {
    postUtil.postAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?at=43.725,-75.692&count=1'))
    .then( res => {
      enterpriseVerifier.verifyEnterprise2Public(res.body.enterprises[0]);
      enterpriseVerifier.verifyArrayDoesNotContainEnterprise1(res.body.enterprises);
      enterpriseVerifier.verifyArrayDoesNotContainEnterprise3(res.body.enterprises);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should sort by proximity with count and page parameter set (near enterprise 2)', function(done) {
    postUtil.postAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?at=43.725,-75.6921&page=2&count=1'))
    .then( res => {
      enterpriseVerifier.verifyEnterprise1Public(res.body.enterprises[0]);
      enterpriseVerifier.verifyArrayDoesNotContainEnterprise2(res.body.enterprises);
      enterpriseVerifier.verifyArrayDoesNotContainEnterprise3(res.body.enterprises);
    })
    .then(done)
    .catch(failTest(done));
  });

});
