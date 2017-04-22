/* eslint-env node, mocha */
const should = require('should');
const postUtil = require('../../helpers/enterprise/post_util');
const getUtil = require('../../helpers/enterprise/get_util');
const TEST_TIMEOUT = require('../../../test_constants').TEST_TIMEOUT;
const testInitializer = require('../../../test_initializer');

const FRENCH = 'fr';
const INVALID_LANGUAGE = 'zz';

describe('Testing internationalization', function() {
  this.timeout(TEST_TIMEOUT);

  beforeEach(function(done) {
    testInitializer.setup(done);
  });

  it('should return only the french data when get one enterprise', function(done) {
    postUtil.postTestEnterprise1()
    .then(() => {
      return getUtil.getByIdEnterprise1(FRENCH);
    })
    .then(done)
    .catch( err => should.not.exist(err));
  });

  it('should return english data if desired language not supported', function(done) {
    postUtil.postTestEnterprise1()
    .then(() => {
      return getUtil.getByIdEnterprise1(INVALID_LANGUAGE);
    })
    .then(done)
    .catch( err => should.not.exist(err));
  });

});
