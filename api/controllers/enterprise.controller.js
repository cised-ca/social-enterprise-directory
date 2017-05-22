const mongoose = require('mongoose');
const logger = require('../../lib/logger');
const coordsUtil = require('../../lib/coords_util');
const conf = require('../../config/config.js');

const enterpriseInternationalPublicModel = mongoose.model('EnterpriseInternationalPublic');
const enterpriseInternationalPrivateFieldsModel = mongoose.model('EnterpriseInternationalPrivateFields');
const enterpriseLogoModel = mongoose.model('EnterpriseLogo');
const enterpriseAdapter = require('./enterprise.adapter');
const SUPPORTED_LANGUAGES = require('../helpers/language/constants').SUPPORTED_LANGUAGES;
const DEFAULT_LANGUAGE = require('../helpers/language/constants').DEFAULT_LANGUAGE;
const SUPPORTED_IMAGE_TYPES = ['image/png', 'image/gif', 'image/jpeg', 'image/svg+xml'];

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

function processDirectoryResults(res, dbEnterprises, language, page, pages) {
  if (!dbEnterprises) {
    res.status(200).json({});
    return;
  }

  let transformedEnterprises = enterpriseAdapter.transformDbEnterprisesToApiFormatForLanguage(dbEnterprises, language);
  res.set('Cache-Control', 'max-age=' + ENTERPRISE_CACHE_CONTROL);
  res.status(200).json({
    enterprises: transformedEnterprises,
    page: page,
    pages: pages
  });
}

function performLocationSearch(res, locationSearch, limit, page, language) {
  let point = locationParamToPointObject(locationSearch);
  if (!point) {
    res.status(400).json({'message': 'Invalid location parameter'});
    return;
  }

  let aggregate = enterpriseInternationalPublicModel.aggregate(
      [{
        '$geoNear': {
          'near': point,
          'spherical': true,
          'distanceField': 'dis'
        }
      }]
    );

  let options = {
    page: page,
    limit: limit
  };

  enterpriseInternationalPublicModel
    .aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
      if (err) {
        res.status(500).json({'message': err});
        logger.error('Error finding enterprises ' + err);

        return;
      }

      let dbEnterprises = results;

      processDirectoryResults(res, dbEnterprises, language, page, pageCount);
    });
}

function performBrowseDirectory(res, limit, page, language) {
  let sortValue = {};
  sortValue[language + '.lowercase_name'] = 1;

  let queryOptions = {
    limit: limit,
    page: page,
    sort: sortValue
  };

  enterpriseInternationalPublicModel.paginate("", queryOptions)
    .then(results => {
      let dbEnterprises = results.docs;

      processDirectoryResults(res, dbEnterprises, language, results.page, results.pages);
    })
    .catch(err => {
      logger.error('Error browsing enterprises ' + err);
      res.status(500).json({'message': err});
    });
}

module.exports.getAllEnterprisesPublic = function(req, res) {
  let search = req.swagger.params.q.value;
  let locationSearch = req.swagger.params.at.value;

  let limit = req.swagger.params.count.value || 25;
  let page = req.swagger.params.page.value || 1;

  let lang = getLanguage(req);

  if (locationSearch) {
    performLocationSearch(res, locationSearch, limit, page, lang);
    return;
  }

  if (!search) {
    performBrowseDirectory(res, limit, page, lang);
    return;
  }

  let queryOptions = {
    limit: limit,
    page: page
  };

  let query = {
    '$text': {
      '$search': search
    }
  };

  enterpriseInternationalPublicModel.paginate(query, queryOptions)
    .then(results => {
      let dbEnterprises = results.docs;

      processDirectoryResults(res, dbEnterprises, lang, results.page, results.pages);
    })
    .catch(err => {
      logger.error('Error finding enterprises ' + err);
      res.status(500).json({'message': err});
    });
};

function getLanguage(req) {
  let lang = DEFAULT_LANGUAGE;
  if (req.swagger.params.lang &&
      req.swagger.params.lang.value &&
      SUPPORTED_LANGUAGES.indexOf(req.swagger.params.lang.value) > -1) {
    lang = req.swagger.params.lang.value;
  }
  return lang;
}

module.exports.getOneEnterprisePublic = function(req, res) {

  let id = req.swagger.params.id.value;
  let lang = getLanguage(req);

  enterpriseInternationalPublicModel
    .findById(id)
    .then(dbEnterprise => {
      if (!dbEnterprise) {
        return Promise.reject({NotFoundError: true});
      }

      try {
        let tranformedEnterprise = enterpriseAdapter.transformDBIntlEnterpriseToApiFormatForLanguage(dbEnterprise, lang);
        res.set('Cache-Control', 'max-age=' + ENTERPRISE_CACHE_CONTROL);
        res.status(200).json(tranformedEnterprise);
      } catch (e) {
        return Promise.reject(e);
      }
    })
    .catch(err => {
      if (err.NotFoundError) {
        logger.info('Enterprise not found for id ', id);
        res.status(404).json({'message': 'Enterprise not found for id ' + id});
        return;
      }
      logger.error('Error finding enterprise', id, ':', err);
      res.status(500).json({'message': err});
    });
};

