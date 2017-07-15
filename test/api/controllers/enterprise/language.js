/* eslint-env node, mocha */
const publishUtil = require('../../helpers/enterprise/publish_util');
const getUtil = require('../../helpers/enterprise/get_util');
const requestUtil = require('../../helpers/request_util');
const enterpriseVerifier = require('../../helpers/enterprise/enterprise_verifier');
const TEST_TIMEOUT = require('../../../test_constants').TEST_TIMEOUT;
const testInitializer = require('../../../test_initializer');
const failTest = require('../../helpers/test_util').failTest;

const FRENCH = require('../../helpers/language/language_test_constants').FRENCH;
const ENGLISH = require('../../helpers/language/language_test_constants').ENGLISH;
const INVALID_LANGUAGE = 'zz';

const DIRECTORY_URL = '/directory';

describe('Testing internationalization', function() {
  this.timeout(TEST_TIMEOUT);

  beforeEach(function(done) {
    testInitializer.setup(done);
  });

  it('should return only the french data when get one enterprise', function(done) {
    publishUtil.createAndPublishTestEnterprise1()
    .then(() => {
      return getUtil.getByIdEnterprise1(FRENCH);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return only the english data when get one enterprise', function(done) {
    publishUtil.createAndPublishTestEnterprise1()
    .then(() => {
      return getUtil.getByIdEnterprise1(ENGLISH);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return english data if requested language not supported', function(done) {
    publishUtil.createAndPublishTestEnterprise1()
    .then(() => {
      return getUtil.getByIdEnterprise1(INVALID_LANGUAGE);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return french data when browse directory with one enterprise', function(done) {
    publishUtil.createAndPublishTestEnterprise1()
    .then(requestUtil.performGetRequest(DIRECTORY_URL + '?lang=' + FRENCH))
    .then( res => {
      enterpriseVerifier.verifyEnterprise1Public(res.body.enterprises[0], FRENCH);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return french data for multiple enterprises in alphabetical order', function(done) {
    publishUtil.createAndPublishAllEnterprises()
    .then(requestUtil.performGetRequest(DIRECTORY_URL + '?lang=' + FRENCH))
    .then( res => {
      enterpriseVerifier.verifyEnterprise3Public(res.body.enterprises[0], FRENCH);
      enterpriseVerifier.verifyEnterprise2Public(res.body.enterprises[1], FRENCH);
      enterpriseVerifier.verifyEnterprise1Public(res.body.enterprises[2], FRENCH);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return french data for location search (near enterprise 1)', function(done) {
    publishUtil.createAndPublishAllEnterprises()
    .then(requestUtil.performGetRequest(DIRECTORY_URL + '?at=45.425,-75.692&lang=' + FRENCH))
    .then( res => {
      enterpriseVerifier.verifyEnterprise1Public(res.body.enterprises[0], FRENCH);
      enterpriseVerifier.verifyEnterprise2Public(res.body.enterprises[1], FRENCH);
      enterpriseVerifier.verifyArrayDoesNotContainEnterprise3(res.body.enterprises);
    })
    .then(done)
    .catch(failTest(done));
  });

});
