const logger = require('../../../lib/logger');
const mongoose = require('mongoose');
const directoryAdministratorsModel = mongoose.model('DirectoryAdministrators');
const fs = require('fs');

module.exports.bootstrap = function() {
  directoryAdministratorsModel
    .count({})
    .then(count => {
      if (!count) {
        logger.info('Bootstrapping directory administrators from file');
        bootstrapDirectoryAdminsFromFile();
      }
    })
    .catch( err => {
      logger.error('Error bootstrapping directory administrator:', err);
      logger.error('There are no directory administrators configured');
    });
};

function bootstrapDirectoryAdminsFromFile() {
  let emails = readEmailsFromFile();

  emails.forEach(email => {
    directoryAdministratorsModel
      .create({email : email})
      .then(function(){})
      .catch( err => {
        logger.error('Error bootstrapping directory administrator', email, ':', err);
        return false;
      });
  });
}

function readEmailsFromFile() {
  let contents = fs.readFileSync('config/admins.txt').toString();
  return contents.split(/\n/)
    .map(val => {return val.trim();})
    .filter(val => { return val.length > 0;});
}