module.exports.createEnterprise = function(req, res) {
  let enterprise = req.swagger.params.Enterprise.value;
  let publicEnterprise;
  let privateEnterprise;
  try {
    publicEnterprise = enterpriseAdapter.transformCompleteEnterpriseToInternationalPublicDBFormat(enterprise);
    privateEnterprise = enterpriseAdapter.transformCompleteEnterpriseToInternationalPrivateDBFormat(enterprise);
  } catch (e) {
    res.status(500).json({'message': e});
    return;
  }

  let dbPrivateEnterpriseInfo;
  enterpriseInternationalPrivateFieldsModel.create(privateEnterprise)
    // create public enterprise info
    .then(dbPrivateEnterprise => {
      dbPrivateEnterpriseInfo = dbPrivateEnterprise;
      publicEnterprise['private_info'] = dbPrivateEnterprise['_id'];
      return enterpriseInternationalPublicModel.create(publicEnterprise);
    })
    .then( dbPublicEnterprise => {
      // update private db entry with pointer to public entry
      enterpriseInternationalPrivateFieldsModel.findByIdAndUpdate(
        dbPublicEnterprise['private_info'],
        {$set: {enterprise_id: dbPublicEnterprise['_id']}},
        function(err) {
          if (err) {
            Promise.reject(err);
          }
          // create api response
          let apiEnterprise = enterpriseAdapter.transformDbIntlEnterpriseToApiIntlFormat(dbPublicEnterprise);
          enterpriseAdapter.appendPrivateInfo(apiEnterprise, dbPrivateEnterpriseInfo);
          logger.info(`Enterprise created (name=${apiEnterprise[DEFAULT_LANGUAGE]['name']} id=${apiEnterprise['id']})`);
          res.status(201).json(apiEnterprise);
        }
      );
    })
    .catch(err => {
      logger.error('Error creating enterprise in db ', err, enterprise);
      res.status(400).json({'message': err});
    });
};


module.exports.deleteEnterprise = function(req, res) {
  let id = req.swagger.params.id.value;
  enterpriseInternationalPublicModel
    .findById(id)
    .then(dbEnterprise => {
      if (!dbEnterprise) {
        return Promise.reject({NotFoundError: true});
      }
      return Promise.resolve(dbEnterprise);
    })
    .then(dbEnterprise => {
      return enterpriseInternationalPrivateFieldsModel.remove({ _id: dbEnterprise['private_info'] });
    })
    .then(() => {
      return enterpriseLogoModel.remove({enterpriseId : id});
    })
    .then(() => {
      return enterpriseInternationalPublicModel.remove({_id : id});
    })
    .then(() => {
      res.status(200).json({});
    })
    .catch(err => {
      if (err.NotFoundError) {
        logger.info('Enterprise not found for id ', id);
        res.status(404).json({'message': 'Enterprise not found for id ' + id});
        return;
      }
      logger.error('Error deleting enterprise', id, ':', err);
      res.status(500).json({'message': err});
    });
};

module.exports.editEnterprise = function(req, res) {
  let id = req.swagger.params.id.value;
  let mergeRequest = req.swagger.params.EnterpriseMerge.value;

  enterpriseInternationalPublicModel
    .findById(id)
    .then(dbEnterprise => {
      if (!dbEnterprise) {
        return Promise.reject({NotFoundError: true});
      }
      return Promise.resolve(dbEnterprise);
    })
    .then(dbEnterprise => {
      let mergedEnterprise = enterpriseAdapter.applyMerge(dbEnterprise, mergeRequest);
      return enterpriseInternationalPublicModel.findOneAndUpdate({_id: dbEnterprise._id}, mergedEnterprise);
    })
    .then(result => {
      if (!result) {
        res.status(500).json({'message': 'Failed to update db'});
        return;
      }
      res.status(200).json({});
    })
    .catch(err => {
      if (err.NotFoundError) {
        logger.info('Enterprise not found for id ', id);
        res.status(404).json({'message': 'Enterprise not found for id ' + id});
        return;
      }
      logger.error('Error updating enterprise', id, ':', err);
      res.status(500).json({'message': err});
    });
};

module.exports.getEnterpriseAdmins = function(req, res) {
  let id = req.swagger.params.id.value;
  enterpriseInternationalPrivateFieldsModel
    .findOne({enterprise_id: id})
    .then(dbEnterprise => {
      if (!dbEnterprise) {
        return Promise.reject({NotFoundError: true});
      }
      res.status(200).json({admin_emails: dbEnterprise.admin_emails});
    })
    .catch(err => {
      if (err.NotFoundError) {
        logger.info('Enterprise admin info not found for id ', id);
        res.status(404).json({'message': 'Enterprise admin info not found for id ' + id});
        return;
      }
      logger.error('Error finding enterprise admins', id, ':', err);
      res.status(500).json({'message': err});
    });
};

