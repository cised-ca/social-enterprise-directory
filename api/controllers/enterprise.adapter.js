function transformDbEnterpriseToRestFormat(dbEnterprise) {

  //clone the object. Is there a better way to do this?
  var apiEnterprise = JSON.parse(JSON.stringify(dbEnterprise));

  // remove the __v and __t fields that are auto created by Mongo
  delete apiEnterprise.__v;
  delete apiEnterprise.__t;

  // switch "_id" to "id"
  apiEnterprise.id = dbEnterprise._id;
  delete apiEnterprise._id;

  return apiEnterprise;
}

function transformDbEnterprisesToRestFormat(dbEnterprises) {
  var enterprises = [];
  dbEnterprises.forEach(
      function(currentItem) {
        enterprises.push(transformDbEnterpriseToRestFormat(currentItem));
      }
  );
  return enterprises;
}

exports.transformDbEnterprisesToRestFormat = transformDbEnterprisesToRestFormat;
exports.transformDbEnterpriseToRestFormat = transformDbEnterpriseToRestFormat;
