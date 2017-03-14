const passport = require('passport');
const oauthConfig = require('../../../config/oauth/oauth_config.js');
const InstagramStrategy = require('passport-instagram').Strategy;

module.exports.install = function() {
  passport.use(new InstagramStrategy(
    {
      clientID: oauthConfig.get('instagramClientId'),
      clientSecret: oauthConfig.get('instagramSecret'),
      callbackURL: 'http://localhost:10010/auth/instagram/callback'
    },
      function(accessToken, refreshToken, profile, cb) {
        console.log(profile);
        return cb(null, profile);
      }
    ));
};
