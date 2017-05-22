/* eslint-env node, mocha */
const requestUtil = require('../../helpers/request_util');
const postUtil = require('../../helpers/enterprise/post_util');
const enterpriseVerifier = require('../../helpers/enterprise/enterprise_verifier');
const TEST_TIMEOUT = require('../../../test_constants').TEST_TIMEOUT;
const testInitializer = require('../../../test_initializer');
const failTest = require('../../helpers/test_util').failTest;

const url = '/directory';

describe('GET /directory', function() {
  this.timeout(TEST_TIMEOUT);

  beforeEach(function(done) {
    testInitializer.setup(done);
  });

  it('should return empty directory', function(done) {
    requestUtil.performGetRequest(url)()
    .then( res => {
      res.body.enterprises.should.be.instanceof(Array).and.have.lengthOf(0);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return one enterprise', function(done) {
    postUtil.postTestEnterprise1()
    .then(requestUtil.performGetRequest(url))
    .then( res => {
      enterpriseVerifier.verifyEnterprise1Public(res.body.enterprises[0]);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return multiple enterprises in alphabetical order', function(done) {
    postUtil.postAllEnterprises()
    .then(requestUtil.performGetRequest(url))
    .then( res => {
      enterpriseVerifier.verifyEnterprise3Public(res.body.enterprises[0]);
      enterpriseVerifier.verifyEnterprise1Public(res.body.enterprises[1]);
      enterpriseVerifier.verifyEnterprise2Public(res.body.enterprises[2]);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should limit enterprises when count parameter set', function(done) {
    postUtil.postAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?count=2'))
    .then( res => {
      res.body.enterprises.length.should.equal(2);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should offset enterprises when page parameter set', function(done) {
    postUtil.postAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?count=1&page=3'))
    .then( res => {
      res.body.enterprises.length.should.equal(1);
      enterpriseVerifier.verifyArrayContainsEnterprise2(res.body.enterprises);
    })
    .then(done)
    .catch(failTest(done));
  });


});
