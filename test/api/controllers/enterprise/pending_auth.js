/* eslint-env node, mocha */
const publishUtil = require('../../helpers/enterprise/publish_util');
const putUtil = require('../../helpers/enterprise/put_util');
const getUtil = require('../../helpers/enterprise/get_util');
const deleteUtil = require('../../helpers/enterprise/delete_util');
const patchUtil = require('../../helpers/enterprise/patch_util');
const TEST_TIMEOUT = require('../../../test_constants').TEST_TIMEOUT;
const testInitializer = require('../../../test_initializer');
const failTest = require('../../helpers/test_util').failTest;
let mockAuthHandler = require('../../helpers/auth/mock_auth_handler');
const replaceEnterprise1 = require('../../helpers/data/enterprise/replacementData/replaceEnterprise1');

describe('Authentication on Pending Enterprises', function() {
  this.timeout(TEST_TIMEOUT);

  beforeEach(function(done) {
    testInitializer.setup(done);
  });

  it('should return 403 Forbidden if not logged in and GET pending', function(done) {
    publishUtil.createAndPublishTestEnterprise1()
    .then(() => {
      return putUtil.putPendingEnterprise(publishUtil.getTestEnterprise1Id(), replaceEnterprise1);
    })
    .then(() => {
      mockAuthHandler.reset();
      mockAuthHandler.handler.loggedIn = false;
      return getUtil.getByIdPendingEnterprise1ExpectError(403);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return 403 Forbidden if not proper enterprise admin and GET pending', function(done) {
    publishUtil.createAndPublishTestEnterprise1()
    .then(() => {
      return putUtil.putPendingEnterprise(publishUtil.getTestEnterprise1Id(), replaceEnterprise1);
    })
    .then(() => {
      mockAuthHandler.reset();
      mockAuthHandler.handler.loggedIn = true;
      mockAuthHandler.handler.isDirectoryAdmin = false;
      mockAuthHandler.handler.isEnterpriseAdmin = false;
      return getUtil.getByIdPendingEnterprise1ExpectError(403);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return 403 Forbidden if not logged in and DELETE pending', function(done) {
    publishUtil.createAndPublishTestEnterprise1()
    .then(() => {
      return putUtil.putPendingEnterprise(publishUtil.getTestEnterprise1Id(), replaceEnterprise1);
    })
    .then(() => {
      mockAuthHandler.reset();
      mockAuthHandler.handler.loggedIn = false;
      return deleteUtil.deletePendingEnterprise1(403);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return 403 Forbidden if not proper enterprise admin and DELETE pending', function(done) {
    publishUtil.createAndPublishTestEnterprise1()
    .then(() => {
      return putUtil.putPendingEnterprise(publishUtil.getTestEnterprise1Id(), replaceEnterprise1);
    })
    .then(() => {
      mockAuthHandler.reset();
      mockAuthHandler.handler.loggedIn = true;
      mockAuthHandler.handler.isDirectoryAdmin = false;
      mockAuthHandler.handler.isEnterpriseAdmin = false;
      return deleteUtil.deletePendingEnterprise1(403);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return 403 Forbidden if not logged in and PATCH pending', function(done) {
    let newEnglishDescription = 'A new description for Cycle Salvation';
    let newFrenchDescription = 'Nouvelle description';
    publishUtil.createAndPublishTestEnterprise1()
    .then(() => {
      return putUtil.putPendingEnterprise(publishUtil.getTestEnterprise1Id(), replaceEnterprise1);
    })
    .then(() => {
      mockAuthHandler.reset();
      mockAuthHandler.handler.loggedIn = false;
      return patchUtil.editPendingEnterprise1({
        en: {description: newEnglishDescription},
        fr: {description: newFrenchDescription}
      }, 403);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return 403 Forbidden if not proper enterprise admin and PATCH pending', function(done) {
    let newEnglishDescription = 'A new description for Cycle Salvation';
    let newFrenchDescription = 'Nouvelle description';
    publishUtil.createAndPublishTestEnterprise1()
    .then(() => {
      return putUtil.putPendingEnterprise(publishUtil.getTestEnterprise1Id(), replaceEnterprise1);
    })
    .then(() => {
      mockAuthHandler.reset();
      mockAuthHandler.handler.loggedIn = true;
      mockAuthHandler.handler.isDirectoryAdmin = false;
      mockAuthHandler.handler.isEnterpriseAdmin = false;
      return patchUtil.editPendingEnterprise1({
        en: {description: newEnglishDescription},
        fr: {description: newFrenchDescription}
      }, 403);
    })
    .then(done)
    .catch(failTest(done));
  });

});
