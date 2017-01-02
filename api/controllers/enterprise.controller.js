const mongoose = require('mongoose');
const logger = require('../../lib/logger');
const conf = require('../../config/config.js');

const enterprisePublicModel = mongoose.model('EnterprisePublic');
const enterprisePrivateFieldsModel = mongoose.model('EnterprisePrivateFields');
const enterpriseLogoModel = mongoose.model('EnterpriseLogo');
const enterpriseAdapter = require('./enterprise.adapter');

const publicFields = require('../data/enterprise.model').enterprisePublicFields.join(' ');

const ENTERPRISE_CACHE_CONTROL = conf.get('enterpriseCacheControl');

module.exports.getAllEnterprisesPublic = function(req, res) {
  let query;

  let search = req.swagger.params.q.value;
  if (!search) {
    query = enterprisePublicModel.find().sort({lowercase_name: 1});
  } else {
    let keywords = search.replace(/\+/g, ' ');
    query = enterprisePublicModel
      .find(
        { $text : { $search : keywords } },
        { score : { $meta: 'textScore' } })
      .sort({ score : { $meta : 'textScore' } });
  }

  let offset = req.swagger.params.offset.value;
  if (!offset) {
    offset = 0;
  }

  let limit = req.swagger.params.count.value;
  if (!limit) {
    limit = 500;
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

      let tranformedEnterprises = enterpriseAdapter.transformDbEnterprisesToRestFormat(dbEnterprises);
      res.set('Cache-Control', 'max-age=' + ENTERPRISE_CACHE_CONTROL);
      res.status(200).json(tranformedEnterprises);
    });
};

module.exports.getOneEnterprisePublic = function(req, res) {

  let id = req.swagger.params.id.value;
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
        let tranformedEnterprise = enterpriseAdapter.transformDbEnterpriseToRestFormat(dbEnterprise);
        res.set('Cache-Control', 'max-age=' + ENTERPRISE_CACHE_CONTROL);
        res.status(200).json(tranformedEnterprise);
      } catch (e) {
        res.status(500).json({'message': e});
        return;
      }
    });
};

module.exports.getOneEnterpriseComplete = function(req, res) {
  let id = req.swagger.params.id.value;
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
        let tranformedEnterprise = enterpriseAdapter.transformDbEnterpriseToRestFormat(dbEnterprise);
        res.set('Cache-Control', 'max-age=' + ENTERPRISE_CACHE_CONTROL);
        res.status(200).json(tranformedEnterprise);
      } catch (e) {
        res.status(500).json({'message': e});
        return;
      }
    });
};

module.exports.createEnterprise = function(req, res) {
  if (conf.get('env') != 'test') {
    res.status(403).json({'message': 'Not supported yet'});
    return;
  }
  let enterprise = req.swagger.params.Enterprise.value;
  let publicEnterprise;
  let privateEnterprise;
  try {
    publicEnterprise = enterpriseAdapter.transformCompleteEnterpriseToPublicDBFormat(enterprise);
    privateEnterprise = enterpriseAdapter.transformCompleteEnterpriseToPrivateDBFormat(enterprise);
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

          let apiEnterprise = enterpriseAdapter.transformDbEnterpriseToRestFormat(dbPublicEnterprise);
          enterpriseAdapter.appendPrivateInfo(apiEnterprise, dbPrivateEnterprise);
          logger.info(`Enterprise created (name=${apiEnterprise['name']} id=${apiEnterprise['id']})`);
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
  let id = req.swagger.params.id.value;
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
      res.set('Cache-Control', 'max-age=' + ENTERPRISE_CACHE_CONTROL);
      res.status(200).send(dbLogo.image);
    });
};
