
module.exports.handler = {
  isLoggedIn: function() {
    return this.loggedIn;
  },
  isRequestDirectoryAdmin: function() {
    return this.isDirectoryAdmin;
  },
  isRequestEnterpriseAdmin: function() {
    return (this.isDirectoryAdmin || this.isEnterpriseAdmin);
  },
  getAuthenticatedEnterprisesByRequest: function(){ return this.authenticatedEnterprises; },

  loggedIn: false,
  isDirectoryAdmin: false,
  isEnterpriseAdmin: false,
  authenticatedEnterprises: []
};

module.exports.reset = function() {
  this.handler.loggedIn = false;
  this.handler.isDirectoryAdmin = false;
  this.handler.isEnterpriseAdmin = false;
  this.handler.authenticatedEnterprises = [];
};
