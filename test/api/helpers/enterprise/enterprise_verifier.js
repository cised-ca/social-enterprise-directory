const should = require('should');
const logger = require('../../../../lib/logger');
const testEnterprise1_public_en = require('../../helpers/data/enterprise/testEnterprise1_public_en');
const testEnterprise1_public_fr = require('../../helpers/data/enterprise/testEnterprise1_public_fr');
const testEnterprise1_complete = require('../../helpers/data/enterprise/testEnterprise1_complete');
const testEnterprise2_public_en = require('../../helpers/data/enterprise/testEnterprise2_public_en');
const testEnterprise2_public_fr = require('../../helpers/data/enterprise/testEnterprise2_public_fr');
const testEnterprise2_complete = require('../../helpers/data/enterprise/testEnterprise2_complete');
const testEnterprise3_public_en = require('../../helpers/data/enterprise/testEnterprise3_public_en');
const testEnterprise3_public_fr = require('../../helpers/data/enterprise/testEnterprise3_public_fr');
const testEnterprise3_complete = require('../../helpers/data/enterprise/testEnterprise3_complete');

const DEFAULT_LANGUAGE = require('../../helpers/language/language_test_constants').DEFAULT_LANGUAGE;
const FRENCH = require('../../helpers/language/language_test_constants').FRENCH;
const ENGLISH = require('../../helpers/language/language_test_constants').ENGLISH;

const internationalEnterpriseFields = [
  'admin_emails',
  'locations',
  'en',
  'fr'
];


const enterpriseFields = [
  'name',
  'short_description',
  'description',
  'logo',
  'offering',
  'purposes',
  'year_started',
  'website',
  'facebook',
  'instagram',
  'twitter',
  'emails',
  'phones',
  'faxes',
  'addresses',
  'clusters',
  'segments',
  'parent_organization',
  'contact_person',
  'annual_revenue_range',
  'stage_of_development'
];

const enterprisePublicFields = [
  'name',
  'short_description',
  'description',
  'logo',
  'offering',
  'purposes',
  'year_started',
  'website',
  'facebook',
  'instagram',
  'twitter',
  'emails',
  'phones',
  'faxes',
  'addresses'
];

function enterpriseNameMatches(nameToMatch) {
  return function(enterprise) {
    if (enterprise['name'] === nameToMatch) {
      return true;
    }
  };
}

function findEnterpriseInArrayOrFail(array, name) {
  let foundEnterprise = array.filter(enterpriseNameMatches(name))[0];
  if (!foundEnterprise) {
    should.fail('Did not find expected enterprise in array having name ' + name);
  }
  return foundEnterprise;
}

function failIfArrayContainsEnterprise(enterpriseArray, name) {
  let foundEnterprise = enterpriseArray.filter(enterpriseNameMatches(name))[0];
  if (foundEnterprise) {
    should.fail('Found unexpected enterprise with name ' + name);
  }
}

const verifyArrayDoesNotContainEnterprise1 = function(enterpriseArray) {
  failIfArrayContainsEnterprise(enterpriseArray, testEnterprise1_complete[DEFAULT_LANGUAGE]['name']);
};
const verifyArrayDoesNotContainEnterprise2 = function(enterpriseArray) {
  failIfArrayContainsEnterprise(enterpriseArray, testEnterprise2_complete[DEFAULT_LANGUAGE]['name']);
};
const verifyArrayDoesNotContainEnterprise3 = function(enterpriseArray) {
  failIfArrayContainsEnterprise(enterpriseArray, testEnterprise3_complete[DEFAULT_LANGUAGE]['name']);
};

const verifyArrayContainsEnterprise1 = function(enterpriseArray) {
  let foundEnterprise = findEnterpriseInArrayOrFail(enterpriseArray, testEnterprise1_complete[DEFAULT_LANGUAGE]['name']);
  verifyEnterprise1Public(foundEnterprise);
};

const verifyArrayContainsEnterprise2 = function(enterpriseArray) {
  let foundEnterprise = findEnterpriseInArrayOrFail(enterpriseArray, testEnterprise2_complete[DEFAULT_LANGUAGE]['name']);
  verifyEnterprise2Public(foundEnterprise);
};

const verifyArrayContainsEnterprise3 = function(enterpriseArray) {
  let foundEnterprise = findEnterpriseInArrayOrFail(enterpriseArray, testEnterprise3_complete[DEFAULT_LANGUAGE]['name']);
  verifyEnterprise3Public(foundEnterprise);
};

