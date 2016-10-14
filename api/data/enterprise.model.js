var winston = require('winston');
var mongoose = require('mongoose');

var enterprisePrivateFieldsSchema = new mongoose.Schema({
  clusters: [String],
  segments: [String],
  parent_organization: String,
  contact_person: [String],
  annual_revenue_range: String,
  stage_of_development: String,
  emails: [{
    _id:false,
    email: {type: String, required: true},
    tags: [String],
    public: Boolean
  }],
  phones: [{
    _id:false,
    number: {type: String, required: true},
    tags: [String],
    public: Boolean
  }],
  faxes: [{
    _id:false,
    fax: {type: String, required: true},
    tags: [String],
    public: Boolean
  }],
  addresses: [{
    _id:false,
    address: {type: String, required: true},
    tags: [String],
    public: Boolean
  }]
});

var enterprisePublicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: String,
  description: String,
  offering: String,
  purposes: [String],
  website: String,
  emails: [{
    _id:false,
    email: {type: String, required: true},
    tags: [String],
    public: Boolean
  }],
  phones: [{
    _id:false,
    number: {type: String, required: true},
    tags: [String],
    public: Boolean
  }],
  faxes: [{
    _id:false,
    fax: {type: String, required: true},
    tags: [String],
    public: Boolean
  }],
  addresses: [{
    _id:false,
    address: {type: String, required: true},
    tags: [String],
    public: Boolean
  }],
  locations: [[Number]],
  private_info: mongoose.Schema.Types.ObjectId
});

// Create text index for searching enterprise by keyword
enterprisePublicSchema.index(
  {
    name: 'text',
    description: 'text',
    offering: 'text',
    purposes: 'text'
  },
  {
    name: 'Weighted text index',
    weights: {
      name: 20,
      description: 5,
      offering: 5,
      purposes: 3
    }
  }
);

var EnterprisePublicModel = mongoose.model('EnterprisePublic', enterprisePublicSchema, 'enterprises');
var EnterprisePrivateModel = mongoose.model('EnterprisePrivateFields', enterprisePrivateFieldsSchema, 'enterprisePrivateFields');

EnterprisePublicModel.on('index', function(err) {
  if (err) {
    winston.error('Error building indexes on Enterprise Public Model: ' + err);
  } else {
    winston.info('Built index on Enterprise Public Model');
  }
});

EnterprisePrivateModel.on('index', function(err) {
  if (err) {
    winston.error('Error building indexes on Enterprise Private Model: ' + err);
  } else {
    winston.info('Built index on Enterprise Private Model');
  }
});

module.exports.enterprisePublicFields = Object.keys(enterprisePublicSchema.paths);
module.exports.enterprisePrivateFields = Object.keys(enterprisePrivateFieldsSchema.paths);
