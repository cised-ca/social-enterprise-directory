const should = require('should');
const requestUtil = require('../../helpers/request_util');
const postUtil = require('../../helpers/enterprise/post_util');
const enterpriseVerifier = require('../../helpers/enterprise/enterprise_verifier');
const url = '/enterprise/';
const logger = require('../../../../lib/logger');

function getEnterpriseById(language, getIdFunc, verifyFunc) {
  return new Promise( (resolve) => {
    let fullURL = url + getIdFunc();
    if (language) {
      fullURL += '?lang=' + language;
    }
    requestUtil.performGetRequest(fullURL)()
    .then( res => {
      verifyFunc(res.body, language);
    })
    .then(resolve)
    .catch( (err) => {
      logger.error(err);
      should.fail(err);
    });
  });
}

module.exports.getByIdEnterprise1 = function (language) {
  return getEnterpriseById(language, postUtil.getTestEnterprise1Id,
                      enterpriseVerifier.verifyEnterprise1Public);
};

module.exports.getByIdEnterprise2 = function (language) {
  return getEnterpriseById(language, postUtil.getTestEnterprise2Id,
                      enterpriseVerifier.verifyEnterprise2Public);
};

module.exports.getByIdEnterprise3 = function (language) {
  return getEnterpriseById(language, postUtil.getTestEnterprise3Id,
                      enterpriseVerifier.verifyEnterprise3Public);
};
