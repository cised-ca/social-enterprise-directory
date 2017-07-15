/* eslint-env node, mocha */
const requestUtil = require('../../helpers/request_util');
const publishUtil = require('../../helpers/enterprise/publish_util');
const postUtil = require('../../helpers/enterprise/post_util');
const putUtil = require('../../helpers/enterprise/put_util');
const TEST_TIMEOUT = require('../../../test_constants').TEST_TIMEOUT;
let mockAuthHandler = require('../../helpers/auth/mock_auth_handler');
const testInitializer = require('../../../test_initializer');
const failTest = require('../../helpers/test_util').failTest;
const testEnterprise1_public_en = require('../../helpers/data/enterprise/testEnterprise1_public_en');
const testEnterprise1_public_fr = require('../../helpers/data/enterprise/testEnterprise1_public_fr');
const testEnterprise2_public_en = require('../../helpers/data/enterprise/testEnterprise2_public_en');
const testEnterprise2_public_fr = require('../../helpers/data/enterprise/testEnterprise2_public_fr');
const testEnterprise3_public_en = require('../../helpers/data/enterprise/testEnterprise3_public_en');
const testEnterprise3_public_fr = require('../../helpers/data/enterprise/testEnterprise3_public_fr');
const FRENCH = require('../../helpers/language/language_test_constants').FRENCH;

const pendingEnterprise1 = {en: {name: 'pending1'}, fr: {name: 'pending1fr'}};
const pendingEnterprise2 = {en: {name: 'pending2'}, fr: {name: 'pending2fr'}};
const pendingEnterprise3 = {en: {name: 'pending3'}, fr: {name: 'pending3fr'}};

const unpublishedEnterprise1 = {en: {name: 'NewHouse'}, fr: {name: 'NewJungle'}};
const unpublishedEnterprise2 = {en: {name: 'NewCar'}, fr: {name: 'NewGiant'}};
const unpublishedEnterprise3 = {en: {name: 'NewTank'}, fr: {name: 'NewAcorn'}};

const URL = '/account/enterpriseSummary';

