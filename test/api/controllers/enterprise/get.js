/* eslint-env node, mocha */
const publishUtil = require('../../helpers/enterprise/publish_util');
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
    publishUtil.createAndPublishTestEnterprise1()
    .then(getUtil.getByIdEnterprise1)
    .then(done)
    .catch(failTest(done));
  });

  it('should return enterprise when multiple enterprises in directory', function(done) {
    publishUtil.createAndPublishAllEnterprises()
    .then(getUtil.getByIdEnterprise1)
    .then(getUtil.getByIdEnterprise2)
    .then(getUtil.getByIdEnterprise3)
    .then(done)
    .catch(failTest(done));
  });

  it('should return complete enterprise 1', function(done) {
    publishUtil.createAndPublishTestEnterprise1()
    .then(getUtil.getByIdEnterprise1Complete)
    .then(done)
    .catch(failTest(done));
  });

  it('should return complete enterprise 2', function(done) {
    publishUtil.createAndPublishTestEnterprise2()
    .then(getUtil.getByIdEnterprise2Complete)
    .then(done)
    .catch(failTest(done));
  });

  it('should return complete enterprise 3', function(done) {
    publishUtil.createAndPublishTestEnterprise3()
    .then(getUtil.getByIdEnterprise3Complete)
    .then(done)
    .catch(failTest(done));
  });
});
