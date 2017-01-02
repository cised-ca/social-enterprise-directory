const should = require('should');
const testEnterprise1_public = require('../../helpers/data/enterprise/testEnterprise1_public');
const testEnterprise1_complete = require('../../helpers/data/enterprise/testEnterprise1_complete');
const testEnterprise2_public = require('../../helpers/data/enterprise/testEnterprise2_public');
const testEnterprise2_complete = require('../../helpers/data/enterprise/testEnterprise2_complete');
const testEnterprise3_public = require('../../helpers/data/enterprise/testEnterprise3_public');
const testEnterprise3_complete = require('../../helpers/data/enterprise/testEnterprise3_complete');

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

let verifyArrayContainsEnterprise1 = function(enterpriseArray) {
  let foundEnterprise = findEnterpriseInArrayOrFail(enterpriseArray, testEnterprise1_complete['name']);
  verifyEnterprise1Public(foundEnterprise);
};

let verifyArrayContainsEnterprise2 = function(enterpriseArray) {
  let foundEnterprise = findEnterpriseInArrayOrFail(enterpriseArray, testEnterprise2_complete['name']);
  verifyEnterprise2Public(foundEnterprise);
};

let verifyArrayContainsEnterprise3 = function(enterpriseArray) {
  let foundEnterprise = findEnterpriseInArrayOrFail(enterpriseArray, testEnterprise3_complete['name']);
  verifyEnterprise3Public(foundEnterprise);
};

let verifyEnterprise1 = function(enterprise) {
  verifyEnterprise(testEnterprise1_complete, enterprise);
};
let verifyEnterprise1Public = function(enterprise) {
  verifyEnterprisePublic(testEnterprise1_public, enterprise);
};

let verifyEnterprise2 = function(enterprise) {
  verifyEnterprise(testEnterprise2_complete, enterprise);
};
let verifyEnterprise2Public = function(enterprise) {
  verifyEnterprisePublic(testEnterprise2_public, enterprise);
};

let verifyEnterprise3 = function(enterprise) {
  verifyEnterprise(testEnterprise3_complete, enterprise);
};
let verifyEnterprise3Public = function(enterprise) {
  verifyEnterprisePublic(testEnterprise3_public, enterprise);
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

  expected.should.eql(actual);
}

module.exports = {
  verifyArrayContainsEnterprise1 : verifyArrayContainsEnterprise1,
  verifyArrayContainsEnterprise2 : verifyArrayContainsEnterprise2,
  verifyArrayContainsEnterprise3 : verifyArrayContainsEnterprise3,
  verifyEnterprise1 : verifyEnterprise1,
  verifyEnterprise1Public : verifyEnterprise1Public,
  verifyEnterprise2 : verifyEnterprise2,
  verifyEnterprise2Public : verifyEnterprise2Public,
  verifyEnterprise3 : verifyEnterprise3,
  verifyEnterprise3Public : verifyEnterprise3Public
};
