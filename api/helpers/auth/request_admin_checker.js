module.exports.isLoggedIn = function(req) {
  return req.isAuthenticated();
};

module.exports.isRequestDirectoryAdmin = function(req) {
  return req.isAuthenticated() && req.user && req.user.isDirectoryAdmin === true;
};

module.exports.isRequestEnterpriseAdmin = function(req, enterpriseId) {
  if (enterpriseId.length == 0) return false;
  return this.isRequestDirectoryAdmin(req) ||
          (req.isAuthenticated() && req.user && req.user.authenticatedEnterprises
            && req.user.authenticatedEnterprises.contains(enterpriseId));
};

module.exports.getAuthenticatedEnterprisesByRequest = function(req) {
  if (req.isAuthenticated() && req.user && req.user.authenticatedEnterprises) {
    return req.user.authenticatedEnterprises;
  }
  return [];
};
