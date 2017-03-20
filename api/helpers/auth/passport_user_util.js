const logger = require('../../../lib/logger');
const emailAdminChecker = require('./email_admin_checker');

//  Adds the auth properties to the supplied user object:
//    -isDirectoryAdmin
//    -authenticatedEnterprises
module.exports.handle = function(user, callback) {
  emailAdminChecker.isDirectoryAdminByEmails(user.emails)
    .then( isDirectoryAdmin => {
      user.isDirectoryAdmin = isDirectoryAdmin;
      if (isDirectoryAdmin) {
        // done, no need to authenticate further we are a super user!
        return callback(null, user);
      }
      return emailAdminChecker.getAuthenticatedEnterprisesByEmails(user.emails);
    })
    .then(authenticatedEnterprises => {
      if (authenticatedEnterprises) {
        user.authenticatedEnterprises = authenticatedEnterprises;
      } else {
        user.authenticatedEnterprises = [];
      }
      return callback(null, user);
    })
    .catch(err => {
      logger.error('Error authenticating user ', user.emails, ':', err);
      return callback(err, null);
    });
};
