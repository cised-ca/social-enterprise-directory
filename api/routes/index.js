var express = require('express');
var router = express.Router();
var enterpriseController = require('../controllers/enterprise.controller.js');

router
  .route('/enterprises')
  .get(enterpriseController.getAll);


router
  .route('/enterprises/:enterpriseId')
  .get(enterpriseController.getOne);

module.exports = router;
