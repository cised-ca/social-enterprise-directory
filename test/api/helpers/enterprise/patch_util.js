const should = require('should');
const logger = require('../../../../lib/logger');
const requestUtil = require('../../helpers/request_util');
const postUtil = require('../../helpers/enterprise/post_util');

const baseURL = '/enterprise/';

module.exports.editEnterprise1 = function(enterpriseModifications, statusCode) {
  return new Promise( (resolve) => {
    editEnterprise(resolve, baseURL + postUtil.getTestEnterprise1Id(), enterpriseModifications, statusCode);
  });
};

module.exports.editEnterprise2 = function(enterpriseModifications, statusCode) {
  return new Promise( (resolve) => {
    editEnterprise(resolve, baseURL + postUtil.getTestEnterprise2Id(), enterpriseModifications, statusCode);
  });
};

module.exports.editEnterprise1Admins = function(enterpriseModifications, statusCode) {
  return new Promise( (resolve) => {
    editEnterprise(resolve, baseURL + postUtil.getTestEnterprise1Id() + '/admin', enterpriseModifications, statusCode);
  });
};

module.exports.editPendingEnterprise1 = function(enterpriseModifications, statusCode) {
  return new Promise( (resolve) => {
    editEnterprise(resolve, baseURL + postUtil.getTestEnterprise1Id() + '/pending',
                    enterpriseModifications, statusCode);
  });
};


function editEnterprise(resolve, url, enterpriseModifications, statusCode) {
  requestUtil.buildPatchRequest(url, statusCode)
    .send(enterpriseModifications)
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
