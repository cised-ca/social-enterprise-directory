/* eslint-env node, mocha */
const requestUtil = require('../../helpers/request_util');
const publishUtil = require('../../helpers/enterprise/publish_util');
const enterpriseVerifier = require('../../helpers/enterprise/enterprise_verifier');
const TEST_TIMEOUT = require('../../../test_constants').TEST_TIMEOUT;
const testInitializer = require('../../../test_initializer');
const failTest = require('../../helpers/test_util').failTest;
const FRENCH = require('../../helpers/language/language_test_constants').FRENCH;

const url = '/directory';

describe('Search /directory', function() {
  this.timeout(TEST_TIMEOUT);

  beforeEach(function(done) {
    testInitializer.setup(done);
  });

  it('should return only the one enterprise matching search item', function(done) {
    publishUtil.createAndPublishAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?q=cycle'))
    .then( res => {
      res.body.enterprises.length.should.equal(1);
      enterpriseVerifier.verifyArrayContainsEnterprise1(res.body.enterprises);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return multiple enterprises matching search item', function(done) {
    publishUtil.createAndPublishAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?q=social'))
    .then( res => {
      res.body.enterprises.length.should.equal(2);
      enterpriseVerifier.verifyArrayContainsEnterprise1(res.body.enterprises);
      enterpriseVerifier.verifyArrayContainsEnterprise2(res.body.enterprises);
    })
    .then(done)
    .catch(failTest(done));
  });


  it('should return enterprises matching multiple search items', function(done) {
    publishUtil.createAndPublishAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?q=cycle+good'))
    .then( res => {
      res.body.enterprises.length.should.equal(2);
      enterpriseVerifier.verifyArrayContainsEnterprise1(res.body.enterprises);
      enterpriseVerifier.verifyArrayContainsEnterprise2(res.body.enterprises);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should weight enterprise name over description for search', function(done) {
    publishUtil.createAndPublishAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?q=good+social'))
    .then( res => {
      res.body.enterprises.length.should.equal(2);

      // expect results in this exact order
      enterpriseVerifier.verifyEnterprise2Public(res.body.enterprises[0]);
      enterpriseVerifier.verifyEnterprise1Public(res.body.enterprises[1]);
    })
    .then(done)
    .catch(failTest(done));
  });


  it('should match search on twitter handle', function(done) {
    publishUtil.createAndPublishAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?q=abhoney'))
    .then( res => {
      res.body.enterprises.length.should.equal(1);
      enterpriseVerifier.verifyEnterprise1Public(res.body.enterprises[0]);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return only the two enterprises matching purpose when browse with purpose', function(done) {
    publishUtil.createAndPublishAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?purpose=Helping%20disadvantaged%20peoples'))
    .then( res => {
      res.body.enterprises.length.should.equal(2);
      enterpriseVerifier.verifyArrayContainsEnterprise1(res.body.enterprises);
      enterpriseVerifier.verifyArrayContainsEnterprise2(res.body.enterprises);
    })
    .then(requestUtil.performGetRequest(url + '?purpose=Raising%20money%20for%20parent%20company'))
    .then( res => {
      res.body.enterprises.length.should.equal(1);
      enterpriseVerifier.verifyArrayContainsEnterprise2(res.body.enterprises);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return only the two enterprises matching purpose when browse in french', function(done) {
    publishUtil.createAndPublishAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?purpose=Supporter%20les%20pauvres&lang='+FRENCH))
    .then( res => {
      res.body.enterprises.length.should.equal(2);
      enterpriseVerifier.verifyArrayContainsEnterprise2(res.body.enterprises, FRENCH);
      enterpriseVerifier.verifyArrayContainsEnterprise3(res.body.enterprises, FRENCH);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return only enterprise matching search item and purpose', function(done) {
    publishUtil.createAndPublishAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?q=cycle+good&purpose=Helping%20disadvantaged%20peoples'))
    .then( res => {
      res.body.enterprises.length.should.equal(2);
      enterpriseVerifier.verifyArrayContainsEnterprise1(res.body.enterprises);
      enterpriseVerifier.verifyArrayContainsEnterprise2(res.body.enterprises);
    })
    .then(requestUtil.performGetRequest(url + '?q=cycle+good&purpose=Raising%20money%20for%20parent%20company'))
    .then( res => {
      res.body.enterprises.length.should.equal(1);
      enterpriseVerifier.verifyArrayContainsEnterprise2(res.body.enterprises);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return only enterprise matching search item and purpose in French', function(done) {
    publishUtil.createAndPublishAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?q=nature+capitale&purpose=Supporter%20les%20pauvres&lang=' + FRENCH))
    .then( res => {
      res.body.enterprises.length.should.equal(2);
      enterpriseVerifier.verifyArrayContainsEnterprise2(res.body.enterprises, FRENCH);
      enterpriseVerifier.verifyArrayContainsEnterprise3(res.body.enterprises, FRENCH);
    })
    .then(requestUtil.performGetRequest(url + '?q=nature+capitale&purpose=Sauter%20les%20injustices&lang=' + FRENCH))
    .then( res => {
      res.body.enterprises.length.should.equal(1);
      enterpriseVerifier.verifyArrayContainsEnterprise2(res.body.enterprises, FRENCH);
    })
    .then(done)
    .catch(failTest(done));
  });
});
