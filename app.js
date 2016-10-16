'use strict';

var conf = require('./config/config.js');

var logger = require('./lib/logger');
logger.info('Running in NODE_ENV mode: ' + process.env.NODE_ENV);

require('./api/data/db.js');
var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing

var expressConfig = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(expressConfig, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);
  var port = conf.get('port');
  var ip = conf.get('ip');
  app.listen(port, ip, function() {
    logger.info('Server started on %s:%d', ip, port);
  });

});
