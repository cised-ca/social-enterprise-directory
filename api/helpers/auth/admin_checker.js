module.exports.isDirectoryAdmin = function(req) {
  return req.isAuthenticated() && req.user && req.user.isDirectoryAdmin === true;
};

module.exports.isEnterpriseAdmin = function(req, enterpriseId) {
  if (enterpriseId.length == 0) return false;
  return this.isDirectoryAdmin(req) ||
          (req.isAuthenticated() && req.user && req.user.authenticatedEnterprises
            && req.user.authenticatedEnterprises.contains(enterpriseId));
};

module.exports.getAuthenticatedEnterprises = function(req) {
  if (req.isAuthenticated() && req.user && req.user.authenticatedEnterprises) {
    return req.user.authenticatedEnterprises;
  }
  return [];
};
