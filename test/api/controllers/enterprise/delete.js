/* eslint-env node, mocha */
const publishUtil = require('../../helpers/enterprise/publish_util');
const deleteUtil = require('../../helpers/enterprise/delete_util');
const getUtil = require('../../helpers/enterprise/get_util');
const TEST_TIMEOUT = require('../../../test_constants').TEST_TIMEOUT;
const testInitializer = require('../../../test_initializer');
const failTest = require('../../helpers/test_util').failTest;
let mockAuthHandler = require('../../helpers/auth/mock_auth_handler');

describe('DELETE /enterprise/{id}', function() {
  this.timeout(TEST_TIMEOUT);

  beforeEach(function(done) {
    testInitializer.setup(done);
  });

  it('should return 403 Forbidden if not logged in', function(done) {
    publishUtil.createAndPublishTestEnterprise1()
    .then(() => {
      mockAuthHandler.reset();
      mockAuthHandler.handler.loggedIn = false;
      return deleteUtil.deleteEnterprise1(403);
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
      return deleteUtil.deleteEnterprise1(403);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should delete enterprise 1', function(done) {
    publishUtil.createAndPublishAllEnterprises()
    .then(() => {
      return deleteUtil.deleteEnterprise1();
    })
    .then(() => {
      return getUtil.getByIdEnterprise1ExpectError(404);
    })
    // ensure other enterprises weren't deleted
    .then(getUtil.getByIdEnterprise2)
    .then(getUtil.getByIdEnterprise3)
    .then(done)
    .catch(failTest(done));
  });

  it('should delete enterprise 2', function(done) {
    publishUtil.createAndPublishAllEnterprises()
    .then(() => {
      return deleteUtil.deleteEnterprise2();
    })
    .then(() => {
      return getUtil.getByIdEnterprise2ExpectError(404);
    })
    // ensure other enterprises weren't deleted
    .then(getUtil.getByIdEnterprise1)
    .then(getUtil.getByIdEnterprise3)
    .then(done)
    .catch(failTest(done));
  });

});
