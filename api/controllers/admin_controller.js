const mongoose = require('mongoose');
const logger = require('../../lib/logger');
const directoryAdminModel = mongoose.model('DirectoryAdministrators');

module.exports.getAllDirectoryAdmins = function(req, res) {
  directoryAdminModel
    .find()
    .sort({ emails: 1 })
    .then(dbAdmins => processDBAdminResults(res, dbAdmins))
    .catch(err => {
      logger.error('Error finding enterprises ' + err);
      res.status(500).json({'message': err});
    });
};

function processDBAdminResults(res, dbAdmins) {
  let apiAdmins = dbAdmins.map((dbAdmin) => {
    return { email: dbAdmin.email };
  });
  res.status(200).json(apiAdmins);
}
