/* eslint-env node, mocha */
const publishUtil = require('../../helpers/enterprise/publish_util');
const requestUtil = require('../../helpers/request_util');
const putUtil = require('../../helpers/enterprise/put_util');
const getUtil = require('../../helpers/enterprise/get_util');
const enterpriseVerifier = require('../../helpers/enterprise/enterprise_verifier');
const TEST_TIMEOUT = require('../../../test_constants').TEST_TIMEOUT;
const FRENCH = require('../../helpers/language/language_test_constants').FRENCH;
const testInitializer = require('../../../test_initializer');
const failTest = require('../../helpers/test_util').failTest;
let mockAuthHandler = require('../../helpers/auth/mock_auth_handler');
const replaceEnterprise1 = require('../../helpers/data/enterprise/replacementData/replaceEnterprise1');
const replaceEnterprise1_public_en = require('../../helpers/data/enterprise/replacementData/replaceEnterprise1_public_en');
const replaceEnterprise1_public_fr = require('../../helpers/data/enterprise/replacementData/replaceEnterprise1_public_fr');

const DIRECTORY_URL = '/directory';

describe('test PUT /enterprise/{id}', function() {
  this.timeout(TEST_TIMEOUT);

  beforeEach(function(done) {
    testInitializer.setup(done);
  });

  it('should return 403 Forbidden if not logged in', function(done) {
    publishUtil.createAndPublishTestEnterprise1()
    .then(() => {
      mockAuthHandler.reset();
      mockAuthHandler.handler.loggedIn = false;
      return putUtil.putEnterprise(publishUtil.getTestEnterprise1Id(), replaceEnterprise1, 403);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return 403 Forbidden if not directory admin', function(done) {
    publishUtil.createAndPublishTestEnterprise1()
    .then(() => {
      mockAuthHandler.reset();
      mockAuthHandler.handler.loggedIn = true;
      mockAuthHandler.handler.isDirectoryAdmin = false;
      mockAuthHandler.handler.isEnterpriseAdmin = true;
      return putUtil.putEnterprise(publishUtil.getTestEnterprise1Id(), replaceEnterprise1, 403);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should replace testEnterprise1', function(done) {
    publishUtil.createAndPublishTestEnterprise1()
    .then(() => {
      return putUtil.putEnterprise(publishUtil.getTestEnterprise1Id(), replaceEnterprise1);
    })
    .then(getUtil.getEnterprise1)
    .then(body => {
      enterpriseVerifier.verifyEnterprisePublic(replaceEnterprise1_public_en, body);
      return Promise.resolve();
    })
    .then(() => {
      return getUtil.getEnterprise1(FRENCH);
    })
    .then(body => {
      enterpriseVerifier.verifyEnterprisePublic(replaceEnterprise1_public_fr, body);
      return Promise.resolve();
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should affect search results when replace testEnterprise1', function(done) {
    publishUtil.createAndPublishTestEnterprise1()
    .then(requestUtil.performGetRequest(DIRECTORY_URL + '?q=abhoney2'))
    .then( res => {
      res.body.enterprises.length.should.equal(0);
    })
    .then(() => {
      return putUtil.putEnterprise(publishUtil.getTestEnterprise1Id(), replaceEnterprise1);
    })
    .then(requestUtil.performGetRequest(DIRECTORY_URL + '?q=abhoney2'))
    .then( res => {
      res.body.enterprises.length.should.equal(1);
      return Promise.resolve();
    })
    .then(done)
    .catch(failTest(done));
  });

});
