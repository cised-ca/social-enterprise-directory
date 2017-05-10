'use strict';

let conf = require('./config/config.js');
var logger = require('./lib/logger');
logger.info('Running in NODE_ENV mode: ' + process.env.NODE_ENV);

require('./api/data/db.js');
require('./api/helpers/auth/directory_admin_bootstrapper').bootstrap();

const passport = require('./api/helpers/auth/passport_factory');
var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
const bodyParser = require('body-parser');
module.exports = app; // for testing

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
let dbURL = conf.get('dbURL');
var sess = {
  secret: conf.get('sessionSecret'),
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({url: dbURL}),
  cookie: {}
};
if (conf.get('env') === 'production') {
  // force secure cookies in production
  app.set('trust proxy', 1);
  sess.cookie.secure = true;
}
app.use(session(sess));

app.use(passport.initialize());
app.use(passport.session());

// increase request size to 1MB to support logos
app.use(bodyParser.json({limit: '1mb'}));

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
