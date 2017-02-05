const mongoose = require('mongoose');
const logger = require('../../lib/logger');
const coordsUtil = require('../../lib/coordsUtil');
const conf = require('../../config/config.js');

const enterprisePublicModel = mongoose.model('EnterprisePublic');
const enterprisePrivateFieldsModel = mongoose.model('EnterprisePrivateFields');
const enterpriseLogoModel = mongoose.model('EnterpriseLogo');
const enterpriseAdapter = require('./enterprise.adapter');

const publicFields = require('../data/enterprise.model').enterprisePublicFields.join(' ');

const ENTERPRISE_CACHE_CONTROL = conf.get('enterpriseCacheControl');

function locationParamToPointObject(locationSearch) {
  let [longStr, latStr] = locationSearch.split(',');
  let long = parseFloat(longStr);
  let lat = parseFloat(latStr);
  if (!coordsUtil.isValidCoords(long, lat)) {
    return undefined;
  }
  let point = { type : 'Point', coordinates : [long,lat] };
  return point;
}

function processDirectoryResults(res, dbEnterprises) {
  if (!dbEnterprises) {
    res.status(200).json({});
    return;
  }

  let tranformedEnterprises = enterpriseAdapter.transformDbEnterprisesToRestFormat(dbEnterprises);
  res.set('Cache-Control', 'max-age=' + ENTERPRISE_CACHE_CONTROL);
  res.status(200).json(tranformedEnterprises);
}

function performLocationSearch(res, locationSearch, limit, offset) {
  let point = locationParamToPointObject(locationSearch);
  if (!point) {
    res.status(400).json({'message': 'Invalid location parameter'});
    return;
  }

  enterprisePublicModel.aggregate(
    [
      { '$geoNear': {
        'near': point,
        'spherical': true,
        'distanceField': 'dis'
      }},
      { '$skip': offset },
      { '$limit': limit }
    ])
  .then(dbEnterprises => {
    processDirectoryResults(res, dbEnterprises);
  })
  .catch(err => {
    logger.error('Error finding enterprises ' + err);
    res.status(500).json({'message': err});
  });
}

module.exports.getAllEnterprisesPublic = function(req, res) {
  let query;

  let search = req.swagger.params.q.value;
  let locationSearch = req.swagger.params.at.value;

  let limit = req.swagger.params.count.value || 500;
  let offset = req.swagger.params.offset.value || 0;

  if (locationSearch) {
    performLocationSearch(res, locationSearch, limit, offset);
    return;
  }

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

  query
    .limit(limit)
    .skip(offset)
    .select(publicFields)
    .then(dbEnterprises => processDirectoryResults(res, dbEnterprises))
    .catch(err => {
      logger.error('Error finding enterprises ' + err);
      res.status(500).json({'message': err});
    });
};

module.exports.getOneEnterprisePublic = function(req, res) {

  let id = req.swagger.params.id.value;
  enterprisePublicModel
    .findById(id)
    .select(publicFields)
    .then(dbEnterprise => {
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
    })
    .catch(err => {
      logger.error('Error finding enterprise', id, ':', err);
      res.status(500).json({'message': err});
    });
};

module.exports.getOneEnterpriseComplete = function(req, res) {
  let id = req.swagger.params.id.value;
  enterprisePublicModel
    .findById(id)
    .then(dbEnterprise => {
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
    })
    .catch(err => {
      logger.error('Error finding enterprise', id, ':', err);
      res.status(500).json({'message': err});
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

  let dbPrivateEnterpriseInfo;
  enterprisePrivateFieldsModel.create(privateEnterprise)
    // create public enterprise info
    .then(dbPrivateEnterprise => {
      dbPrivateEnterpriseInfo = dbPrivateEnterprise;
      publicEnterprise['private_info'] = dbPrivateEnterprise['_id'];
      return enterprisePublicModel.create(publicEnterprise);
    })
    // create api response
    .then( dbPublicEnterprise => {
      let apiEnterprise = enterpriseAdapter.transformDbEnterpriseToRestFormat(dbPublicEnterprise);
      enterpriseAdapter.appendPrivateInfo(apiEnterprise, dbPrivateEnterpriseInfo);
      logger.info(`Enterprise created (name=${apiEnterprise['name']} id=${apiEnterprise['id']})`);
      res.status(201).json(apiEnterprise);
    })
    .catch(err => {
      logger.error('Error creating enterprise in db ', err, enterprise);
      res.status(400).json({'message': err});
    });
};

module.exports.getEnterpriseLogo = function(req, res) {
  let id = req.swagger.params.id.value;
  enterpriseLogoModel
    .findOne({enterpriseId : id})
    .then( dbLogo => {
      if (!dbLogo) {
        logger.info('Enterprise logo not found for id ', id);
        res.status(404).json({'message': 'Enterprise logo not found for id ' + id});
        return;
      }

      res.set('Content-Type', dbLogo.contentType);
      res.set('Cache-Control', 'max-age=' + ENTERPRISE_CACHE_CONTROL);
      res.status(200).send(dbLogo.image);
    })
    .catch( err => {
      logger.error('Error finding enterprise logo', id, ':', err);
      res.status(500).json({'message': err});
    });
};
