const publicFields = require('../data/enterprise.model').enterprisePublicFields;
const privateFields = require('../data/enterprise.model').enterprisePrivateFields;
const internationalPrivateFields = require('../data/enterprise.model').internationalEnterprisePrivateFields;
const SUPPORTED_LANGUAGES = require('../helpers/language/constants').SUPPORTED_LANGUAGES;
const jsonMergePatch = require('json8-merge-patch');

function transformDbEnterprisesToApiFormat(dbEnterprise) {

  // clone the object
  let apiEnterprise = JSON.parse(JSON.stringify(dbEnterprise));

  delete apiEnterprise.lowercase_name;

  // if there was a "score" field due to text index lookup, remove it
  delete apiEnterprise.score;

  // if there was a "distance" field due to location index lookup, remove it
  delete apiEnterprise.dis;

  return apiEnterprise;
}

function copyLocations(source, dest) {
  if (source['locations']) {
    dest['locations'] = source['locations'];
  }
}

function copyAdminEmails(source, dest) {
  if (source['admin_emails']) {
    dest['admin_emails'] = source['admin_emails'];
  }
}

function transformDbEnterpriseToApiFormatForLanguage(dbInternationalEnterprise, language) {
  let apiEnterprise = {};

  if (dbInternationalEnterprise[language]) {
    let enterpriseFields = transformDbEnterprisesToApiFormat(dbInternationalEnterprise[language]);
    apiEnterprise = enterpriseFields;
  }

  apiEnterprise['id'] = dbInternationalEnterprise._id.toString();
  copyLocations(dbInternationalEnterprise, apiEnterprise);

  return apiEnterprise;
}

module.exports.transformDBIntlEnterpriseToApiFormatForLanguage = function(dbInternationalEnterprise, language) {
  return transformDbEnterpriseToApiFormatForLanguage(dbInternationalEnterprise, language);
};

module.exports.transformDbEnterprisesToApiFormatForLanguage = function(dbInternationalEnterprises, language) {
  let apiEnterprises = [];
  dbInternationalEnterprises.forEach(
    function(dbInternationalEnterprise) {
      apiEnterprises.push(transformDbEnterpriseToApiFormatForLanguage(dbInternationalEnterprise, language));
    }
  );
  return apiEnterprises;
};

module.exports.transformDbEnterprisesToApiFormat = function(dbEnterprises) {
  let enterprises = [];
  dbEnterprises.forEach(
      function(currentItem) {
        enterprises.push(transformDbEnterprisesToApiFormat(currentItem));
      }
  );
  return enterprises;
};

module.exports.transformDbIntlEnterpriseToApiIntlFormat = function(dbEnterprise) {
  let apiInternationalEnterprise = {};

  apiInternationalEnterprise['id'] = dbEnterprise._id.toString();
  copyLocations(dbEnterprise, apiInternationalEnterprise);
  copyAdminEmails(dbEnterprise, apiInternationalEnterprise);

  SUPPORTED_LANGUAGES.forEach( function(language) {
    if (dbEnterprise[language]) {
      let apiEnterprise = transformDbEnterprisesToApiFormat(dbEnterprise[language]);
      apiInternationalEnterprise[language] = apiEnterprise;
    }
  });
  return apiInternationalEnterprise;
};

// Throws exception on error.
module.exports.transformCompleteEnterpriseToInternationalPublicDBFormat = function(enterprise) {
  let dbInternationalPublicEnterprise = {};
  copyLocations(enterprise, dbInternationalPublicEnterprise);

  SUPPORTED_LANGUAGES.forEach( function(language) {
    if (enterprise[language]) {
      let dbEnterprise = transformCompleteEnterpriseToPublicDBFormat(enterprise[language]);
      dbInternationalPublicEnterprise[language] = dbEnterprise;
    }
  });

  return dbInternationalPublicEnterprise;
};

function transformCompleteEnterpriseToPublicDBFormat(enterprise) {
  let dbPublicEnterprise = {};
  publicFields.forEach( function(field) {
    if (enterprise[field]) {
      dbPublicEnterprise[field] = JSON.parse(JSON.stringify(enterprise[field]));
    }
  });

  // create lower case name field
  dbPublicEnterprise.lowercase_name = dbPublicEnterprise.name.toLowerCase();

  // remove private fields
  ['emails', 'phones', 'faxes', 'addresses'].forEach(field => {
    if (dbPublicEnterprise[field]) {
      dbPublicEnterprise[field] = dbPublicEnterprise[field].filter(value => 'public' in value && value.public);
    }
  });

  return dbPublicEnterprise;
}

// Throws exception on error.
module.exports.transformCompleteEnterpriseToInternationalPrivateDBFormat = function(enterprise) {
  let dbInternationalPrivateEnterprise = {};
  if (enterprise['admin_emails']) {
    dbInternationalPrivateEnterprise['admin_emails'] = enterprise['admin_emails'];
  }

  SUPPORTED_LANGUAGES.forEach( function(language) {
    if (enterprise[language]) {
      let dbPrivateEnterprise = transformCompleteEnterpriseToPrivateDBFormat(enterprise[language]);
      dbInternationalPrivateEnterprise[language] = dbPrivateEnterprise;
    }
  });

  return dbInternationalPrivateEnterprise;
};

function transformCompleteEnterpriseToPrivateDBFormat(enterprise) {

  let dbPrivateEnterprise = {};
  privateFields.forEach( field => {
    if (enterprise[field]) {
      dbPrivateEnterprise[field] = JSON.parse(JSON.stringify(enterprise[field]));
    }
  });

  // remove public fields
  ['emails', 'phones', 'faxes', 'addresses'].forEach(field => {
    if (dbPrivateEnterprise[field]) {
      dbPrivateEnterprise[field] = dbPrivateEnterprise[field].filter(value => 'public' in value && !value.public);
    }
  });

  return dbPrivateEnterprise;
}

module.exports.applyMerge = function(dbEnterprise, mergeRequest) {
  let mergedEnterprise = jsonMergePatch.apply(dbEnterprise, mergeRequest);
  return mergedEnterprise;
};


module.exports.mergePublicAndPrivateDBInfo = function(
                    dbPublicInternationalEnterprise,
                    dbPrivateInternationalEnterprise) {
  let clone = JSON.parse(JSON.stringify(dbPublicInternationalEnterprise));

  internationalPrivateFields.forEach(field => {
    if (SUPPORTED_LANGUAGES.includes(field)) {
      return;
    }
    if (dbPrivateInternationalEnterprise[field] == null) {
      return;
    }
    clone[field] = dbPrivateInternationalEnterprise[field];
  });

  SUPPORTED_LANGUAGES.forEach(lang => {
    privateFields.forEach(field => {
      let value = dbPrivateInternationalEnterprise[lang][field];
      if (value == null) {
        return;
      }
      if (clone[lang][field]) {
        clone[lang][field] = clone[lang][field].concat(value);
      } else {
        clone[lang][field] = value;
      }
    });
  });

  return clone;
};
