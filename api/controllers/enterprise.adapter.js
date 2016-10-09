var publicFields = require('../data/enterprise.model').enterprisePublicFields;
var privateFields = require('../data/enterprise.model').enterprisePrivateFields;

function transformDbEnterprisesToRestFormat(dbEnterprises) {
  var enterprises = [];
  dbEnterprises.forEach(
      function(currentItem) {
        enterprises.push(transformDbEnterpriseToRestFormat(currentItem));
      }
  );
  return enterprises;
}

function transformDbEnterpriseToRestFormat(dbEnterprise) {

  //clone the object. Is there a better way to do this?
  var apiEnterprise = JSON.parse(JSON.stringify(dbEnterprise));

  // remove the __v and __t fields that are auto created by Mongo
  delete apiEnterprise.__v;
  delete apiEnterprise.__t;

  // switch "_id" to "id"
  apiEnterprise.id = dbEnterprise._id.toString();
  delete apiEnterprise._id;

  return apiEnterprise;
}

module.exports.transformCompleteEnterpriseToPublicDBFormat = function(enterprise) {

  var dbPublicEnterprise = {};
  publicFields.forEach( function(field) {
    if (enterprise[field]) {
      dbPublicEnterprise[field] = JSON.parse(JSON.stringify(enterprise[field]));
    }
  });

  // remove private fields
  filterPrivateEntriesForArray(dbPublicEnterprise.emails);
  filterPrivateEntriesForArray(dbPublicEnterprise.phones);
  filterPrivateEntriesForArray(dbPublicEnterprise.faxes);
  filterPrivateEntriesForArray(dbPublicEnterprise.addresses);

  return dbPublicEnterprise;
};

module.exports.transformCompleteEnterpriseToPrivateDBFormat = function(enterprise) {

  var dbPrivateEnterprise = {};
  privateFields.forEach( function(field) {
    if (enterprise[field]) {
      dbPrivateEnterprise[field] = JSON.parse(JSON.stringify(enterprise[field]));
    }
  });

  // remove public fields
  filterPublicEntriesForArray(dbPrivateEnterprise.emails);
  filterPublicEntriesForArray(dbPrivateEnterprise.phones);
  filterPublicEntriesForArray(dbPrivateEnterprise.faxes);
  filterPublicEntriesForArray(dbPrivateEnterprise.addresses);

  return dbPrivateEnterprise;
};

module.exports.appendPrivateInfo = function(enterprise, privateInfo) {

  privateFields.forEach( function(field) {
    if (privateInfo[field]) {
      if (!enterprise[field]) {
        enterprise[field] = privateInfo[field];
      }
      else {
        enterprise[field] = enterprise[field].concat(privateInfo[field]);
      }
    }
  });
};


function filterPrivateEntriesForArray(array) {
  if (!array) {
    return;
  }
  var i = array.length;
  while(i--) {
    if (array[i].public) {
      continue;
    }
    array.splice(i,1);
  }
}

function filterPublicEntriesForArray(array) {
  if (!array) {
    return;
  }
  var i = array.length;
  while(i--) {
    if (!array[i].public) {
      continue;
    }
    array.splice(i,1);
  }
}


exports.transformDbEnterprisesToRestFormat = transformDbEnterprisesToRestFormat;
exports.transformDbEnterpriseToRestFormat = transformDbEnterpriseToRestFormat;
