/* eslint-env node, mocha */
const testParameters = require('../../helpers/test_parameters');
const dbUtil = require('../../helpers/db/db_util');
const postUtil = require('../../helpers/enterprise/post_util');

describe('POST /enterprise', function() {

  this.timeout(testParameters.TEST_TIMEOUT);

  beforeEach(function(done) {
    dbUtil.cleanDatabase(done);
    postUtil.clean();
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
