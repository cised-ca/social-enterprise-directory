const logger = require('../../../lib/logger');
const mongoose = require('mongoose');
const enterprisePublicModel = mongoose.model('EnterprisePublic');

module.exports.getName = function(id) {
  return new Promise( (resolve) => {
    enterprisePublicModel
      .findById(id)
      .select('name')
      .then(dbEnterprise => {
        if (!dbEnterprise) {
          return resolve('');
        }
        return resolve(dbEnterprise['name']);
      })
      .catch(err => {
        logger.error('Error resolving name for enterprise', id, ':', err);
        return resolve('');
      });
  });
};
