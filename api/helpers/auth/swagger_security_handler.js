const adminChecker = require('./request_admin_checker');

function authenticateDirectoryAdmin(req, res, next) {
  if (adminChecker.isRequestDirectoryAdmin(req)) {
    return next();
  }

  handleNotAuthorized(res);
}

function authenticateEnterpriseAdmin(req, res, next) {
  let enterpriseId = extractExterpriseFromRequest(req);
  if (adminChecker.isRequestEnterpriseAdmin(req, enterpriseId)) {
    return next();
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
