'use strict';

let conf = require('./config/config.js');
var logger = require('./lib/logger');
logger.info('Running in NODE_ENV mode: ' + process.env.NODE_ENV);

require('./api/data/db.js');
require('./api/helpers/auth/directory_admin_bootstrapper').bootstrap();

const passport = require('./api/helpers/auth/passport_factory');
var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing

// TODO: make secret a configuration item
// TODO: use proper express-session store, not the default one
app.use(require('express-session')({ secret: 'keyboard cat 100', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

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
