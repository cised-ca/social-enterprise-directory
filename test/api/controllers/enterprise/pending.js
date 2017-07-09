/* eslint-env node, mocha */
const postUtil = require('../../helpers/enterprise/post_util');
const requestUtil = require('../../helpers/request_util');
const putUtil = require('../../helpers/enterprise/put_util');
const getUtil = require('../../helpers/enterprise/get_util');
const deleteUtil = require('../../helpers/enterprise/delete_util');
const patchUtil = require('../../helpers/enterprise/patch_util');
const TEST_TIMEOUT = require('../../../test_constants').TEST_TIMEOUT;
const testInitializer = require('../../../test_initializer');
const failTest = require('../../helpers/test_util').failTest;
const replaceEnterprise1 = require('../../helpers/data/enterprise/replacementData/replaceEnterprise1');

const DIRECTORY_URL = '/directory';

describe('Operations on Pending Enterprises', function() {
  this.timeout(TEST_TIMEOUT);

  beforeEach(function(done) {
    testInitializer.setup(done);
  });

  it('should create pending entry for testEnterprise1', function(done) {
    postUtil.postTestEnterprise1()
    .then(() => {
      return putUtil.putPendingEnterprise(postUtil.getTestEnterprise1Id(), replaceEnterprise1);
    })
    .then(getUtil.getPendingEnterprise1)
    .then(done)
    .catch(failTest(done));
  });

  it('should not affect search results when create pending entry', function(done) {
    postUtil.postTestEnterprise1()
    .then(requestUtil.performGetRequest(DIRECTORY_URL + '?q=abhoney2'))
    .then( res => {
      res.body.enterprises.length.should.equal(0);
    })
    .then(() => {
      // creates a pending entry that has value abhoney2
      return putUtil.putPendingEnterprise(postUtil.getTestEnterprise1Id(), replaceEnterprise1);
    })
    .then(requestUtil.performGetRequest(DIRECTORY_URL + '?q=abhoney2'))
    .then( res => {
      res.body.enterprises.length.should.equal(0);
      return Promise.resolve();
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should delete pending entry for testEnterprise1', function(done) {
    postUtil.postTestEnterprise1()
    .then(() => {
      return putUtil.putPendingEnterprise(postUtil.getTestEnterprise1Id(), replaceEnterprise1);
    })
    .then(getUtil.getPendingEnterprise1)
    .then(() => {
      return deleteUtil.deletePendingEnterprise1();
    })
    .then(() => {
      return getUtil.getByIdPendingEnterprise1ExpectError(404);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should not affect search results when delete pending entry', function(done) {
    postUtil.postTestEnterprise1()
    .then(() => {
      return putUtil.putPendingEnterprise(postUtil.getTestEnterprise1Id(), replaceEnterprise1);
    })
    .then(requestUtil.performGetRequest(DIRECTORY_URL + '?q=abhoney'))
    .then( res => {
      res.body.enterprises.length.should.equal(1);
    })
    .then(() => {
      return deleteUtil.deletePendingEnterprise1();
    })
    .then(requestUtil.performGetRequest(DIRECTORY_URL + '?q=abhoney'))
    .then( res => {
      res.body.enterprises.length.should.equal(1);
      return Promise.resolve();
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should edit pending entry for testEnterprise1', function(done) {
    let newEnglishDescription = 'A new description for Cycle Salvation';
    let newFrenchDescription = 'Nouvelle description';
    postUtil.postTestEnterprise1()
    .then(() => {
      return putUtil.putPendingEnterprise(postUtil.getTestEnterprise1Id(), replaceEnterprise1);
    })
    .then(getUtil.getPendingEnterprise1)
    .then(() => {
      return patchUtil.editPendingEnterprise1({
        en: {description: newEnglishDescription},
        fr: {description: newFrenchDescription}
      });
    })
    .then(getUtil.getPendingEnterprise1Body)
    .then(body => {
      body.en.description.should.eql(newEnglishDescription);
      body.fr.description.should.eql(newFrenchDescription);
      return Promise.resolve();
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should not affect search results when patch pending entry', function(done) {
    let newEnglishDescription = 'A new description involving zoology';
    let newFrenchDescription = 'Nouvelle description de zoologie';
    postUtil.postTestEnterprise1()
    .then(() => {
      return putUtil.putPendingEnterprise(postUtil.getTestEnterprise1Id(), replaceEnterprise1);
    })
    .then(requestUtil.performGetRequest(DIRECTORY_URL + '?q=zoology'))
    .then( res => {
      res.body.enterprises.length.should.equal(0);
    })
    .then(requestUtil.performGetRequest(DIRECTORY_URL + '?lang=fr&q=zoologie'))
    .then( res => {
      res.body.enterprises.length.should.equal(0);
    })
    .then(() => {
      return patchUtil.editPendingEnterprise1({
        en: {description: newEnglishDescription},
        fr: {description: newFrenchDescription}
      });
    })
    .then(requestUtil.performGetRequest(DIRECTORY_URL + '?q=zoology'))
    .then( res => {
      res.body.enterprises.length.should.equal(0);
      return Promise.resolve();
    })
    .then(requestUtil.performGetRequest(DIRECTORY_URL + '?lang=fr&q=zoologie'))
    .then( res => {
      res.body.enterprises.length.should.equal(0);
      return Promise.resolve();
    })
    .then(done)
    .catch(failTest(done));
  });

});
