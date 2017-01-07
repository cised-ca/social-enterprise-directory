const should = require('should');
const requestUtil = require('../../helpers/request_util');
const postUtil = require('../../helpers/enterprise/post_util');
const enterpriseVerifier = require('../../helpers/enterprise/enterprise_verifier');
const url = '/enterprise/';

module.exports.getByIdEnterprise1 = function () {
  return new Promise( (resolve) => {
    requestUtil.buildGetRequest(url + postUtil.getTestEnterprise1Id())
      .end(function(err, res) {
        should.not.exist(err);
        enterpriseVerifier.verifyEnterprise1Public(res.body);
        resolve();
      });
  });
};

module.exports.getByIdEnterprise2 = function () {
  return new Promise( (resolve) => {
    requestUtil.buildGetRequest(url + postUtil.getTestEnterprise2Id())
        .end(function(err, res) {
          should.not.exist(err);
          enterpriseVerifier.verifyEnterprise2Public(res.body);
          resolve();
        });
  });
};

module.exports.getByIdEnterprise3 = function () {
  return new Promise( (resolve) => {
    requestUtil.buildGetRequest(url + postUtil.getTestEnterprise3Id())
        .end(function(err, res) {
          should.not.exist(err);
          enterpriseVerifier.verifyEnterprise3Public(res.body);
          resolve();
        });
  });
};
