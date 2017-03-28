const logger = require('../../../lib/logger');
const mongoose = require('mongoose');
const directoryAdministratorsModel = mongoose.model('DirectoryAdministrators');
const enterprisePrivateFieldsModel = mongoose.model('EnterprisePrivateFields');
const enterpriseNameResolver = require('../enterprise/enterprise_name_resolver');

function checkIfEmailIsDirectoryAdmin(email) {
  return new Promise( (resolve) => {
    if (!email) resolve(false);
    directoryAdministratorsModel
      .findOne({email : email})
      .then( admin => {
        if (!admin) resolve(false);
        resolve(true);
      })
      .catch( err => {
        logger.error('Error checking if directory administrator', email, ':', err);
        resolve(false);
      });
  });
}

function checkIfEmailIsRegisteredWithEnterprises(email) {
  return new Promise( (resolve) => {
    if (!email) resolve(false);
    enterprisePrivateFieldsModel
      .find({admin_emails : email})
      .then( results => {
        resolve(
          results.map(enterprise => {
            return enterprise.enterprise_id;
          })
        );
      })
    .catch( err => {
      logger.error('Error checking authenticated enterprises by email ', email, ':', err);
      resolve(false);
    });
  });
}

module.exports.isDirectoryAdminByEmails = function(emails) {
  return new Promise( (resolve) => {

    let subPromises = emails.map(email => {return checkIfEmailIsDirectoryAdmin(email);});
    Promise.all(subPromises)
      .then(results => {
        let isAdmin = results.reduce((prevVal, curVal) => {return (prevVal || curVal);}, false);
        resolve(isAdmin);
      })
      .catch( function() {
        resolve(false);
      });

  });
};

module.exports.getAuthenticatedEnterprisesByEmails = function(emails) {
  return new Promise( (resolve) => {
    let subPromises = emails.map(
      email => { return checkIfEmailIsRegisteredWithEnterprises(email);}
    );

    Promise.all(subPromises)
      .then(results => {
        let uniqueEnterpriseList = authEnterpriseResultsToUniqueList(results);
        return addEnterpriseNames(uniqueEnterpriseList);
      })
      .then(detailedEnterpriseList => {
        resolve(detailedEnterpriseList);
      })
      .catch( function() {
        resolve([]);
      });
  });
};

function authEnterpriseResultsToUniqueList(results) {
  let enterpriseMap = {};
  for (let enterpriseList of results) {
    for (let enterprise of enterpriseList) {
      if (!enterpriseMap[enterprise]) {
        enterpriseMap[enterprise] = true;
      }
    }
  }
  return Object.keys(enterpriseMap);
}

function addEnterpriseNames(enterpriseIds) {
  return new Promise( (resolve) => {
    let subPromises = enterpriseIds.map(id => { return enterpriseNameResolver.getName(id); });
    Promise.all(subPromises)
    .then(results => {
      let detailedEnterprises = results.map( (enterpriseName, index) => {
        return {id: enterpriseIds[index], name: enterpriseName};
      });
      resolve(detailedEnterprises);
    })
    .catch(err => {
      logger.error('Error finding enterprise names ' + err);
      resolve([]);
    });
  });
}
