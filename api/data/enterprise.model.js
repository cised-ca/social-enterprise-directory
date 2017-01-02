const logger = require('../../lib/logger');
const mongoose = require('mongoose');

let enterprisePrivateFieldsSchema = new mongoose.Schema({
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

let enterprisePublicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lowercase_name: { type: String, required: true },
  short_description: String,
  description: String,
  offering: String,
  purposes: [String],
  year_started: Number,
  website: String,
  facebook: String,
  instagram: String,
  twitter: String,
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

// Create index for sorting by name
enterprisePublicSchema.index({lowercase_name: 1});

// Create text index for searching enterprise by keyword
enterprisePublicSchema.index(
  {
    name: 'text',
    website: 'text',
    facebook: 'text',
    instagram: 'text',
    twitter: 'text',
    offering: 'text',
    short_description: 'text',
    description: 'text',
    purposes: 'text'
  },
  {
    name: 'Weighted text index',
    weights: {
      name: 20,
      website: 20,
      facebook: 20,
      instagram: 20,
      twitter: 20,
      short_description: 15,
      offering: 10,
      description: 5,
      purposes: 3
    }
  }
);

let enterpriseLogoSchema = new mongoose.Schema({
  enterpriseId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  image: {type: Buffer, required: true},
  contentType: {type: String, required: true}
});

let EnterprisePublicModel = mongoose.model('EnterprisePublic', enterprisePublicSchema, 'enterprises');
let EnterprisePrivateModel = mongoose.model('EnterprisePrivateFields', enterprisePrivateFieldsSchema, 'enterprisePrivateFields');
let EnterpriseLogoModel = mongoose.model('EnterpriseLogo', enterpriseLogoSchema, 'enterpriseLogos');

EnterprisePublicModel.on('index', function(err) {
  if (err) {
    logger.error('Error building indexes on Enterprise Public Model: ' + err);
  } else {
    logger.info('Built index on Enterprise Public Model');
  }
});

EnterprisePrivateModel.on('index', function(err) {
  if (err) {
    logger.error('Error building indexes on Enterprise Private Model: ' + err);
  } else {
    logger.info('Built index on Enterprise Private Model');
  }
});

EnterpriseLogoModel.on('index', function(err) {
  if (err) {
    logger.error('Error building indexes on Enterprise Logo Model: ' + err);
  } else {
    logger.info('Built index on Enterprise Logo Model');
  }
});

module.exports.enterprisePublicFields = Object.keys(enterprisePublicSchema.paths);
module.exports.enterprisePrivateFields = Object.keys(enterprisePrivateFieldsSchema.paths);
