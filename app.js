'use strict';

let conf = require('./config/config.js');
var logger = require('./lib/logger');
logger.info('Running in NODE_ENV mode: ' + process.env.NODE_ENV);

const passport = require('./api/helpers/auth/passport_factory').initializePassport();
require('./api/data/db.js');
var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing

// TODO: make secret a configuration item
// TODO: use proper express-session store, not the default one
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

// TODO: implement these endpoints through swagger
app.get('/logout', function(req, res) { req.logout();} );
app.get('/login/facebook', passport.authenticate('facebook', {scope: 'email', session:false}));
app.get('/login/twitter', passport.authenticate('twitter', {session: false}));
app.get('/login/instagram', passport.authenticate('instagram', {failWithError: true}));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login/facebook' }),
  function(req, res) {
    res.redirect('/profile');
  });

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login/twitter' }),
  function(req, res) {
    res.redirect('/profile');
  });


app.get('/auth/instagram/callback',
  passport.authenticate('instagram', { failureRedirect: '/login/instagram' }),
  function(req, res) {
    res.redirect('/profile');
  });

app.get('/profile',
    function(req, res){
      if (req.isAuthenticated()) {
        console.log('Authenticated ' + req.user);
        res.status(200).json(req.user);
      } else {
        res.redirect('/login/twitter');
      }
    });

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
