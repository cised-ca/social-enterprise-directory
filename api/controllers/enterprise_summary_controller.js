const mongoose = require('mongoose');
const logger = require('../../lib/logger');
const adminChecker = require('../helpers/auth/request_admin_checker');
const langUtil = require('../helpers/language/lang_util');
const enterpriseInternationalPublicModel = mongoose.model('EnterpriseInternationalPublic');
const pendingEnterpriseInternationalPublicModel = mongoose.model('PendingEnterpriseInternationalPublic');
const unpublishedEnterpriseInternationalPublicModel = mongoose.model('UnpublishedEnterpriseInternationalPublic');

module.exports.getAccountEnterpriseSummary = function(req, res) {
  let language = langUtil.getLanguage(req);

  if (!adminChecker.isLoggedIn(req)) {
    res.status(403).json({'message': 'Not logged in'});
    return;
  }

  if (adminChecker.isRequestDirectoryAdmin(req)) {
    handleEnterpriseSummary(language)
      .then(summary => {res.status(200).json(summary);})
      .catch(err => {
        logger.error('Error handling directory admin enterprise summary ', err);
        res.status(500).json({'message': err});
      });
    return;
  }

  let enterprisePermissions = adminChecker.getAuthenticatedEnterprisesByRequest(req);
  let query = {'_id': { $in: enterprisePermissions.map(v => v.id)}};
  handleEnterpriseSummary(language, query)
    .then(summary => {res.status(200).json(summary);})
    .catch(err => {
      logger.error('Error handling enterprise admin enterprise summary ', err);
      res.status(500).json({'message': err});
    });
};

function handleEnterpriseSummary(language, query) {
  return new Promise( (resolve, reject) => {
    let summary = {
      published: [],
      pending: [],
      unpublished: []
    };

    let sortValue = {};
    sortValue[language + '.lowercase_name'] = 1;

    enterpriseInternationalPublicModel
      .find(query).lean().select(language + '.name').sort(sortValue)
      .then(enterprises => {
        summary.published = enterprises.map(v => {
          return {id: v._id, name: v[language].name};
        });
        return pendingEnterpriseInternationalPublicModel
                .find(query).lean().select(language + '.name').sort(sortValue);
      })
      .then(pendingEnterprises => {
        summary.pending = pendingEnterprises.map(v => {
          return {id: v._id, name: v[language].name};
        });
        return unpublishedEnterpriseInternationalPublicModel
                .find(query).lean().select(language + '.name').sort(sortValue);
      })
      .then(unpublishedEnterprises => {
        summary.unpublished = unpublishedEnterprises.map(v => {
          return {id: v._id, name: v[language].name};
        });
        return Promise.resolve();
      })
      .then(() => {resolve(summary);})
      .catch(err => {reject(err);});
  });

}
