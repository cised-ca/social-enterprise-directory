/* eslint-env node, mocha */
const postUtil = require('../../helpers/enterprise/post_util');
const patchUtil = require('../../helpers/enterprise/patch_util');
const getUtil = require('../../helpers/enterprise/get_util');
const TEST_TIMEOUT = require('../../../test_constants').TEST_TIMEOUT;
const FRENCH = require('../../helpers/language/language_test_constants').FRENCH;
const testInitializer = require('../../../test_initializer');
const failTest = require('../../helpers/test_util').failTest;
let mockAuthHandler = require('../../helpers/auth/mock_auth_handler');

describe('PATCH /enterprise/{id}', function() {
  this.timeout(TEST_TIMEOUT);

  beforeEach(function(done) {
    testInitializer.setup(done);
  });

  it('should return 403 Forbidden if not logged in', function(done) {
    let newDescription = 'A new description for Cycle Salvation';
    postUtil.postTestEnterprise1()
    .then(() => {
      mockAuthHandler.reset();
      mockAuthHandler.handler.loggedIn = false;
      return patchUtil.editEnterprise1({en: { description: newDescription}}, 403);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return 403 Forbidden if not directory admin', function(done) {
    let newDescription = 'A new description for Cycle Salvation';
    postUtil.postTestEnterprise1()
    .then(() => {
      mockAuthHandler.reset();
      mockAuthHandler.handler.loggedIn = true;
      mockAuthHandler.handler.isDirectoryAdmin = false;
      return patchUtil.editEnterprise1({en: { description: newDescription}}, 403);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should change testEnterprise1 english description', function(done) {
    let newDescription = 'A new description for Cycle Salvation';
    postUtil.postTestEnterprise1()
    .then(() => {
      return patchUtil.editEnterprise1({
        en: { description: newDescription }
      });
    })
    .then(getUtil.getEnterprise1)
    .then(body => {
      body.description.should.eql(newDescription);
      return Promise.resolve();
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should change testEnterprise2 location and french name', function(done) {
    let newName = 'Bon Nature Groundskeeping 2';
    let newLocations = {
      type: 'MultiPoint',
      coordinates: [
        [53.425, -85.692],
        [33.425, -70.692]
      ]
    };
    postUtil.postTestEnterprise2()
    .then(() => {
      return patchUtil.editEnterprise2({
        locations : newLocations,
        fr: { name: newName }
      });
    })
    .then(() => {
      return getUtil.getEnterprise2(FRENCH);
    })
    .then(body => {
      body.name.should.eql(newName);
      body.locations.should.eql(newLocations);
      return Promise.resolve();
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should change many items in english and french', function(done) {
    let newFrenchOffering = 'Plein de bon nature';
    let newFrenchEmails =  [
      {
        email: 'test2@test2.com',
        public: true,
        tags: ['plein centrale']
      }
    ];
    let newEnglishEmails = [
      {
        email: 'test4@test4.com',
        public: true,
        tags: ['right downtown']
      }
    ];
    let newEnglishWebsite = 'test.com/en';
    let newLocations = {
      type: 'MultiPoint',
      coordinates: [
        [53.425, -85.692],
        [33.425, -70.692]
      ]
    };

    postUtil.postTestEnterprise2()
    .then(() => {
      return patchUtil.editEnterprise2({
        locations : newLocations,
        fr: {
          offering: newFrenchOffering,
          emails: newFrenchEmails
        },
        en: {
          emails: newEnglishEmails,
          website: newEnglishWebsite
        }
      });
    })
    .then(() => {
      return getUtil.getEnterprise2(FRENCH);
    })
    .then(body => {
      body.offering.should.eql(newFrenchOffering);
      body.emails.should.eql(newFrenchEmails);
      body.locations.should.eql(newLocations);
      return Promise.resolve();
    })
    .then(getUtil.getEnterprise2)
    .then(body => {
      body.website.should.eql(newEnglishWebsite);
      body.emails.should.eql(newEnglishEmails);
      body.locations.should.eql(newLocations);
      return Promise.resolve();
    })
    .then(done)
    .catch(failTest(done));
  });


  it('should change testEnterprise1 admins when authed as directory admin', function(done) {
    let newAdminEmails = ['test1@test1.com', 'test2@test2.com'];
    postUtil.postTestEnterprise1()
    .then(() => {
      return patchUtil.editEnterprise1Admins({
        admin_emails: newAdminEmails
      });
    })
    .then(getUtil.getEnterprise1Admins)
    .then(body => {
      body.admin_emails.should.eql(newAdminEmails);
      return Promise.resolve();
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should change testEnterprise1 admins when authed as enterprise admin', function(done) {
    let newAdminEmails = ['test1@test1.com', 'test2@test2.com'];
    postUtil.postTestEnterprise1()
    .then(() => {
      mockAuthHandler.reset();
      mockAuthHandler.handler.loggedIn = true;
      mockAuthHandler.handler.isDirectoryAdmin = false;
      mockAuthHandler.handler.isEnterpriseAdmin = true;
      return patchUtil.editEnterprise1Admins({
        admin_emails: newAdminEmails
      });
    })
    .then(getUtil.getEnterprise1Admins)
    .then(body => {
      body.admin_emails.should.eql(newAdminEmails);
      return Promise.resolve();
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return 403 Forbidden if not authed as admin', function(done) {
    let newAdminEmails = ['test1@test1.com', 'test2@test2.com'];
    postUtil.postTestEnterprise1()
    .then(() => {
      mockAuthHandler.reset();
      mockAuthHandler.handler.loggedIn = true;
      mockAuthHandler.handler.isDirectoryAdmin = false;
      mockAuthHandler.handler.isEnterpriseAdmin = false;
      return patchUtil.editEnterprise1Admins({admin_emails: newAdminEmails}, 403);
    })
    .then(done)
    .catch(failTest(done));
  });

});
