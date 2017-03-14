const passport = require('passport');

module.exports.initializePassport = function() {
  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function(user, cb) {
    cb(null, user);
  });

  require('./strategy_facebook').install();
  require('./strategy_twitter').install();
  require('./strategy_instagram').install();
  return passport;
};
