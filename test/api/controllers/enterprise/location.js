/* eslint-env node, mocha */
const testInitializer = require('../../../test_initializer');
const requestUtil = require('../../helpers/request_util');
const publishUtil = require('../../helpers/enterprise/publish_util');
const patchUtil = require('../../helpers/enterprise/patch_util');
const enterpriseVerifier = require('../../helpers/enterprise/enterprise_verifier');
const TEST_TIMEOUT = require('../../../test_constants').TEST_TIMEOUT;
const failTest = require('../../helpers/test_util').failTest;

const url = '/directory';
const OTTAWA = [-75.692, 45.425];
const KINGSTON = [-76.753386, 44.3395175];

describe('GET /directory with location', function() {
  this.timeout(TEST_TIMEOUT);

  beforeEach(function(done) {
    testInitializer.setup(done);
  });

  function buildLocation(newLocation) {
    return {
      locations: {
        'type': 'MultiPoint',
        'coordinates': [
          newLocation
        ]
      }
    };
  }

  it('should return multiple enterprises sorted by proximity (near enterprise 1)', function(done) {
    publishUtil.createAndPublishAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?at=-75.692,45.425'))
    .then( res => {
      enterpriseVerifier.verifyEnterprise1Public(res.body.enterprises[0]);
      enterpriseVerifier.verifyEnterprise2Public(res.body.enterprises[1]);
      enterpriseVerifier.verifyArrayDoesNotContainEnterprise3(res.body.enterprises);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return multiple enterprises sorted by proximity (near enterprise 2)', function(done) {
    publishUtil.createAndPublishAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?at=-75.620,45.000'))
    .then( res => {
      enterpriseVerifier.verifyEnterprise2Public(res.body.enterprises[0]);
      enterpriseVerifier.verifyEnterprise1Public(res.body.enterprises[1]);
      enterpriseVerifier.verifyArrayDoesNotContainEnterprise3(res.body.enterprises);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should sort by proximity with count parameter set (near enterprise 2)', function(done) {
    publishUtil.createAndPublishAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?at=-75.620,45.000&count=1'))
    .then( res => {
      enterpriseVerifier.verifyEnterprise2Public(res.body.enterprises[0]);
      enterpriseVerifier.verifyArrayDoesNotContainEnterprise1(res.body.enterprises);
      enterpriseVerifier.verifyArrayDoesNotContainEnterprise3(res.body.enterprises);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should sort by proximity with count and page parameter set (near enterprise 2)', function(done) {
    publishUtil.createAndPublishAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?at=-75.620,45.000&page=2&count=1'))
    .then( res => {
      enterpriseVerifier.verifyEnterprise1Public(res.body.enterprises[0]);
      enterpriseVerifier.verifyArrayDoesNotContainEnterprise2(res.body.enterprises);
      enterpriseVerifier.verifyArrayDoesNotContainEnterprise3(res.body.enterprises);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should only return enterprises within 100km of search location', function(done) {
    publishUtil.createAndPublishAllEnterprises()

    .then(() => {
      // move Enterprise 1 to Kingston which is > 100km from Ottawa so it shouldn't appear in results
      return patchUtil.editEnterprise1(buildLocation(KINGSTON));
    })

    .then(() => {
      // move Enterprise 3 to Ottawa so it should appear as closest result
      return patchUtil.editEnterprise3(buildLocation(OTTAWA));
    })

    .then(requestUtil.performGetRequest(url + '?at=-75.692,45.425'))
    .then( res => {
      enterpriseVerifier.verifyEnterprise3Public(res.body.enterprises[0]);
      enterpriseVerifier.verifyEnterprise2Public(res.body.enterprises[1]);
      enterpriseVerifier.verifyArrayDoesNotContainEnterprise1(res.body.enterprises);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should return only the one enterprise within 100km that matches keyword search', function(done) {
    publishUtil.createAndPublishAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?at=-75.692,45.425&q=cycle'))
    .then( res => {
      res.body.enterprises.length.should.equal(1);
      enterpriseVerifier.verifyArrayContainsEnterprise1(res.body.enterprises);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should sort results by best match to keywords, even if first enterprise is closer to location', function(done) {
    publishUtil.createAndPublishAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?at=-75.692,45.425&q=good+social'))
    .then( res => {
      res.body.enterprises.length.should.equal(2);

      // expect results in this exact order
      enterpriseVerifier.verifyEnterprise2Public(res.body.enterprises[0]);
      enterpriseVerifier.verifyEnterprise1Public(res.body.enterprises[1]);
    })
    .then(done)
    .catch(failTest(done));
  });

  it('should drop keyword matches greater than 100km away', function(done) {
    publishUtil.createAndPublishAllEnterprises()

    // The following keyword search should match both enterprise 1 and 2,
    // let's confirm that's the case, before we start the real test
    .then(requestUtil.performGetRequest(url + '?at=-75.692,45.425&q=good+social'))
    .then( res => {
      res.body.enterprises.length.should.equal(2);
      enterpriseVerifier.verifyEnterprise2Public(res.body.enterprises[0]);
      enterpriseVerifier.verifyEnterprise1Public(res.body.enterprises[1]);
    })

    // Now let's move enterprise 2 farther away so it's not near the search location anymore
    .then(() => {
      // move Enterprise 2 to Kingston so it's more than 100km away
      return patchUtil.editEnterprise2(buildLocation(KINGSTON));
    })
    .then(requestUtil.performGetRequest(url + '?at=-75.692,45.425&q=good+social'))
    .then( res => {
      res.body.enterprises.length.should.equal(1);
      enterpriseVerifier.verifyEnterprise1Public(res.body.enterprises[0]);
    })
    .then(done)
    .catch(failTest(done));
  });

});
