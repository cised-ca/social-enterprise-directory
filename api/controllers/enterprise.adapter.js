function transformDbEnterprisesToRestFormat(dbEnterprises, allowPrivateFields) {
  var enterprises = [];
  dbEnterprises.forEach(
      function(currentItem) {
        enterprises.push(transformDbEnterpriseToRestFormat(currentItem, allowPrivateFields));
      }
  );
  return enterprises;
}

function transformDbEnterpriseToRestFormat(dbEnterprise, allowPrivateFields) {

  //clone the object. Is there a better way to do this?
  var apiEnterprise = JSON.parse(JSON.stringify(dbEnterprise));

  // remove the __v and __t fields that are auto created by Mongo
  delete apiEnterprise.__v;
  delete apiEnterprise.__t;

  // switch "_id" to "id"
  apiEnterprise.id = dbEnterprise._id;
  delete apiEnterprise._id;

  if (!allowPrivateFields) {
    filterOutPrivateContactInfo(apiEnterprise);
  }

  return apiEnterprise;
}

function filterOutPrivateContactInfo(enterprise) {
  if (enterprise.emails) {
    filterPrivateEntriesForArray(enterprise.emails);
  }

  if (enterprise.phones) {
    filterPrivateEntriesForArray(enterprise.phones);
  }

  if (enterprise.faxes) {
    filterPrivateEntriesForArray(enterprise.faxes);
  }
}

function filterPrivateEntriesForArray(array) {
  var i = array.length;
  while(i--) {
    if (array[i].public) {
      continue;
    }
    array.splice(i,1);
  }
}

exports.transformDbEnterprisesToRestFormat = transformDbEnterprisesToRestFormat;
exports.transformDbEnterpriseToRestFormat = transformDbEnterpriseToRestFormat;
