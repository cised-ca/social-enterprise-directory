var mongoose = require('mongoose');

var enterprisePublicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: String,
  description: String,
  offering: String,
  purposes: [String],
  website: String,
  emails: [{
    email: {type: String, required: true},
    public: Boolean,
    tags: [String]
  }],
  phones: [{
    number: {type: String, required: true},
    public: Boolean,
    tags: [String]
  }],
  faxes: [{
    fax: {type: String, required: true},
    public: Boolean,
    tags: [String]
  }],
  addresses: [{
    address: {type: String, required: true},
    public: Boolean,
    tags: [String]
  }],
  locations: [[Number]]
});

var Enterprise = mongoose.model('EnterprisePublic', enterprisePublicSchema, 'enterprises');

module.exports.enterprisePublicFields = Object.keys(enterprisePublicSchema.paths).join(' ');

var enterpriseCompleteSchema = new mongoose.Schema({
  clusters: [String],
  segments: [String],
  parent_organization: String,
  contact_person: [String],
  annual_revenue_range: String,
  stage_of_development: String
});

Enterprise.discriminator('EnterpriseComplete', enterpriseCompleteSchema);
