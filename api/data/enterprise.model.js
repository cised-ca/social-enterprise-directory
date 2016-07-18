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

mongoose.model('Enterprise', enterprisePublicSchema, 'enterprises');
