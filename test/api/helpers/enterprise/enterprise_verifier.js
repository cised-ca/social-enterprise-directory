var should = require('should');
var testEnterprise1_public = require('../../helpers/data/enterprise/testEnterprise1_public');
var testEnterprise1_complete = require('../../helpers/data/enterprise/testEnterprise1_complete');
var testEnterprise2_public = require('../../helpers/data/enterprise/testEnterprise2_public');
var testEnterprise2_complete = require('../../helpers/data/enterprise/testEnterprise2_complete');
var testEnterprise3_public = require('../../helpers/data/enterprise/testEnterprise3_public');
var testEnterprise3_complete = require('../../helpers/data/enterprise/testEnterprise3_complete');

var enterpriseFields = [
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

var enterprisePublicFields = [
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
  var foundEnterprise = array.filter(enterpriseNameMatches(name))[0];
  if (!foundEnterprise) {
    should.fail('Did not find expected enterprise in array having name ' + name);
  }
  return foundEnterprise;
}

var verifyArrayContainsEnterprise1 = function(enterpriseArray) {
  var foundEnterprise = findEnterpriseInArrayOrFail(enterpriseArray, testEnterprise1_complete['name']);
  verifyEnterprise1Public(foundEnterprise);
};

var verifyArrayContainsEnterprise2 = function(enterpriseArray) {
  var foundEnterprise = findEnterpriseInArrayOrFail(enterpriseArray, testEnterprise2_complete['name']);
  verifyEnterprise2Public(foundEnterprise);
};

var verifyArrayContainsEnterprise3 = function(enterpriseArray) {
  var foundEnterprise = findEnterpriseInArrayOrFail(enterpriseArray, testEnterprise3_complete['name']);
  verifyEnterprise3Public(foundEnterprise);
};

var verifyEnterprise1 = function(enterprise) {
  verifyEnterprise(testEnterprise1_complete, enterprise);
};
var verifyEnterprise1Public = function(enterprise) {
  verifyEnterprisePublic(testEnterprise1_public, enterprise);
};

var verifyEnterprise2 = function(enterprise) {
  verifyEnterprise(testEnterprise2_complete, enterprise);
};
var verifyEnterprise2Public = function(enterprise) {
  verifyEnterprisePublic(testEnterprise2_public, enterprise);
};

var verifyEnterprise3 = function(enterprise) {
  verifyEnterprise(testEnterprise3_complete, enterprise);
};
var verifyEnterprise3Public = function(enterprise) {
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
