var testEnterprise1 = require('../../helpers/data/enterprise/testEnterprise1');

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

module.exports.verifyEnterprise1 = function(enterprise) {
  verifyEnterprise(testEnterprise1, enterprise);
};
module.exports.verifyEnterprise1Public = function(enterprise) {
  verifyEnterprisePublic(testEnterprise1, enterprise);
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
    var expected = filterOutPrivateInfo(expectedEnterprise, currentItem);
    if (areUndefinedValuesPresentAndEquivalent(expected, actualEnterprise[currentItem])) {
      return;
    }
    actualEnterprise[currentItem].should.eql(expected, 'Failed on ' + currentItem);
  });
}

function filterOutPrivateInfo(enterprise, field) {
  if (!enterprise[field]) {
    return enterprise[field];
  }

  if (field === 'phones' ||
      field === 'faxes' ||
      field === 'addresses' ||
      field === 'emails') {
    var publicValue = enterprise[field].slice(0);
    filterPrivateEntriesForArray(publicValue);
    return publicValue;
  }

  return enterprise[field];
}

function filterPrivateEntriesForArray(array) {
  var i = array.length;
  while(i--) {
    if (array[i].public) {
      continue;
    }
    array.splice(i,1);
  }
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
