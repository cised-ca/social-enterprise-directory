/* eslint-env node, mocha */
const should = require('should');
const requestUtil = require('../../helpers/request_util');
const postUtil = require('../../helpers/enterprise/post_util');
const enterpriseVerifier = require('../../helpers/enterprise/enterprise_verifier');
const TEST_TIMEOUT = require('../../../test_constants').TEST_TIMEOUT;
const testInitializer = require('../../../test_initializer');

const url = '/directory';

describe('Search /directory', function() {
  this.timeout(TEST_TIMEOUT);

  beforeEach(function(done) {
    testInitializer.setup(done);
  });

  it('should return only the one enterprise matching search item', function(done) {
    postUtil.postAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?q=cycle'))
    .then( res => {
      res.body.length.should.equal(1);
      enterpriseVerifier.verifyArrayContainsEnterprise1(res.body);
    })
    .then(done)
    .catch( err => should.not.exist(err));
  });

  it('should return multiple enterprises matching search item', function(done) {
    postUtil.postAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?q=social'))
    .then( res => {
      res.body.length.should.equal(2);
      enterpriseVerifier.verifyArrayContainsEnterprise1(res.body);
      enterpriseVerifier.verifyArrayContainsEnterprise2(res.body);
    })
    .then(done)
    .catch( err => should.not.exist(err));
  });


  it('should return enterprises matching multiple search items', function(done) {
    postUtil.postAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?q=cycle+good'))
    .then( res => {
      res.body.length.should.equal(2);
      enterpriseVerifier.verifyArrayContainsEnterprise1(res.body);
      enterpriseVerifier.verifyArrayContainsEnterprise2(res.body);
    })
    .then(done)
    .catch( err => should.not.exist(err));
  });

  it('should weight enterprise name over description for search', function(done) {
    postUtil.postAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?q=good+social'))
    .then( res => {
      res.body.length.should.equal(2);

      // expect results in this exact order
      enterpriseVerifier.verifyEnterprise2Public(res.body[0]);
      enterpriseVerifier.verifyEnterprise1Public(res.body[1]);
    })
    .then(done)
    .catch( err => should.not.exist(err));
  });


  it('should match search on twitter handle', function(done) {
    postUtil.postAllEnterprises()
    .then(requestUtil.performGetRequest(url + '?q=abhoney'))
    .then( res => {
      res.body.length.should.equal(1);
      enterpriseVerifier.verifyEnterprise1Public(res.body[0]);
    })
    .then(done)
    .catch( err => should.not.exist(err));
  });

});
