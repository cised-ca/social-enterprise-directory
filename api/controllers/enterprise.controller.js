var enterpriseData = require('../data/test_data.json');

module.exports.getAll = function(req, res) {
  res.status(200)
    .json(enterpriseData['enterprises']);
};

module.exports.getOne = function(req, res) {
  var id = req.swagger.params.id.value;
  var enterprise = enterpriseData['enterprises'].filter(function(enterprise) {
    return enterprise.id == id;
  })[0];

  res.status(200)
    .json(enterprise);
};
