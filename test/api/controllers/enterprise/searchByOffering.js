/* eslint-env node, mocha */
const requestUtil = require('../../helpers/request_util');
const publishUtil = require('../../helpers/enterprise/publish_util');
const enterpriseVerifier = require('../../helpers/enterprise/enterprise_verifier');
const TEST_TIMEOUT = require('../../../test_constants').TEST_TIMEOUT;
const testInitializer = require('../../../test_initializer');
const failTest = require('../../helpers/test_util').failTest;

const URL = '/directory/offering';

describe('Search /directory/offering', function() {
  this.timeout(TEST_TIMEOUT);

  beforeEach(function(done) {
    testInitializer.setup(done);
  });

  it('should return only the one enterprise matching search item', function(done) {
    publishUtil.createAndPublishAllEnterprises()
    .then(requestUtil.performGetRequest(URL + '?q=Event%20Space'))
    .then( res => {
      res.body.enterprises.length.should.equal(1);
      enterpriseVerifier.verifyArrayContainsEnterprise1(res.body.enterprises);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return multiple enterprises matching search item', function(done) {
    publishUtil.createAndPublishAllEnterprises()
    .then(requestUtil.performGetRequest(URL + '?q=Event%20Management'))
    .then( res => {
      res.body.enterprises.length.should.equal(2);
      enterpriseVerifier.verifyArrayContainsEnterprise1(res.body.enterprises);
      enterpriseVerifier.verifyArrayContainsEnterprise2(res.body.enterprises);
    })
    .then(done)
    .catch(failTest(done));
  });

});