describe('testing GET /account/enterpriseSummary', function() {

  this.timeout(TEST_TIMEOUT);

  beforeEach(function(done) {
    testInitializer.setup(done);
  });

  function getEnterprise1Name(language) {
    let expected = testEnterprise1_public_en;
    if (language === FRENCH) {
      expected = testEnterprise1_public_fr;
    }
    return expected.name;
  }

  function getEnterprise2Name(language) {
    let expected = testEnterprise2_public_en;
    if (language === FRENCH) {
      expected = testEnterprise2_public_fr;
    }
    return expected.name;
  }

  function getEnterprise3Name(language) {
    let expected = testEnterprise3_public_en;
    if (language === FRENCH) {
      expected = testEnterprise3_public_fr;
    }
    return expected.name;
  }

  it('should return 403 Forbidden when not logged in', function(done) {
    mockAuthHandler.handler.loggedIn = false;

    requestUtil.performGetRequest(URL, 403)()
    .then( () => {})
    .then(done)
    .catch( failTest(done));
  });

  it('should have empty summaries when user has no permissions', function(done) {

    publishUtil.createAndPublishAllEnterprises()
    .then(() => {
      mockAuthHandler.handler.loggedIn = true;
      mockAuthHandler.handler.isDirectoryAdmin = false;
      mockAuthHandler.handler.isEnterpriseAdmin = false;
    })
    .then(requestUtil.performGetRequest(URL))
    .then( res => {
      res.body.published.should.be.empty;
      res.body.pending.should.be.empty;
      res.body.unpublished.should.be.empty;
    })
    .then(done)
    .catch( failTest(done));
  });

  it('should have ALL enterprises when directory admin', function(done) {
    mockAuthHandler.handler.loggedIn = true;
    mockAuthHandler.handler.isDirectoryAdmin = true;

    publishUtil.createAndPublishAllEnterprises()
    .then(() => {return putUtil.putPendingEnterprise(postUtil.getTestEnterprise1Id(), pendingEnterprise1);})
    .then(() => {return putUtil.putPendingEnterprise(postUtil.getTestEnterprise2Id(), pendingEnterprise2);})
    .then(() => {return putUtil.putPendingEnterprise(postUtil.getTestEnterprise3Id(), pendingEnterprise3);})
    .then(() => {return putUtil.putUnpublishedEnterprise(postUtil.getTestEnterprise1Id(), unpublishedEnterprise1);})
    .then(() => {return putUtil.putUnpublishedEnterprise(postUtil.getTestEnterprise2Id(), unpublishedEnterprise2);})
    .then(() => {return putUtil.putUnpublishedEnterprise(postUtil.getTestEnterprise3Id(), unpublishedEnterprise3);})
    .then(requestUtil.performGetRequest(URL))
    .then( res => {
      res.body.published.should.eql([
        {id: postUtil.getTestEnterprise3Id(), name: getEnterprise3Name()},
        {id: postUtil.getTestEnterprise1Id(), name: getEnterprise1Name()},
        {id: postUtil.getTestEnterprise2Id(), name: getEnterprise2Name()}
      ]);
      res.body.pending.should.eql([
        {id: postUtil.getTestEnterprise1Id(), name: 'pending1'},
        {id: postUtil.getTestEnterprise2Id(), name: 'pending2'},
        {id: postUtil.getTestEnterprise3Id(), name: 'pending3'}
      ]);
      res.body.unpublished.should.eql([
        {id: postUtil.getTestEnterprise2Id(), name: 'NewCar'},
        {id: postUtil.getTestEnterprise1Id(), name: 'NewHouse'},
        {id: postUtil.getTestEnterprise3Id(), name: 'NewTank'}
      ]);
    })
    .then(done)
    .catch( failTest(done));
  });

  it('should have authenticated enterprises when enterprise admin', function(done) {

    // set permissions to directory admin until we create all the enterprise data
    mockAuthHandler.handler.loggedIn = true;
    mockAuthHandler.handler.isDirectoryAdmin = true;

    publishUtil.createAndPublishAllEnterprises()
    .then(() => {return putUtil.putPendingEnterprise(postUtil.getTestEnterprise1Id(), pendingEnterprise1);})
    .then(() => {return putUtil.putPendingEnterprise(postUtil.getTestEnterprise2Id(), pendingEnterprise2);})
    .then(() => {return putUtil.putPendingEnterprise(postUtil.getTestEnterprise3Id(), pendingEnterprise3);})
    .then(() => {return putUtil.putUnpublishedEnterprise(postUtil.getTestEnterprise1Id(), unpublishedEnterprise1);})
    .then(() => {return putUtil.putUnpublishedEnterprise(postUtil.getTestEnterprise2Id(), unpublishedEnterprise2);})
    .then(() => {return putUtil.putUnpublishedEnterprise(postUtil.getTestEnterprise3Id(), unpublishedEnterprise3);})
    .then(() => {
      mockAuthHandler.handler.loggedIn = true;
      mockAuthHandler.handler.isDirectoryAdmin = false;
      mockAuthHandler.handler.isEnterpriseAdmin = true;
      mockAuthHandler.handler.authenticatedEnterprises = [
        postUtil.getTestEnterprise1Id(),
        postUtil.getTestEnterprise3Id()
      ];
      return Promise.resolve();
    })
    .then(requestUtil.performGetRequest(URL))
    .then( res => {
      res.body.published.should.eql([
        {id: postUtil.getTestEnterprise3Id(), name: getEnterprise3Name()},
        {id: postUtil.getTestEnterprise1Id(), name: getEnterprise1Name()}
      ]);
      res.body.pending.should.eql([
        {id: postUtil.getTestEnterprise1Id(), name: 'pending1'},
        {id: postUtil.getTestEnterprise3Id(), name: 'pending3'}
      ]);
      res.body.unpublished.should.eql([
        {id: postUtil.getTestEnterprise1Id(), name: 'NewHouse'},
        {id: postUtil.getTestEnterprise3Id(), name: 'NewTank'}
      ]);
    })
    .then(done)
    .catch( failTest(done));
  });

  it('should return enterprise names in french', function(done) {
    mockAuthHandler.handler.loggedIn = true;
    mockAuthHandler.handler.isDirectoryAdmin = true;

    publishUtil.createAndPublishAllEnterprises()
    .then(() => {return putUtil.putPendingEnterprise(postUtil.getTestEnterprise1Id(), pendingEnterprise1);})
    .then(() => {return putUtil.putPendingEnterprise(postUtil.getTestEnterprise2Id(), pendingEnterprise2);})
    .then(() => {return putUtil.putPendingEnterprise(postUtil.getTestEnterprise3Id(), pendingEnterprise3);})
    .then(() => {return putUtil.putUnpublishedEnterprise(postUtil.getTestEnterprise1Id(), unpublishedEnterprise1);})
    .then(() => {return putUtil.putUnpublishedEnterprise(postUtil.getTestEnterprise2Id(), unpublishedEnterprise2);})
    .then(() => {return putUtil.putUnpublishedEnterprise(postUtil.getTestEnterprise3Id(), unpublishedEnterprise3);})
    .then(requestUtil.performGetRequest(URL + '?lang=' + FRENCH))
    .then( res => {
      res.body.published.should.eql([
        {id: postUtil.getTestEnterprise3Id(), name: getEnterprise3Name(FRENCH)},
        {id: postUtil.getTestEnterprise2Id(), name: getEnterprise2Name(FRENCH)},
        {id: postUtil.getTestEnterprise1Id(), name: getEnterprise1Name(FRENCH)}
      ]);
      res.body.pending.should.eql([
        {id: postUtil.getTestEnterprise1Id(), name: 'pending1fr'},
        {id: postUtil.getTestEnterprise2Id(), name: 'pending2fr'},
        {id: postUtil.getTestEnterprise3Id(), name: 'pending3fr'}
      ]);
      res.body.unpublished.should.eql([
      {id: postUtil.getTestEnterprise3Id(), name: 'NewAcorn'},
        {id: postUtil.getTestEnterprise2Id(), name: 'NewGiant'},
        {id: postUtil.getTestEnterprise1Id(), name: 'NewJungle'}
      ]);
    })
    .then(done)
    .catch( failTest(done));
  });

});