const verifyEnterprise1 = function(enterprise) {
  verifyInternationalEnterpriseComplete(testEnterprise1_complete, enterprise);
};

const verifyEnterprise1Public = function(enterprise, language) {
  let expected = testEnterprise1_public_en;
  if (language === FRENCH) {
    expected = testEnterprise1_public_fr;
  }
  verifyEnterprisePublic(expected, enterprise);
};

const verifyEnterprise2 = function(enterprise) {
  verifyInternationalEnterpriseComplete(testEnterprise2_complete, enterprise);
};
const verifyEnterprise2Public = function(enterprise, language) {
  let expected = testEnterprise2_public_en;
  if (language === FRENCH) {
    expected = testEnterprise2_public_fr;
  }
  verifyEnterprisePublic(expected, enterprise);
};

const verifyEnterprise3 = function(enterprise) {
  verifyInternationalEnterpriseComplete(testEnterprise3_complete, enterprise);
};
const verifyEnterprise3Public = function(enterprise, language) {
  let expected = testEnterprise3_public_en;
  if (language === FRENCH) {
    expected = testEnterprise3_public_fr;
  }
  verifyEnterprisePublic(expected, enterprise);
};

function verifyInternationalEnterpriseComplete(expectedEnterprise, actualEnterprise) {
  actualEnterprise['id'].should.not.be.undefined;
  internationalEnterpriseFields.forEach(currentItem => {
    if (areUndefinedValuesPresentAndEquivalent(expectedEnterprise[currentItem], actualEnterprise[currentItem])) {
      return;
    }
    if (currentItem == ENGLISH || currentItem == FRENCH) {
      enterpriseFields.forEach(subField => {
        if (areUndefinedValuesPresentAndEquivalent(expectedEnterprise[currentItem][subField],
                                            actualEnterprise[currentItem][subField])) {
          return;
        }
        actualEnterprise[currentItem][subField].should.eql(expectedEnterprise[currentItem][subField],
          'Failed on [' + currentItem + '][' + subField + ']');
      });
    } else {
      actualEnterprise[currentItem].should.eql(expectedEnterprise[currentItem], 'Failed on ' + currentItem);
    }
  });
}

function verifyEnterprisePublic(expectedEnterprise, actualEnterprise) {
  actualEnterprise['id'].should.not.be.undefined;
  enterprisePublicFields.forEach(function(currentItem) {
    if (areUndefinedValuesPresentAndEquivalent(expectedEnterprise[currentItem], actualEnterprise[currentItem])) {
      return;
    }
    actualEnterprise[currentItem].should.eql(expectedEnterprise[currentItem], 'Failed on ' + currentItem);
  });
}

function undefinedValuesArePresent(expected, actual) {
  return expected == null || actual == null;
}

function areUndefinedValuesPresentAndEquivalent(expected, actual) {
  if (!undefinedValuesArePresent(expected, actual)) { return false; }
  if (expected == actual) { return true; }

  if (expected == null) {
    if (actual instanceof Array && !actual.length ) { return true; }
  }

  if (actual == null) {
    if (expected instanceof Array && !expected.length ) { return true; }
  }

  if (expected == null && actual != null) {
    logger.error('Unexpected value');
    logger.error(actual);
    should.fail('Unexpected value');
  }

  expected.should.eql(actual);
}

module.exports = {
  verifyEnterprisePublic : verifyEnterprisePublic,
  verifyArrayContainsEnterprise1 : verifyArrayContainsEnterprise1,
  verifyArrayContainsEnterprise2 : verifyArrayContainsEnterprise2,
  verifyArrayContainsEnterprise3 : verifyArrayContainsEnterprise3,
  verifyArrayDoesNotContainEnterprise1: verifyArrayDoesNotContainEnterprise1,
  verifyArrayDoesNotContainEnterprise2: verifyArrayDoesNotContainEnterprise2,
  verifyArrayDoesNotContainEnterprise3: verifyArrayDoesNotContainEnterprise3,
  verifyEnterprise1 : verifyEnterprise1,
  verifyEnterprise1Public : verifyEnterprise1Public,
  verifyEnterprise2 : verifyEnterprise2,
  verifyEnterprise2Public : verifyEnterprise2Public,
  verifyEnterprise3 : verifyEnterprise3,
  verifyEnterprise3Public : verifyEnterprise3Public
};
