const passport = require('passport');
const oauthConfig = require('../../../config/oauth/oauth_config.js');
const FacebookStrategy = require('passport-facebook').Strategy;

module.exports.install = function() {
  passport.use(new FacebookStrategy({
    clientID: oauthConfig.get('facebookClientId'),
    clientSecret: oauthConfig.get('facebookSecret'),
    callbackURL: 'http://localhost:10010/auth/facebook/callback',
    profileFields: ['id', 'email']
  },
    function(accessToken, refreshToken, profile, cb) {
      console.log(profile);
      return cb(null, profile);
    }
  ));
};
