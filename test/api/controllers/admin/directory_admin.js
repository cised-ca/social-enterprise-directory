/* eslint-env node, mocha */
const should = require('should');
const logger = require('../../../../lib/logger');
const requestUtil = require('../../helpers/request_util');
const TEST_TIMEOUT = require('../../../test_constants').TEST_TIMEOUT;
const testInitializer = require('../../../test_initializer');
const failTest = require('../../helpers/test_util').failTest;
let mockAuthHandler = require('../../helpers/auth/mock_auth_handler');

const URL = '/directoryAdmin';

function putDirectoryAdmins(admins, statusCode) {
  return new Promise( (resolve) => {
    requestUtil.buildPutRequest(URL, statusCode)
    .send(admins)
    .end( function(err, res) {
      if (err) {
        logger.error(res.body);
        should.not.exist(err);
      }
      resolve();
    });
  });
}

describe('/directoryAdmin', function() {
  this.timeout(TEST_TIMEOUT);

  function resetDirectoryAdmins(done) {
    putDirectoryAdmins([{'email': 'default@test.com'}])
    .then(done)
    .catch(failTest(done));
  }

  beforeEach(function(done) {
    testInitializer.setup(
      () => {resetDirectoryAdmins(done); }
    );
  });

  it('should not let you delete all enterprise admins', function(done) {
    let directoryAdmins = [];
    putDirectoryAdmins(directoryAdmins, 400)
    .then(done)
    .catch(failTest(done));
  });

  it('should add directory admins and get them', function(done) {
    let directoryAdmins =
      [
        {'email': 'test@test.com'},
        {'email': 'test2@test2.com'}
      ];
    putDirectoryAdmins(directoryAdmins)
    .then(requestUtil.performGetRequest(URL))
    .then(res => {
      res.body.should.eql(directoryAdmins);
      return Promise.resolve();
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should update directory admins and delete some', function(done) {
    let initialDrectoryAdmins =
      [
        {'email': 'test@test.com'},
        {'email': 'test2@test2.com'}
      ];
    let finalDrectoryAdmins =
      [
        {'email': 'test2@test2.com'},
        {'email': 'test3@test3.com'}
      ];
    putDirectoryAdmins(initialDrectoryAdmins)
    .then(requestUtil.performGetRequest(URL))
    .then(res => {
      res.body.should.eql(initialDrectoryAdmins);
      return Promise.resolve();
    })
    .then(() => {
      return putDirectoryAdmins(finalDrectoryAdmins);
    })
    .then(requestUtil.performGetRequest(URL))
    .then(res => {
      res.body.should.eql(finalDrectoryAdmins);
      return Promise.resolve();
    })
    .then(done)
    .catch(failTest(done));
  });


  it('should return 403 Forbidden if not logged in and GET', function(done) {
    mockAuthHandler.reset();
    mockAuthHandler.handler.loggedIn = false;
    requestUtil.performGetRequest(URL, 403)()
    .then(() => {done();})
    .catch(failTest(done));
  });

  it('should return 403 Forbidden if not directory admin and GET', function(done) {
    mockAuthHandler.reset();
    mockAuthHandler.handler.loggedIn = true;
    mockAuthHandler.handler.isDirectoryAdmin = false;
    mockAuthHandler.handler.isEnterpriseAdmin = true;
    requestUtil.performGetRequest(URL, 403)()
    .then(() => {done();})
    .catch(failTest(done));
  });

  it('should return 403 Forbidden if not logged in and PUT', function(done) {
    let directoryAdmins =[{'email': 'test@test.com'}];
    mockAuthHandler.reset();
    mockAuthHandler.handler.loggedIn = false;
    putDirectoryAdmins(directoryAdmins, 403)
    .then(done)
    .catch(failTest(done));
  });

  it('should return 403 Forbidden if not directory admin and PUT', function(done) {
    let directoryAdmins =[{'email': 'test@test.com'}];
    mockAuthHandler.reset();
    mockAuthHandler.handler.loggedIn = true;
    mockAuthHandler.handler.isDirectoryAdmin = false;
    mockAuthHandler.handler.isEnterpriseAdmin = true;
    putDirectoryAdmins(directoryAdmins, 403)
    .then(done)
    .catch(failTest(done));
  });

});
