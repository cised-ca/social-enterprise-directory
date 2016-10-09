var mongoose = require('mongoose');
var winston = require('winston');
var enterprisePublicModel = mongoose.model('EnterprisePublic');
var enterprisePrivateFieldsModel = mongoose.model('EnterprisePrivateFields');
var enterpriseAdapter = require('./enterprise.adapter');

var publicFields = require('../data/enterprise.model').enterprisePublicFields.join(' ');


module.exports.getAllEnterprisesPublic = function(req, res) {

  enterprisePublicModel
    .find()
    .select(publicFields)
    .exec(function(err, dbEnterprises) {
      if (err) {
        winston.error('Error finding enterprises ' + err);
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
        winston.error('Error finding enterprise', id, ':', err);
        res.status(500).json({'message': err});
      }
      if (!dbEnterprise) {
        winston.info('Enterprise not found for id ', id);
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
        winston.error('Error finding enterprise', id, ':', err);
        res.status(500).json({'message': err});
      }
      if (!dbEnterprise) {
        winston.info('Enterprise not found for id ', id);
        res.status(404).json({'message': 'Enterprise not found for id ' + id});
        return;
      }

      var tranformedEnterprise = enterpriseAdapter.transformDbEnterpriseToRestFormat(dbEnterprise);
      res.status(200).json(tranformedEnterprise);
    });
};

module.exports.createEnterprise = function(req, res) {
  var enterprise = req.swagger.params.Enterprise.value;

  var publicEnterprise = enterpriseAdapter.transformCompleteEnterpriseToPublicDBFormat(enterprise);
  var privateEnterprise = enterpriseAdapter.transformCompleteEnterpriseToPrivateDBFormat(enterprise);

  enterprisePrivateFieldsModel.create(privateEnterprise, function(err, dbPrivateEnterprise) {
    if (err) {
      winston.error('Error creating private enterprise fields in db ', err, enterprise);
      res.status(400).json({'message': err});
      return;
    } else {
      publicEnterprise['private_info'] = dbPrivateEnterprise['_id'];

      enterprisePublicModel.create(publicEnterprise, function(err, dbPublicEnterprise) {
        if (err) {
          winston.error('Error creating public enterprise in db ', err, enterprise);
          res.status(400).json({'message': err});
          return;
        } else {

          var apiEnterprise = enterpriseAdapter.transformDbEnterpriseToRestFormat(dbPublicEnterprise);
          enterpriseAdapter.appendPrivateInfo(apiEnterprise, dbPrivateEnterprise);
          winston.info('Enterprise created (name=%s id=%s)', apiEnterprise['name'], apiEnterprise['id']);
          res.status(201).json(apiEnterprise);
        }
      });
    }
  });
};
