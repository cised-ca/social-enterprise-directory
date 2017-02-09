const publicFields = require('../data/enterprise.model').enterprisePublicFields;
const privateFields = require('../data/enterprise.model').enterprisePrivateFields;

function transformDbEnterprisesToRestFormat(dbEnterprises) {
  let enterprises = [];
  dbEnterprises.forEach(
      function(currentItem) {
        enterprises.push(transformDbEnterpriseToRestFormat(currentItem));
      }
  );
  return enterprises;
}

function transformDbEnterpriseToRestFormat(dbEnterprise) {

  // clone the object
  let apiEnterprise = JSON.parse(JSON.stringify(dbEnterprise));

  // remove the __v and __t fields that are auto created by Mongo
  delete apiEnterprise.__v;
  delete apiEnterprise.__t;

  // switch "_id" to "id"
  apiEnterprise.id = dbEnterprise._id.toString();
  delete apiEnterprise._id;

  delete apiEnterprise.lowercase_name;

  // if there was a "score" field due to text index lookup, remove it
  delete apiEnterprise.score;

  // if there was a "distance" field due to location index lookup, remove it
  delete apiEnterprise.dis;

  return apiEnterprise;
}

// Throws exception on error.
module.exports.transformCompleteEnterpriseToPublicDBFormat = function(enterprise) {

  let dbPublicEnterprise = {};
  publicFields.forEach( function(field) {
    if (enterprise[field]) {
      dbPublicEnterprise[field] = JSON.parse(JSON.stringify(enterprise[field]));
    }
  });

  // create lower case name field
  dbPublicEnterprise.lowercase_name = dbPublicEnterprise.name.toLowerCase();

  // remove private fields
  filterPrivateEntriesForArray(dbPublicEnterprise.emails);
  filterPrivateEntriesForArray(dbPublicEnterprise.phones);
  filterPrivateEntriesForArray(dbPublicEnterprise.faxes);
  filterPrivateEntriesForArray(dbPublicEnterprise.addresses);

  return dbPublicEnterprise;
};

// Throws exception on error.
module.exports.transformCompleteEnterpriseToPrivateDBFormat = function(enterprise) {

  let dbPrivateEnterprise = {};
  privateFields.forEach( field => {
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

// Throws exception on error.
module.exports.appendPrivateInfo = function(enterprise, privateInfo) {

  privateFields.forEach( field => {
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
  let i = array.length;
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
  let i = array.length;
  while(i--) {
    if (!array[i].public) {
      continue;
    }
    array.splice(i,1);
  }
}


exports.transformDbEnterprisesToRestFormat = transformDbEnterprisesToRestFormat;
exports.transformDbEnterpriseToRestFormat = transformDbEnterpriseToRestFormat;
