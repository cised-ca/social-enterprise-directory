const should = require('should');
const logger = require('../../../../lib/logger');
const requestUtil = require('../../helpers/request_util');
const postUtil = require('../../helpers/enterprise/post_util');

const baseURL = '/enterprise/';

module.exports.editEnterprise1 = function(enterpriseModifications) {
  return new Promise( (resolve) => {
    editEnterprise(resolve, baseURL + postUtil.getTestEnterprise1Id(), enterpriseModifications);
  });
};

module.exports.editEnterprise2 = function(enterpriseModifications) {
  return new Promise( (resolve) => {
    editEnterprise(resolve, baseURL + postUtil.getTestEnterprise2Id(), enterpriseModifications);
  });
};

module.exports.editEnterprise1Admins = function(enterpriseModifications) {
  return new Promise( (resolve) => {
    editEnterprise(resolve, baseURL + postUtil.getTestEnterprise1Id() + '/admin', enterpriseModifications);
  });
};


function editEnterprise(resolve, url, enterpriseModifications) {
  requestUtil.buildPatchRequest(url)
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
