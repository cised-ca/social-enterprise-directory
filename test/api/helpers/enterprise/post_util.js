const should = require('should');
const logger = require('../../../../lib/logger');
const testEnterprise1 = require('../../helpers/data/enterprise/testEnterprise1_complete');
const testEnterprise2 = require('../../helpers/data/enterprise/testEnterprise2_complete');
const testEnterprise3 = require('../../helpers/data/enterprise/testEnterprise3_complete');
const requestUtil = require('../../helpers/request_util');
const enterpriseVerifier = require('../../helpers/enterprise/enterprise_verifier');
const DEFAULT_LANGUAGE = require('../../helpers/language/language_test_constants').DEFAULT_LANGUAGE;

const url = '/enterprise';

var postIds = {};

module.exports.clean = function() {
  postIds = {};
};

module.exports.postTestEnterprise1 = function() {
  return new Promise( (resolve) => {
    postEnterprise(resolve, testEnterprise1, enterpriseVerifier.verifyEnterprise1);
  });
};

module.exports.postTestEnterprise2 = function() {
  return new Promise( (resolve) => {
    postEnterprise(resolve, testEnterprise2, enterpriseVerifier.verifyEnterprise2);
  });
};

module.exports.postTestEnterprise3 = function() {
  return new Promise( (resolve) => {
    postEnterprise(resolve, testEnterprise3, enterpriseVerifier.verifyEnterprise3);
  });
};

module.exports.postTestEnterprise1ExpectError = function(statusCode) {
  return new Promise( (resolve) => {
    postEnterprise(resolve, testEnterprise1, null, statusCode);
  });
};

module.exports.postAllEnterprises = function() {
  return new Promise ( resolve => {
    module.exports.postTestEnterprise1()
    .then(module.exports.postTestEnterprise2)
    .then(module.exports.postTestEnterprise3)
    .then(() => resolve())
    .catch(err => should.fail(null, null, err));
  });
};

module.exports.getTestEnterprise1Id = function() {
  return postIds[testEnterprise1[DEFAULT_LANGUAGE]['name']];
};
module.exports.getTestEnterprise2Id = function() {
  return postIds[testEnterprise2[DEFAULT_LANGUAGE]['name']];
};
module.exports.getTestEnterprise3Id = function() {
  return postIds[testEnterprise3[DEFAULT_LANGUAGE]['name']];
};

function postEnterprise(resolve, enterprise, verifyMethod, statusCode) {
  requestUtil.buildPostRequest(url, statusCode)
    .send(enterprise)
    .end( function(err, res) {
      if (err) {
        logger.error(res.body);
      }
      should.not.exist(err);
      if (verifyMethod) {
        verifyMethod(res.body);
        postIds[enterprise[DEFAULT_LANGUAGE]['name']] = res.body['id'];
      }
      if (resolve) {
        resolve();
      }
    });
}

module.exports.postLogo = function(enterpriseId, contentType, logoData, statusCode) {
  return new Promise( (resolve) => {
    let logoURL = url + '/' + enterpriseId + '/logo';
    requestUtil.buildPostRequest(logoURL, statusCode)
    .send({
      content_type: contentType,
      logo: new Buffer(logoData).toString('base64')
    })
    .end( function(err, res) {
      if (err) {
        logger.error(res.body);
        should.not.exist(err);
      }
      resolve();
    });
  });
};
