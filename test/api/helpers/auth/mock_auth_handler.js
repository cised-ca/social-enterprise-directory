
module.exports.handler = {
  isLoggedIn: function() {
    return this.loggedIn;
  },
  isRequestDirectoryAdmin: function() {
    return this.isDirectoryAdmin;
  },
  isRequestEnterpriseAdmin: function() {
    return this.isEnterpriseAdmin;
  },
  getAuthenticatedEnterprisesByRequest: function(){ return this.authenticatedEnterprises; },

  loggedIn: true,
  isDirectoryAdmin: true,
  isEnterpriseAdmin: true,
  authenticatedEnterprises: []
};

module.exports.reset = function() {
  this.handler.loggedIn = true;
  this.handler.isDirectoryAdmin = true;
  this.handler.isEnterpriseAdmin = true;
  this.handler.authenticatedEnterprises = [];
};
