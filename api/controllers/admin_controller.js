const mongoose = require('mongoose');
const logger = require('../../lib/logger');
const directoryAdminModel = mongoose.model('DirectoryAdministrators');

module.exports.getAllDirectoryAdmins = function(req, res) {
  directoryAdminModel
    .find()
    .sort({ emails: 1 })
    .then(dbAdmins => processDBAdminResults(res, dbAdmins))
    .catch(err => {
      logger.error('Error finding directory administrators ' + err);
      res.status(500).json({'message': err});
    });
};

module.exports.updateDirectoryAdmins = function(req, res) {
  let newAdmins = req.swagger.params.admins.value;

  if (newAdmins.length === 0) {
    res.status(400).json({'message': 'Must have at least one enterprise admin'});
    return;
  }

  // For stability reasons we don't ever want to delete all admins at any point.
  // Therefore, we'll compare the new admin list with what's in the DB and
  //  1. Add any new admins not currently in DB
  //  2. Then delete old admins that are not in the new list

  let adminsToAdd = [];
  let adminsToDelete = [];

  directoryAdminModel.find()
  .then(dbAdmins => {
    adminsToAdd = newAdmins.filter(admin => {
      return dbAdmins.filter(dbAdmin => admin.email === dbAdmin.email).length === 0;
    });
    adminsToDelete = dbAdmins.filter(dbAdmin => {
      return newAdmins.filter(newAdmin => newAdmin.email === dbAdmin.email).length === 0;
    });
    return Promise.resolve();
  })
  .then( () => {
    return Promise.all(adminsToAdd.map(admin => {
      return directoryAdminModel.create(admin);
    }));
  })
  .then( () => {
    return Promise.all(adminsToDelete.map(admin => {
      return directoryAdminModel.deleteOne({'email': admin.email});
    }));
  })
  .then(() => {
    res.status(200).json({});
  })
  .catch(err => {
    logger.error('Error updating directory administrators ' + err);
    res.status(500).json({'message': err});
  });
};

function processDBAdminResults(res, dbAdmins) {
  let apiAdmins = dbAdmins.map((dbAdmin) => {
    return { email: dbAdmin.email };
  });
  res.status(200).json(apiAdmins);
}
