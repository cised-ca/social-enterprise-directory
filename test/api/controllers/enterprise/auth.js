/* eslint-env node, mocha */
const should = require('should');
const requestUtil = require('../../helpers/request_util');
const TEST_TIMEOUT = require('../../../test_constants').TEST_TIMEOUT;
let mockAuthHandler = require('../../helpers/auth/mock_auth_handler');
const testInitializer = require('../../../test_initializer');

const url = '/account/permissions';

describe('GET /account/permissions', function() {

  this.timeout(TEST_TIMEOUT);

  beforeEach(function(done) {
    testInitializer.setup(done);
  });

  it('should return 403 Forbidden when not logged in', function(done) {
    mockAuthHandler.handler.loggedIn = false;

    requestUtil.performGetRequest(url, 403)()
    .then( () => {})
    .then(done)
    .catch( err => should.not.exist(err));
  });

  it('should have directoryAdmin flag set when it is a directory admin', function(done) {
    mockAuthHandler.handler.isDirectoryAdmin = true;

    requestUtil.performGetRequest(url)()
    .then( res => {
      res.body.directoryAdmin.should.equal(true);
    })
    .then(done)
    .catch( err => should.not.exist(err));
  });

  it('should have directoryAdmin flag set to false when not a directory admin', function(done) {
    mockAuthHandler.handler.isDirectoryAdmin = false;

    requestUtil.performGetRequest(url)()
    .then( res => {
      res.body.directoryAdmin.should.equal(false);
    })
    .then(done)
    .catch( err => should.not.exist(err));
  });

  it('should return list of authenticated enterprises when not a directory admin', function(done) {
    mockAuthHandler.handler.isDirectoryAdmin = false;
    mockAuthHandler.handler.authenticatedEnterprises = ['1', '2', '3'];

    requestUtil.performGetRequest(url)()
    .then( res => {
      res.body.directoryAdmin.should.equal(false);
      res.body.authenticatedEnterprises.should.eql(['1', '2', '3']);
    })
    .then(done)
    .catch( err => should.not.exist(err));
  });
});
