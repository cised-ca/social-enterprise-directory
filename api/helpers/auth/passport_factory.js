const passport = require('passport');

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(user, cb) {
  cb(null, user);
});

require('./strategy_facebook').install();
require('./strategy_twitter').install();
require('./strategy_instagram').install();
require('./strategy_google').install();

module.exports = passport;
