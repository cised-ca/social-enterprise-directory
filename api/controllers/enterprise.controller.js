var mongoose = require('mongoose');
var enterprisePublicModel = mongoose.model('EnterprisePublic');
var enterpriseCompleteModel = mongoose.model('EnterpriseComplete');
var enterpriseAdapter = require('./enterprise.adapter');

var publicFields = require('../data/enterprise.model').enterprisePublicFields;


module.exports.getAllEnterprisesPublic = function(req, res) {

  enterprisePublicModel
    .find()
    .select(publicFields)
    .exec(function(err, dbEnterprises) {
      if (err) {
        console.log('Error finding enterprises ' + err);
        res.status(500).json({'message': err});
      }
      if (!dbEnterprises) {
        res.status(200).json({});
        return;
      }

      var tranformedEnterprises = enterpriseAdapter.transformDbEnterprisesToRestFormat(dbEnterprises);
      res.status(200).json(tranformedEnterprises);
    });
};

module.exports.getOneEnterprisePublic = function(req, res) {

  var id = req.swagger.params.id.value;
  enterprisePublicModel
    .findById(id)
    .select(publicFields)
    .exec(function(err, dbEnterprise) {
      if (err) {
        console.log('Error finding enterprise ' + id + ' ' + err);
        res.status(500).json({'message': err});
      }
      if (!dbEnterprise) {
        res.status(404).json({'message': 'Enterprise not found for id ' + id});
        return;
      }

      var tranformedEnterprise = enterpriseAdapter.transformDbEnterpriseToRestFormat(dbEnterprise);
      res.status(200).json(tranformedEnterprise);
    });
};

module.exports.getOneEnterpriseComplete = function(req, res) {
  var id = req.swagger.params.id.value;
  enterprisePublicModel
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

      var tranformedEnterprise = enterpriseAdapter.transformDbEnterpriseToRestFormat(dbEnterprise);
      res.status(200).json(tranformedEnterprise);
    });
};

module.exports.createEnterprise = function(req, res) {
  var enterprise = req.swagger.params.Enterprise.value;
  enterpriseCompleteModel.create(enterprise, function(err, dbEnterprise) {
    if (err) {
      console.log('Error creating enterprise ' + err);
      res.status(400).json({'message': err});
      return;
    } else {
      console.log('Enterprise created!', dbEnterprise);
      var apiEnterprise = enterpriseAdapter.transformDbEnterpriseToRestFormat(dbEnterprise);
      res.status(201).json(apiEnterprise);
    }
  });
};
