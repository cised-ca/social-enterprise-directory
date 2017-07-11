const logger = require('../../lib/logger');
const mongoose = require('mongoose');
const SUPPORTED_LANGUAGES = require('../helpers/language/constants').SUPPORTED_LANGUAGES;
const mongoosePaginate = require('mongoose-paginate');
const mongoosePaginateAggregate = require('mongoose-aggregate-paginate');

let directoryAdministratorsSchema = new mongoose.Schema({
  email: String
});

directoryAdministratorsSchema.index({email: 1});

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
}, {_id: false});

let internationalPrivateFields = {
  enterprise_id: mongoose.Schema.Types.ObjectId,
  admin_emails: [String]
};
SUPPORTED_LANGUAGES.forEach(lang => {
  internationalPrivateFields[lang] = { type: enterprisePrivateFieldsSchema, _id: false };
});
let enterpriseInternationalPrivateFieldsSchema = new mongoose.Schema(internationalPrivateFields);

enterpriseInternationalPrivateFieldsSchema.index({admin_emails: 1});

let locationSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'MultiPoint'
  },
  coordinates: [[Number]]
}, { _id : false });

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
  }]
}, { _id : false });

enterprisePublicSchema.plugin(mongoosePaginate);
enterprisePublicSchema.plugin(mongoosePaginateAggregate);

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

let internationalFields = {
  locations: { type: locationSchema, _id : false },
  private_info: mongoose.Schema.Types.ObjectId
};
SUPPORTED_LANGUAGES.forEach(lang => {
  internationalFields[lang] = { type: enterprisePublicSchema, _id: false };
});
let enterpriseInternationalPublicSchema = new mongoose.Schema(internationalFields);

enterpriseInternationalPublicSchema.plugin(mongoosePaginate);
enterpriseInternationalPublicSchema.plugin(mongoosePaginateAggregate);

enterpriseInternationalPublicSchema.index({ locations : '2dsphere' });

let enterpriseLogoSchema = new mongoose.Schema({
  enterpriseId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  image: {type: Buffer, required: true},
  contentType: {type: String, required: true}
});

let DirectoryAdministratorsModel = mongoose.model('DirectoryAdministrators', directoryAdministratorsSchema, 'directoryAdministrators');
let EnterpriseInternationalPublicModel = mongoose.model('EnterpriseInternationalPublic', enterpriseInternationalPublicSchema, 'enterprises');
let EnterpriseInternationalPrivateModel = mongoose.model('EnterpriseInternationalPrivateFields', enterpriseInternationalPrivateFieldsSchema, 'enterprisePrivateFields');
let EnterpriseLogoModel = mongoose.model('EnterpriseLogo', enterpriseLogoSchema, 'enterpriseLogos');
let PendingEnterpriseInternationalPublicModel = mongoose.model('PendingEnterpriseInternationalPublic', enterpriseInternationalPublicSchema, 'pendingEnterprises');
let PendingEnterpriseInternationalPrivateModel = mongoose.model('PendingEnterpriseInternationalPrivateFields', enterpriseInternationalPrivateFieldsSchema, 'pendingEnterprisePrivateFields');
let UnpublishedEnterpriseInternationalPublicModel = mongoose.model('UnpublishedEnterpriseInternationalPublic', enterpriseInternationalPublicSchema, 'unpublishedEnterprises');
let UnpublishedEnterpriseInternationalPrivateModel = mongoose.model('UnpublishedEnterpriseInternationalPrivateFields', enterpriseInternationalPrivateFieldsSchema, 'unpublishedEnterprisePrivateFields');


DirectoryAdministratorsModel.on('index', function(err) {
  if (err) {
    logger.error('Error building indexes on Directory Administrators Model: ' + err);
  } else {
    logger.info('Built index on Directory Administrators Model');
  }
});

EnterpriseInternationalPublicModel.on('index', function(err) {
  if (err) {
    logger.error('Error building indexes on Enterprise International Public Model: ' + err);
  } else {
    logger.info('Built index on Enterprise International Public Model');
  }
});

EnterpriseInternationalPrivateModel.on('index', function(err) {
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

PendingEnterpriseInternationalPublicModel.on('index', function(err) {
  if (err) {
    logger.error('Error building indexes on Pending Enterprise International Public Model: ' + err);
  } else {
    logger.info('Built index on Pending Enterprise International Public Model');
  }
});

PendingEnterpriseInternationalPrivateModel.on('index', function(err) {
  if (err) {
    logger.error('Error building indexes on Pending Enterprise Private Model: ' + err);
  } else {
    logger.info('Built index on Pending Enterprise Private Model');
  }
});

UnpublishedEnterpriseInternationalPublicModel.on('index', function(err) {
  if (err) {
    logger.error('Error building indexes on Unpublished Enterprise International Public Model: ' + err);
  } else {
    logger.info('Built index on Unpublished Enterprise International Public Model');
  }
});

UnpublishedEnterpriseInternationalPrivateModel.on('index', function(err) {
  if (err) {
    logger.error('Error building indexes on Unpublished Enterprise Private Model: ' + err);
  } else {
    logger.info('Built index on Unpublished Enterprise Private Model');
  }
});

module.exports.enterprisePublicFields = Object.keys(enterprisePublicSchema.paths);
module.exports.enterprisePrivateFields = Object.keys(enterprisePrivateFieldsSchema.paths);
