var enterpriseData = require('../data/directory.json');

module.exports.getAll = function(req, res) {
  res.status(200)
    .json(enterpriseData);
}

module.exports.getOne = function(req, res) {
  var id = req.params.enterpriseId;
  var index = parseInt(id) - 1;

  res.status(200)
    .json(enterpriseData["enterprises"][index]);
}
