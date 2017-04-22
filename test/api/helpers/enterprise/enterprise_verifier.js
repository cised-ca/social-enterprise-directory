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

const enterpriseFields = [
  'name',
  'description',
  'logo',
  'offering',
  'purposes',
  'website',
  'emails',
  'phones',
  'faxes',
  'addresses',
  'locations',
  'clusters',
  'segments',
  'parent_organization',
  'contact_person',
  'annual_revenue_range',
  'stage_of_development'
];

const enterprisePublicFields = [
  'name',
  'description',
  'logo',
  'offering',
  'purposes',
  'website',
  'emails',
  'phones',
  'faxes',
  'addresses',
  'locations'
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

let verifyArrayDoesNotContainEnterprise1 = function(enterpriseArray) {
  failIfArrayContainsEnterprise(enterpriseArray, testEnterprise1_complete[DEFAULT_LANGUAGE]['name']);
};
let verifyArrayDoesNotContainEnterprise2 = function(enterpriseArray) {
  failIfArrayContainsEnterprise(enterpriseArray, testEnterprise2_complete[DEFAULT_LANGUAGE]['name']);
};
let verifyArrayDoesNotContainEnterprise3 = function(enterpriseArray) {
  failIfArrayContainsEnterprise(enterpriseArray, testEnterprise3_complete[DEFAULT_LANGUAGE]['name']);
};

let verifyArrayContainsEnterprise1 = function(enterpriseArray) {
  let foundEnterprise = findEnterpriseInArrayOrFail(enterpriseArray, testEnterprise1_complete[DEFAULT_LANGUAGE]['name']);
  verifyEnterprise1Public(foundEnterprise);
};

let verifyArrayContainsEnterprise2 = function(enterpriseArray) {
  let foundEnterprise = findEnterpriseInArrayOrFail(enterpriseArray, testEnterprise2_complete[DEFAULT_LANGUAGE]['name']);
  verifyEnterprise2Public(foundEnterprise);
};

let verifyArrayContainsEnterprise3 = function(enterpriseArray) {
  let foundEnterprise = findEnterpriseInArrayOrFail(enterpriseArray, testEnterprise3_complete[DEFAULT_LANGUAGE]['name']);
  verifyEnterprise3Public(foundEnterprise);
};

let verifyEnterprise1 = function(enterprise) {
  verifyEnterprise(testEnterprise1_complete, enterprise);
};
let verifyEnterprise1Public = function(enterprise, language) {
  let expected = testEnterprise1_public_en;
  if (language === 'fr') {
    expected = testEnterprise1_public_fr;
  }
  verifyEnterprisePublic(expected, enterprise);
};

let verifyEnterprise2 = function(enterprise) {
  verifyEnterprise(testEnterprise2_complete, enterprise);
};
let verifyEnterprise2Public = function(enterprise, language) {
  let expected = testEnterprise2_public_en;
  if (language === 'fr') {
    expected = testEnterprise2_public_fr;
  }
  verifyEnterprisePublic(expected, enterprise);
};

let verifyEnterprise3 = function(enterprise) {
  verifyEnterprise(testEnterprise3_complete, enterprise);
};
let verifyEnterprise3Public = function(enterprise, language) {
  let expected = testEnterprise3_public_en;
  if (language === 'fr') {
    expected = testEnterprise3_public_fr;
  }
  verifyEnterprisePublic(expected, enterprise);
};

function verifyEnterprise(expectedEnterprise, actualEnterprise) {
  actualEnterprise['id'].should.not.be.undefined;
  enterpriseFields.forEach(function(currentItem) {
    if (areUndefinedValuesPresentAndEquivalent(expectedEnterprise[currentItem], actualEnterprise[currentItem])) {
      return;
    }
    actualEnterprise[currentItem].should.eql(expectedEnterprise[currentItem], 'Failed on ' + currentItem);
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

function undefinedValuesPresent(expected, actual) {
  return expected == null || actual == null;
}

function areUndefinedValuesPresentAndEquivalent(expected, actual) {
  if (!undefinedValuesPresent(expected, actual)) { return false; }
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
