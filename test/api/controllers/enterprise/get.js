/* eslint-env node, mocha */
const postUtil = require('../../helpers/enterprise/post_util');
const getUtil = require('../../helpers/enterprise/get_util');
const TEST_TIMEOUT = require('../../../test_constants').TEST_TIMEOUT;
const testInitializer = require('../../../test_initializer');
const failTest = require('../../helpers/test_util').failTest;

describe('GET /enterprise', function() {
  this.timeout(TEST_TIMEOUT);

  beforeEach(function(done) {
    testInitializer.setup(done);
  });

  it('should return enterprise', function(done) {
    postUtil.postTestEnterprise1()
    .then(getUtil.getByIdEnterprise1)
    .then(done)
    .catch(failTest(done));
  });

  it('should return enterprise when multiple enterprises in directory', function(done) {
    postUtil.postAllEnterprises()
    .then(getUtil.getByIdEnterprise1)
    .then(getUtil.getByIdEnterprise2)
    .then(getUtil.getByIdEnterprise3)
    .then(done)
    .catch(failTest(done));
  });

});
