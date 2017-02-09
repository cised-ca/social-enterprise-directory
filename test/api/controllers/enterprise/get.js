/* eslint-env node, mocha */
const testParameters = require('../../helpers/test_parameters');
const dbUtil = require('../../helpers/db/db_util');
const postUtil = require('../../helpers/enterprise/post_util');
const getUtil = require('../../helpers/enterprise/get_util');

describe('GET /enterprise', function() {

  this.timeout(testParameters.TEST_TIMEOUT);

  beforeEach(function(done) {
    dbUtil.cleanDatabase(done);
    postUtil.clean();
  });

  it('should return enterprise', function(done) {
    postUtil.postTestEnterprise1()
    .then(getUtil.getByIdEnterprise1)
    .then(done);
  });

  it('should return enterprise when multiple enterprises in directory', function(done) {
    postUtil.postAllEnterprises()
    .then(getUtil.getByIdEnterprise1)
    .then(getUtil.getByIdEnterprise2)
    .then(getUtil.getByIdEnterprise3)
    .then(done);
  });

});
