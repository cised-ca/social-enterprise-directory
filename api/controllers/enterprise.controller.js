var enterpriseData = require('../data/directory.json');

module.exports.getAll = function(req, res) {
  res.status(200)
    .json(enterpriseData);
}

module.exports.getOne = function(req, res) {
  var id = req.params.enterpriseId;
  enterprise = enterpriseData["enterprises"].filter(function(enterprise) {
    return enterprise._id == id;
  })[0];

  res.status(200)
    .json(enterprise);
}
