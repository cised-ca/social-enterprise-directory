/* eslint-env node, mocha */
const postUtil = require('../../helpers/enterprise/post_util');
const TEST_TIMEOUT = require('../../../test_constants').TEST_TIMEOUT;
const testInitializer = require('../../../test_initializer');
const failTest = require('../../helpers/test_util').failTest;
let mockAuthHandler = require('../../helpers/auth/mock_auth_handler');

describe('POST /enterprise', function() {
  this.timeout(TEST_TIMEOUT);

  beforeEach(function(done) {
    testInitializer.setup(done);
  });

  it('should create testEnterprise1', function(done) {
    postUtil.postTestEnterprise1()
    .then(done)
    .catch(failTest(done));
  });

  it('should create testEnterprise2', function(done) {
    postUtil.postTestEnterprise2()
    .then(done)
    .catch(failTest(done));
  });

  it('should create testEnterprise3', function(done) {
    postUtil.postTestEnterprise3()
    .then(done)
    .catch(failTest(done));
  });

  it('should return 403 Forbidden if not logged in', function(done) {
    mockAuthHandler.reset();
    mockAuthHandler.handler.loggedIn = false;
    postUtil.postTestEnterprise1ExpectError(403)
    .then(done)
    .catch(failTest(done));
  });

  it('should return 403 Forbidden if not directory admin', function(done) {
    mockAuthHandler.reset();
    mockAuthHandler.handler.loggedIn = true;
    mockAuthHandler.handler.isDirectoryAdmin = false;
    postUtil.postTestEnterprise1ExpectError(403)
    .then(done)
    .catch(failTest(done));
  });
});
