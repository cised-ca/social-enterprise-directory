const should = require('should');
const logger = require('../../../../lib/logger');
const requestUtil = require('../../helpers/request_util');
const postUtil = require('../../helpers/enterprise/post_util');

const baseURL = '/enterprise/';

module.exports.deleteEnterprise1 = function(statusCode) {
  return new Promise( (resolve) => {
    deleteEnterprise(resolve, baseURL + postUtil.getTestEnterprise1Id(), statusCode);
  });
};

module.exports.deleteEnterprise2 = function(statusCode) {
  return new Promise( (resolve) => {
    deleteEnterprise(resolve, baseURL + postUtil.getTestEnterprise2Id(), statusCode);
  });
};

module.exports.deletePendingEnterprise1 = function(statusCode) {
  return new Promise( (resolve) => {
    deleteEnterprise(resolve, baseURL + postUtil.getTestEnterprise1Id() + '/pending', statusCode);
  });
};

module.exports.deleteUnpublishedEnterprise1 = function(statusCode) {
  return new Promise( (resolve) => {
    deleteEnterprise(resolve, baseURL + postUtil.getTestEnterprise1Id() + '/unpublished', statusCode);
  });
};

function deleteEnterprise(resolve, url, statusCode) {
  requestUtil.buildDeleteRequest(url, statusCode)
    .send()
    .end( function(err, res) {
      if (err) {
        logger.error(res.body);
      }
      should.not.exist(err);
      if (resolve) {
        resolve();
      }
    });
}

module.exports.deleteLogo = function(enterpriseId, statusCode) {
  return new Promise( (resolve, reject) => {
    let logoURL = baseURL + enterpriseId + '/logo';
    requestUtil.buildDeleteRequest(logoURL, statusCode)
      .send()
      .end( function(err, res) {
        if (err) {
          logger.error(res.body);
          reject(err);
        }
        should.not.exist(err);
        resolve();
      });
  });
};
