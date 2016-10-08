/* eslint-env node, mocha */
var should = require('should');
var dbUtil = require('../../helpers/db/db_util');
var requestUtil = require('../../helpers/request_util');
var postUtil = require('../../helpers/enterprise/post_util');
var enterpriseVerifier = require('../../helpers/enterprise/enterprise_verifier');

var url = '/enterprise/';

describe('GET /enterprise', function() {

  beforeEach(function(done) {
    dbUtil.dropDatabase(done);
  });

  it('should return enterprise', function(done) {
    postUtil.postTestEnterprise1();

    var doGetRequest = function() {
      requestUtil.buildGetRequest(url + postUtil.getTestEnterprise1Id())
          .end(function(err, res) {
            should.not.exist(err);
            enterpriseVerifier.verifyEnterprise1Public(res.body);
            done();
          });
    };

    // Before doing request pause for 1 second.
    // Otherwise we seem to get a race condition
    // I think the post enterprise are not synchronous calls.
    // Should come up with a better way to do this.
    setTimeout(doGetRequest, 1000);
  });

  it('should return enterprise when multiple enterprises in directory', function(done) {
    postUtil.postTestEnterprise1();
    postUtil.postTestEnterprise2();
    postUtil.postTestEnterprise3();

    var doGetRequest = function() {
      requestUtil.buildGetRequest(url + postUtil.getTestEnterprise2Id())
          .end(function(err, res) {
            should.not.exist(err);
            enterpriseVerifier.verifyEnterprise2Public(res.body);
            done();
          });
    };

    // Before doing request pause for 1 second.
    // Otherwise we seem to get a race condition
    // I think the post enterprise are not synchronous calls.
    // Should come up with a better way to do this.
    setTimeout(doGetRequest, 1000);
  });

});
