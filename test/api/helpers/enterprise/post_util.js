var should = require('should');
var testEnterprise1 = require('../../helpers/data/enterprise/testEnterprise1');
var requestUtil = require('../../helpers/request_util');
var enterpriseVerifier = require('../../helpers/enterprise/enterprise_verifier');

var url = '/enterprise';

module.exports.postTestEnterprise1 = function(done) {
  requestUtil.buildPostRequest(url)
    .send(testEnterprise1)
    .end(function(err, res) {
      should.not.exist(err);
      enterpriseVerifier.verifyEnterprise1(res.body);
      if (done) {
        done();
      }
    });
};
