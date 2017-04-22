const logger = require('../../../lib/logger');
const mongoose = require('mongoose');
const enterpriseInternationalPublicModel = mongoose.model('EnterpriseInternationalPublic');

module.exports.getName = function(id, language) {
  return new Promise( (resolve) => {
    enterpriseInternationalPublicModel
      .findById(id)
      .select(language)
      .then(dbEnterprise => {
        if (!dbEnterprise) {
          return resolve('');
        }
        return resolve(dbEnterprise['data']['name']);
      })
      .catch(err => {
        logger.error('Error resolving name for enterprise', id, ':', err);
        return resolve('');
      });
  });
};
