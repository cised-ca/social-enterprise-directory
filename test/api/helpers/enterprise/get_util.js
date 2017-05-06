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

function getEnterpriseByIdExpectError(statusCode, getIdFunc) {
  return new Promise( (resolve) => {
    let fullURL = url + getIdFunc();
    requestUtil.performGetRequest(fullURL, statusCode)()
    .then(resolve)
    .catch( (err) => {
      logger.error(err);
      should.fail(err);
    });
  });
}

function getEnterpriseBody(language, getIdFunc) {
  return new Promise( (resolve) => {
    let fullURL = url + getIdFunc();
    if (language) {
      fullURL += '?lang=' + language;
    }
    requestUtil.performGetRequest(fullURL)()
    .then( res => {
      resolve(res.body);
    })
    .catch( (err) => {
      logger.error(err);
      should.fail(err);
    });
  });
}

function getEnterpriseAdminsBody(getIdFunc) {
  return new Promise( (resolve) => {
    let fullURL = url + getIdFunc() + '/admin';
    requestUtil.performGetRequest(fullURL)()
    .then( res => {
      resolve(res.body);
    })
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

module.exports.getByIdEnterprise1ExpectError = function (statusCode) {
  return getEnterpriseByIdExpectError(statusCode, postUtil.getTestEnterprise1Id);
};

module.exports.getByIdEnterprise2ExpectError = function (statusCode) {
  return getEnterpriseByIdExpectError(statusCode, postUtil.getTestEnterprise2Id);
};

module.exports.getByIdEnterprise3ExpectError = function (statusCode) {
  return getEnterpriseByIdExpectError(statusCode, postUtil.getTestEnterprise3Id);
};

module.exports.getEnterprise1 = function (language) {
  return getEnterpriseBody(language, postUtil.getTestEnterprise1Id);
};

module.exports.getEnterprise2 = function (language) {
  return getEnterpriseBody(language, postUtil.getTestEnterprise2Id);
};

module.exports.getEnterprise1Admins = function () {
  return getEnterpriseAdminsBody(postUtil.getTestEnterprise1Id);
};
