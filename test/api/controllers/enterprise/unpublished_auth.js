/* eslint-env node, mocha */
const postUtil = require('../../helpers/enterprise/post_util');
const putUtil = require('../../helpers/enterprise/put_util');
const getUtil = require('../../helpers/enterprise/get_util');
const deleteUtil = require('../../helpers/enterprise/delete_util');
const patchUtil = require('../../helpers/enterprise/patch_util');
const TEST_TIMEOUT = require('../../../test_constants').TEST_TIMEOUT;
const testInitializer = require('../../../test_initializer');
const failTest = require('../../helpers/test_util').failTest;
let mockAuthHandler = require('../../helpers/auth/mock_auth_handler');
const replaceEnterprise1 = require('../../helpers/data/enterprise/replacementData/replaceEnterprise1');

describe('Authentication on Unpublished Enterprises', function() {
  this.timeout(TEST_TIMEOUT);

  beforeEach(function(done) {
    testInitializer.setup(done);
  });

  it('should return 403 Forbidden if not logged in and GET unpublished', function(done) {
    postUtil.postTestEnterprise1()
    .then(() => {
      return putUtil.putUnpublishedEnterprise(postUtil.getTestEnterprise1Id(), replaceEnterprise1);
    })
    .then(() => {
      mockAuthHandler.reset();
      mockAuthHandler.handler.loggedIn = false;
      return getUtil.getByIdUnpublishedEnterprise1ExpectError(403);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return 403 Forbidden if not directory enterprise admin and GET unpublished', function(done) {
    postUtil.postTestEnterprise1()
    .then(() => {
      return putUtil.putUnpublishedEnterprise(postUtil.getTestEnterprise1Id(), replaceEnterprise1);
    })
    .then(() => {
      mockAuthHandler.reset();
      mockAuthHandler.handler.loggedIn = true;
      mockAuthHandler.handler.isDirectoryAdmin = false;
      mockAuthHandler.handler.isEnterpriseAdmin = true;
      return getUtil.getByIdUnpublishedEnterprise1ExpectError(403);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return 403 Forbidden if not logged in and DELETE unpublished', function(done) {
    postUtil.postTestEnterprise1()
    .then(() => {
      return putUtil.putUnpublishedEnterprise(postUtil.getTestEnterprise1Id(), replaceEnterprise1);
    })
    .then(() => {
      mockAuthHandler.reset();
      mockAuthHandler.handler.loggedIn = false;
      return deleteUtil.deleteUnpublishedEnterprise1(403);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return 403 Forbidden if not directory admin and DELETE unpublished', function(done) {
    postUtil.postTestEnterprise1()
    .then(() => {
      return putUtil.putUnpublishedEnterprise(postUtil.getTestEnterprise1Id(), replaceEnterprise1);
    })
    .then(() => {
      mockAuthHandler.reset();
      mockAuthHandler.handler.loggedIn = true;
      mockAuthHandler.handler.isDirectoryAdmin = false;
      mockAuthHandler.handler.isEnterpriseAdmin = true;
      return deleteUtil.deleteUnpublishedEnterprise1(403);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return 403 Forbidden if not logged in and PATCH unpublished', function(done) {
    let newEnglishDescription = 'A new description for Cycle Salvation';
    let newFrenchDescription = 'Nouvelle description';
    postUtil.postTestEnterprise1()
    .then(() => {
      return putUtil.putUnpublishedEnterprise(postUtil.getTestEnterprise1Id(), replaceEnterprise1);
    })
    .then(() => {
      mockAuthHandler.reset();
      mockAuthHandler.handler.loggedIn = false;
      return patchUtil.editUnpublishedEnterprise1({
        en: {description: newEnglishDescription},
        fr: {description: newFrenchDescription}
      }, 403);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return 403 Forbidden if not directory admin and PATCH unpublished', function(done) {
    let newEnglishDescription = 'A new description for Cycle Salvation';
    let newFrenchDescription = 'Nouvelle description';
    postUtil.postTestEnterprise1()
    .then(() => {
      return putUtil.putUnpublishedEnterprise(postUtil.getTestEnterprise1Id(), replaceEnterprise1);
    })
    .then(() => {
      mockAuthHandler.reset();
      mockAuthHandler.handler.loggedIn = true;
      mockAuthHandler.handler.isDirectoryAdmin = false;
      mockAuthHandler.handler.isEnterpriseAdmin = true;
      return patchUtil.editUnpublishedEnterprise1({
        en: {description: newEnglishDescription},
        fr: {description: newFrenchDescription}
      }, 403);
    })
    .then(done)
    .catch(failTest(done));
  });

});
