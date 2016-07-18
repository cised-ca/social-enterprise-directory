var mongoose = require('mongoose');
var enterpriseModel = mongoose.model('Enterprise');

module.exports.getAllEnterprisesPublic = function(req, res) {

  enterpriseModel
    .find()
    .exec(function(err, dbEnterprises) {
      if (err) {
        console.log('Error finding enterprises ' + err);
        res.status(500).json({'message': err});
      }
      if (!dbEnterprises) {
        res.status(200).json({});
        return;
      }

      var tranformedEnterprises = transformDbEnterprisesToRestFormat(dbEnterprises);
      res.status(200).json(tranformedEnterprises);
    });
};

module.exports.getOneEnterprisePublic = function(req, res) {

  var id = req.swagger.params.id.value;
  enterpriseModel
    .findById(id)
    .exec(function(err, dbEnterprise) {
      if (err) {
        console.log('Error finding enterprise ' + id + ' ' + err);
        res.status(500).json({'message': err});
      }
      if (!dbEnterprise) {
        res.status(404).json({'message': 'Enterprise not found for id ' + id});
        return;
      }

      var tranformedEnterprise = transformDbEnterpriseToRestFormat(dbEnterprise);
      res.status(200).json(tranformedEnterprise);
    });
};

module.exports.getOneEnterpriseComplete = function(req, res) {
  var id = req.swagger.params.id.value;
  enterpriseModel
    .findById(id)
    .exec(function(err, dbEnterprise) {
      if (err) {
        console.log('Error finding enterprise ' + id + ' ' + err);
        res.status(500).json({'message': err});
      }
      if (!dbEnterprise) {
        res.status(404).json({'message': 'Enterprise not found for id ' + id});
        return;
      }

      var tranformedEnterprise = transformDbEnterpriseToRestFormat(dbEnterprise);
      res.status(200).json(tranformedEnterprise);
    });
};



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
  // switch "_id" to "id"
  var apiEnterprise = JSON.parse(JSON.stringify(dbEnterprise));
  apiEnterprise.id = dbEnterprise._id;
  delete apiEnterprise._id;

  // remove translation field
  delete apiEnterprise.translation;

  return apiEnterprise;
}
