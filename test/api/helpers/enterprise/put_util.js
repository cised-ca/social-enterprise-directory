const should = require('should');
const logger = require('../../../../lib/logger');
const requestUtil = require('../../helpers/request_util');

const url = '/enterprise';

module.exports.putLogo = function(enterpriseId, contentType, logoData, statusCode) {
  return new Promise( (resolve) => {
    let logoURL = url + '/' + enterpriseId + '/logo';
    requestUtil.buildPutRequest(logoURL, statusCode)
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

module.exports.putEnterprise = function(enterpriseId, enterpriseData, statusCode) {
  return new Promise( (resolve) => {
    let fullURL = url + '/' + enterpriseId;
    requestUtil.buildPutRequest(fullURL, statusCode)
    .send(enterpriseData)
    .end( function(err, res) {
      if (err) {
        logger.error(res.body);
        should.not.exist(err);
      }
      resolve();
    });
  });
};

module.exports.putPendingEnterprise = function(enterpriseId, enterpriseData, statusCode) {
  return new Promise( (resolve) => {
    let fullURL = url + '/' + enterpriseId + '/pending';
    requestUtil.buildPutRequest(fullURL, statusCode)
    .send(enterpriseData)
    .end( function(err, res) {
      if (err) {
        logger.error(res.body);
        should.not.exist(err);
      }
      resolve();
    });
  });
};
