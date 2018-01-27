'use strict';

const elasticlunr = require('elasticlunr');
const languages = require('../api/helpers/language/constants').SUPPORTED_LANGUAGES;

// If there are more than 1 supported languages, or only one and it isn't
// English, we'll need stemmer support.
if (languages.length > 1 || languages[0] !== 'en') {
  require('lunr-languages/lunr.stemmer.support')(elasticlunr);
}

const mongoose = require('mongoose');
const enterpriseInternationalPublicModel = mongoose.model('EnterpriseInternationalPublic');
const logger = require('./logger');

let lunr = function() {};

lunr.prototype.indexes = [];

// Searchable fields and their weights/boost
const fieldsBoost = {
  'fields': {
    'name': {boost: 20},
    'website': {boost: 20},
    'facebook': {boost: 20},
    'instagram': {boost: 20},
    'twitter': {boost: 20},
    'offering': {boost: 15},
    'short_description': {boost: 15},
    'description': {boost: 5},
    'purposes': {boost: 3}
  }
};

// Searchable fields
const fields = Object.keys(fieldsBoost.fields);

/**
 * Transforms a database-formatted object into a lunr-formatted object
 *
 * @param {Object} enterprise
 * @param {String} language
 *
 * @return {Object} lunr-formatted
 */
function transformEnterprise(enterprise, language) {
  let transformed = {};

  transformed.id = enterprise._id;

  fields.forEach(field => {
    transformed[field] = enterprise[language][field];
  });

  return transformed;
}

/**
 * Initialize the index
 *
 * @return {Promise}
 */
lunr.prototype.init = function() {
  logger.info('Initializing lunr search...');

  // Build fields
  languages.forEach(language => {
    this.indexes[language] = elasticlunr(function() {
      if (language !== 'en') { // English is the default built-in
        require('lunr-languages/lunr.' + language)(elasticlunr);
        this.use(elasticlunr[language]);
      }

      fields.forEach(field => this.addField(field));
    });
  });

  // Add enterprises
  return new Promise((resolve, reject) => {
    enterpriseInternationalPublicModel.find({})
      .then(enterprises => {
        enterprises.forEach(enterprise => this.add(enterprise));

        logger.info('lunr search initialized');
        resolve(this);
      })
      .catch(err => {
        logger.error('Error initializing lunr search: ' + err);
        reject('Error initializing lunr search: ' + err);
      });
  });
};

/**
 * Update an enterprise's information in the indexes
 *
 * @param {String} id The 'id' of the enterprise we want to update
 * @param {Object} enterprise The updated enterprise object
 */
lunr.prototype.update = function(id, enterprise) {
  this.remove(id);
  this.add(enterprise);
};

/**
 * Remove an enterprise from the indexes
 *
 * @param {String} id The 'id' of the enterprise we want to remove
 */
lunr.prototype.remove = function(id) {
  languages.forEach(language => {
    this.indexes[language].removeDocByRef(id);
  });
};

/**
 * Add a new enterprise to the indexes
 *
 * @param {Object} enterprise A database-format enterprise object
 */
lunr.prototype.add = function(enterprise) {
  languages.forEach(language => {
    if (enterprise[language]) {
      this.indexes[language].addDoc(transformEnterprise(enterprise, language));
    }
  });
};

/**
 * Search the elasticlunr index
 *
 * @param {String} query The search query performed by the user
 * @param {String} language The language of the collection we're searching
 *
 * @return {Array} Enterprise ids which can be fed into mongo's search:
 *   db.find({'_id': {'$in': ids}})
 */
lunr.prototype.search = function(query, language) {
  let searchOptions = {
    fieldsBoost,
    expand: true // Expand query to match longer words ('micro' will match 'microscope')
  };

  let index = this.indexes[language];
  let results = index.search(query, searchOptions);
  let resultIds = [];

  results.forEach(result => resultIds.push(index.documentStore.getDoc(result.ref).id));

  return resultIds;
};

module.exports = new lunr();