module.exports.editEnterprisePrivateFields = function(req, res) {
  let id = req.swagger.params.id.value;
  let mergeRequest = req.swagger.params.EnterpriseMerge.value;

  enterpriseInternationalPrivateFieldsModel
    .findOne({enterprise_id: id})
    .then(dbEnterprise => {
      if (!dbEnterprise) {
        return Promise.reject({NotFoundError: true});
      }
      return Promise.resolve(dbEnterprise);
    })
    .then(dbEnterprise => {
      let mergedEnterprise = enterpriseAdapter.applyMerge(dbEnterprise, mergeRequest);
      return enterpriseInternationalPrivateFieldsModel.findOneAndUpdate({_id: dbEnterprise._id}, mergedEnterprise);
    })
    .then(result => {
      if (!result) {
        res.status(500).json({'message': 'Failed to update db'});
        return;
      }
      res.status(200).json({});
      return Promise.resolve(null);
    })
    .catch(err => {
      if (err.NotFoundError) {
        logger.info('Enterprise admin info not found for id ', id);
        res.status(404).json({'message': 'Enterprise admin info not found for id ' + id});
        return;
      }
      logger.error('Error updating enterprise admins', id, ':', err);
      res.status(500).json({'message': err});
    });
};

module.exports.getEnterpriseLogo = function(req, res) {
  let id = req.swagger.params.id.value;
  enterpriseLogoModel
    .findOne({enterpriseId : id})
    .then( dbLogo => {
      if (!dbLogo) {
        return Promise.reject({NotFoundError: true});
      }

      res.set('Content-Type', dbLogo.contentType);
      res.set('Cache-Control', 'max-age=' + ENTERPRISE_CACHE_CONTROL);
      res.status(200).send(dbLogo.image);
    })
    .catch( err => {
      if (err.NotFoundError) {
        logger.info('Enterprise logo not found for id ', id);
        res.status(404).json({'message': 'Enterprise logo not found for id ' + id});
        return;
      }
      logger.error('Error finding enterprise logo', id, ':', err);
      res.status(500).json({'message': err});
    });
};

function validateLogoFileType(contentType, res) {
  contentType = contentType.toLowerCase();
  if (!SUPPORTED_IMAGE_TYPES.includes(contentType)) {
    res.status(400).json({
      message: 'Specified content type is not supported. Supported values: ' +
      SUPPORTED_IMAGE_TYPES
    });
    return false;
  }
  return true;
}

module.exports.createEnterpriseLogo = function(req, res) {
  let id = req.swagger.params.id.value;
  let logoParam = req.swagger.params.logo.value;
  let contentType = logoParam.content_type;
  if (!validateLogoFileType(contentType, res)) {
    return;
  }

  let dbLogo = {
    enterpriseId: new mongoose.mongo.ObjectId(id),
    image: Buffer.from(logoParam.logo, 'base64'),
    contentType: contentType
  };

  enterpriseLogoModel
    .create(dbLogo)
    .then( () => {
      res.status(201).send({});
    })
    .catch( err => {
      logger.error('Error creating enterprise logo', id, ':', err);
      res.status(500).json({'message': err});
    });
};


module.exports.editEnterpriseLogo = function(req, res) {
  let id = req.swagger.params.id.value;
  let logoParam = req.swagger.params.logo.value;
  let contentType = logoParam.content_type;
  if (!validateLogoFileType(contentType, res)) {
    return;
  }

  let updatedLogo = {
    enterpriseId: new mongoose.mongo.ObjectId(id),
    image: Buffer.from(logoParam.logo, 'base64'),
    contentType: contentType
  };

  enterpriseLogoModel
    .find({enterpriseId : id})
    .then(dbLogo => {
      if (!dbLogo) {
        return Promise.reject({NotFoundError: true});
      }
      return Promise.resolve(dbLogo);
    })
    .then(() => {
      return enterpriseLogoModel.findOneAndUpdate({enterpriseId : id}, updatedLogo);
    })
    .then(() => {
      res.status(200).json({});
    })
    .catch(err => {
      if (err.NotFoundError) {
        logger.info('Enterprise logo not found for id ', id);
        res.status(404).json({'message': 'Enterprise logo not found for id ' + id});
        return;
      }
      logger.error('Error updating enterprise logo', id, ':', err);
      res.status(500).json({'message': err});
    });
};

module.exports.deleteEnterpriseLogo = function(req, res) {
  let id = req.swagger.params.id.value;
  enterpriseLogoModel
    .find({enterpriseId : id})
    .then(dbLogo => {
      if (!dbLogo) {
        return Promise.reject({NotFoundError: true});
      }
      return Promise.resolve(dbLogo);
    })
    .then(() => {
      return enterpriseLogoModel.remove({enterpriseId : id});
    })
    .then(() => {
      res.status(200).json({});
    })
    .catch(err => {
      if (err.NotFoundError) {
        logger.info('Enterprise logo not found for id ', id);
        res.status(404).json({'message': 'Enterprise logo not found for id ' + id});
        return;
      }
      logger.error('Error deleting enterprise logo', id, ':', err);
      res.status(500).json({'message': err});
    });
};
