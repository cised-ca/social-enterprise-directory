/* eslint-env node, mocha */
const postUtil = require('../../helpers/enterprise/post_util');
const TEST_TIMEOUT = require('../../../test_constants').TEST_TIMEOUT;
const testInitializer = require('../../../test_initializer');

describe('POST /enterprise', function() {
  this.timeout(TEST_TIMEOUT);

  beforeEach(function(done) {
    testInitializer.setup(done);
  });

  it('should create testEnterprise1', function(done) {
    postUtil.postTestEnterprise1()
    .then(done);
  });

  it('should create testEnterprise2', function(done) {
    postUtil.postTestEnterprise2()
    .then(done);
  });

  it('should create testEnterprise3', function(done) {
    postUtil.postTestEnterprise3()
    .then(done);
  });
});
