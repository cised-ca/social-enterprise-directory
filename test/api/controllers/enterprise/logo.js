/* eslint-env node, mocha */
const postUtil = require('../../helpers/enterprise/post_util');
const deleteUtil = require('../../helpers/enterprise/delete_util');
const getUtil = require('../../helpers/enterprise/get_util');
const putUtil = require('../../helpers/enterprise/put_util');
const TEST_TIMEOUT = require('../../../test_constants').TEST_TIMEOUT;
const testInitializer = require('../../../test_initializer');
const failTest = require('../../helpers/test_util').failTest;
let mockAuthHandler = require('../../helpers/auth/mock_auth_handler');

describe('testing endpoint /enterprise/{id}/logo', function() {
  this.timeout(TEST_TIMEOUT);

  beforeEach(function(done) {
    testInitializer.setup(done);
  });

  it('should create a PNG logo', function(done) {
    let id = '58014c003762820bc88b86f9';
    let logoData = 'this is a logo binary data value';
    let contentType = 'image/png';
    postUtil.postLogo(id, contentType, logoData)
    .then(() => {
      return getUtil.getLogo(id, contentType);
    })
    .then(body => {
      body.toString().should.eql(logoData);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should create a JPEG logo', function(done) {
    let id = '58014c003762820bc88b86f9';
    let logoData = 'this is a logo binary data value';
    let contentType = 'image/jpeg';
    postUtil.postLogo(id, contentType, logoData)
    .then(() => {
      return getUtil.getLogo(id, contentType);
    })
    .then(body => {
      body.toString().should.eql(logoData);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should fail for unsupported image type', function(done) {
    let id = '58014c003762820bc88b86f9';
    let logoData = 'this is a logo binary data value';
    let contentType = 'image/invalidType';
    postUtil.postLogo(id, contentType, logoData, 400)
    .then(done)
    .catch(failTest(done));
  });

  it('should delete a logo', function(done) {
    let id = '58014c003762820bc88b86f9';
    let logoData = 'this is a logo binary data value';
    let contentType = 'image/png';
    postUtil.postLogo(id, contentType, logoData)
    .then(() => {
      return getUtil.getLogo(id, contentType);
    })
    .then(() => {
      return deleteUtil.deleteLogo(id);
    })
    .then(() => {
      return getUtil.getLogoExpectErrorCode(id, 404);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should edit a logo', function(done) {
    let id = '58014c003762820bc88b86f9';
    let logoData = 'this is a logo binary data value';
    let contentType = 'image/png';
    let newLogoData = 'this is a NEW logo binary data value';
    let newContentType = 'image/jpeg';
    postUtil.postLogo(id, contentType, logoData)
    .then(() => {
      return getUtil.getLogo(id, contentType);
    })
    .then(body => {
      body.toString().should.eql(logoData);
    })
    .then(() => {
      return putUtil.putLogo(id, newContentType, newLogoData);
    })
    .then(() => {
      return getUtil.getLogo(id, newContentType);
    })
    .then(body => {
      body.toString().should.eql(newLogoData);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return 403 Forbidden if create logo when not logged in', function(done) {
    mockAuthHandler.reset();
    mockAuthHandler.handler.loggedIn = false;
    let id = '58014c003762820bc88b86f9';
    let logoData = 'this is a logo binary data value';
    let contentType = 'image/png';
    postUtil.postLogo(id, contentType, logoData, 403)
    .then(done)
    .catch(failTest(done));
  });

  it('should return 403 Forbidden if create logo when not directory admin', function(done) {
    mockAuthHandler.reset();
    mockAuthHandler.handler.loggedIn = true;
    mockAuthHandler.handler.isDirectoryAdmin = false;
    let id = '58014c003762820bc88b86f9';
    let logoData = 'this is a logo binary data value';
    let contentType = 'image/png';
    postUtil.postLogo(id, contentType, logoData, 403)
    .then(done)
    .catch(failTest(done));
  });

  it('should return 403 Forbidden if delete logo when not directory admin', function(done) {
    let id = '58014c003762820bc88b86f9';
    let logoData = 'this is a logo binary data value';
    let contentType = 'image/png';
    postUtil.postLogo(id, contentType, logoData)
    .then(() => {
      return getUtil.getLogo(id, contentType);
    })
    .then(() => {
      mockAuthHandler.reset();
      mockAuthHandler.handler.loggedIn = true;
      mockAuthHandler.handler.isDirectoryAdmin = false;
      return deleteUtil.deleteLogo(id, 403);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return 403 Forbidden if edit logo when not directory admin', function(done) {
    let id = '58014c003762820bc88b86f9';
    let logoData = 'this is a logo binary data value';
    let contentType = 'image/png';
    let newLogoData = 'this is a NEW logo binary data value';
    let newContentType = 'image/jpeg';
    postUtil.postLogo(id, contentType, logoData)
    .then(() => {
      return getUtil.getLogo(id, contentType);
    })
    .then(() => {
      mockAuthHandler.reset();
      mockAuthHandler.handler.loggedIn = true;
      mockAuthHandler.handler.isDirectoryAdmin = false;
      return putUtil.putLogo(id, newContentType, newLogoData, 403);
    })
    .then(done)
    .catch(failTest(done));
  });

});
