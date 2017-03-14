const passport = require('passport');
const oauthConfig = require('../../../config/oauth/oauth_config.js');
const TwitterStrategy = require('passport-twitter').Strategy;

module.exports.install = function() {
  passport.use(new TwitterStrategy(
    {
      consumerKey: oauthConfig.get('twitterConsumerKey'),
      consumerSecret: oauthConfig.get('twitterConsumerSecret'),
      callbackURL: 'http://localhost:10010/auth/twitter/callback'
    },
      function(accessToken, refreshToken, profile, cb) {
        console.log(profile);
        return cb(null, profile);
      }
    ));
};
