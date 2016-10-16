var mongoose = require('mongoose');
var logger = require('../../lib/logger');
var enterprisePublicModel = mongoose.model('EnterprisePublic');
var enterprisePrivateFieldsModel = mongoose.model('EnterprisePrivateFields');
var enterpriseLogoModel = mongoose.model('EnterpriseLogo');
var enterpriseAdapter = require('./enterprise.adapter');

var publicFields = require('../data/enterprise.model').enterprisePublicFields.join(' ');


module.exports.getAllEnterprisesPublic = function(req, res) {
  var query;

  var search = req.swagger.params.q.value;
  if (!search) {
    query = enterprisePublicModel.find();
  } else {
    var keywords = search.replace(/\+/g, ' ');
    query = enterprisePublicModel
      .find(
        { $text : { $search : keywords } },
        { score : { $meta: 'textScore' } })
      .sort({ score : { $meta : 'textScore' } });
  }

  var offset = req.swagger.params.offset.value;
  if (!offset) {
    offset = 0;
  }

  var limit = req.swagger.params.count.value;
  if (!limit) {
    limit = 25;
  }

  query
    .limit(limit)
    .skip(offset)
    .select(publicFields)
    .exec(function(err, dbEnterprises) {
      if (err) {
        logger.error('Error finding enterprises ' + err);
        res.status(500).json({'message': err});
        return;
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
        logger.error('Error finding enterprise', id, ':', err);
        res.status(500).json({'message': err});
        return;
      }
      if (!dbEnterprise) {
        logger.info('Enterprise not found for id ', id);
        res.status(404).json({'message': 'Enterprise not found for id ' + id});
        return;
      }

      try {
        var tranformedEnterprise = enterpriseAdapter.transformDbEnterpriseToRestFormat(dbEnterprise);
        res.status(200).json(tranformedEnterprise);
      } catch (e) {
        res.status(500).json({'message': e});
        return;
      }
    });
};

module.exports.getOneEnterpriseComplete = function(req, res) {
  var id = req.swagger.params.id.value;
  enterprisePublicModel
    .findById(id)
    .exec(function(err, dbEnterprise) {
      if (err) {
        logger.error('Error finding enterprise', id, ':', err);
        res.status(500).json({'message': err});
        return;
      }
      if (!dbEnterprise) {
        logger.info('Enterprise not found for id ', id);
        res.status(404).json({'message': 'Enterprise not found for id ' + id});
        return;
      }

      try {
        var tranformedEnterprise = enterpriseAdapter.transformDbEnterpriseToRestFormat(dbEnterprise);
        res.status(200).json(tranformedEnterprise);
      } catch (e) {
        res.status(500).json({'message': e});
        return;
      }
    });
};

module.exports.createEnterprise = function(req, res) {
  var enterprise = req.swagger.params.Enterprise.value;
  try {
    var publicEnterprise = enterpriseAdapter.transformCompleteEnterpriseToPublicDBFormat(enterprise);
    var privateEnterprise = enterpriseAdapter.transformCompleteEnterpriseToPrivateDBFormat(enterprise);
  } catch (e) {
    res.status(500).json({'message': e});
    return;
  }

  enterprisePrivateFieldsModel.create(privateEnterprise, function(err, dbPrivateEnterprise) {
    if (err) {
      logger.error('Error creating private enterprise fields in db ', err, enterprise);
      res.status(400).json({'message': err});
      return;
    } else {
      publicEnterprise['private_info'] = dbPrivateEnterprise['_id'];

      enterprisePublicModel.create(publicEnterprise, function(err, dbPublicEnterprise) {
        if (err) {
          logger.error('Error creating public enterprise in db ', err, enterprise);
          res.status(400).json({'message': err});
          return;
        } else {

          var apiEnterprise = enterpriseAdapter.transformDbEnterpriseToRestFormat(dbPublicEnterprise);
          enterpriseAdapter.appendPrivateInfo(apiEnterprise, dbPrivateEnterprise);
          logger.info('Enterprise created (name=%s id=%s)', apiEnterprise['name'], apiEnterprise['id']);
          res.status(201).json(apiEnterprise);
        }
      });
    }
  });
};

function imageTypeToContentType(imageType) {
  if (imageType === 'jpg') {
    return 'image/jpeg';
  } else if (imageType === 'png') {
    return 'image/png';
  } else if (imageType === 'svg') {
    return 'image/svg+xml';
  }

  logger.error('Unsupported image type: ' + imageType);
}

module.exports.getEnterpriseLogo = function(req, res) {
  var id = req.swagger.params.id.value;
  enterpriseLogoModel
    .findOne({enterpriseId : id})
    .exec(function(err, dbLogo) {
      if (err) {
        logger.error('Error finding enterprise logo', id, ':', err);
        res.status(500).json({'message': err});
        return;
      }
      if (!dbLogo) {
        logger.info('Enterprise logo not found for id ', id);
        res.status(404).json({'message': 'Enterprise logo not found for id ' + id});
        return;
      }

      res.set('Content-Type', dbLogo.contentType);
      res.status(200).send(dbLogo.image);
    });
};
