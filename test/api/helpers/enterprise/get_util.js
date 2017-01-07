const should = require('should');
const requestUtil = require('../../helpers/request_util');
const postUtil = require('../../helpers/enterprise/post_util');
const enterpriseVerifier = require('../../helpers/enterprise/enterprise_verifier');
const url = '/enterprise/';

module.exports.getByIdEnterprise1 = function () {
  return new Promise( (resolve) => {
    requestUtil.performGetRequest(url + postUtil.getTestEnterprise1Id())()
    .then( res => {
      enterpriseVerifier.verifyEnterprise1Public(res.body);
    })
    .then(resolve)
    .catch( err => should.not.exist(err));
  });
};

module.exports.getByIdEnterprise2 = function () {
  return new Promise( (resolve) => {
    requestUtil.performGetRequest(url + postUtil.getTestEnterprise2Id())()
    .then( res => {
      enterpriseVerifier.verifyEnterprise2Public(res.body);
    })
    .then(resolve)
    .catch( err => should.not.exist(err));
  });
};

module.exports.getByIdEnterprise3 = function () {
  return new Promise( (resolve) => {
    requestUtil.performGetRequest(url + postUtil.getTestEnterprise3Id())()
    .then( res => {
      enterpriseVerifier.verifyEnterprise3Public(res.body);
    })
    .then(resolve)
    .catch( err => should.not.exist(err));
  });
};
