const adminHelper = require('./admin_helper');

function authenticateDirectoryAdmin(req, res, next) {
  if (adminHelper.isDirectoryAdmin(req)) {
    return next();
  }

  handleNotAuthorized(res);
}

function authenticateEnterpriseAdmin(req, res, next) {
  let enterpriseId = extractExterpriseFromRequest(req);
  if (adminHelper.isEnterpriseAdmin(req, enterpriseId)) {
    next();
  }
  handleNotAuthorized(res);
}

function extractExterpriseFromRequest(req) {
  // TODO: safer to change name from id to enterpriseId
  if (req.swagger && req.swagger.params && req.swagger.params.id && req.swagger.params.id.value) {
    return req.swagger.params.id.value;
  }
  return '';
}

function handleNotAuthorized(res) {
  res.status(403).json({'message': 'Not authorized to perform this action'});
}

module.exports = {
  'oauth-directory-admin': authenticateDirectoryAdmin,
  'oauth-enterprise-admin': authenticateEnterpriseAdmin
};
