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

mongoose.model('EnterprisePublic', enterprisePublicSchema, 'enterprises');
mongoose.model('EnterprisePrivateFields', enterprisePrivateFieldsSchema, 'enterprisePrivateFields');

module.exports.enterprisePublicFields = Object.keys(enterprisePublicSchema.paths);
module.exports.enterprisePrivateFields = Object.keys(enterprisePrivateFieldsSchema.paths);
