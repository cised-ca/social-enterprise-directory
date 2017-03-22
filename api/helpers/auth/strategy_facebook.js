const passport = require('passport');
const oauthConfig = require('../../../config/oauth/oauth_config.js');
const FacebookStrategy = require('passport-facebook').Strategy;
const passportUserUtil = require('./passport_user_util');

module.exports.install = function() {
  passport.use(new FacebookStrategy(
    {
      clientID: oauthConfig.get('facebookClientId'),
      clientSecret: oauthConfig.get('facebookSecret'),
      callbackURL: oauthConfig.get('facebookCallbackURL'),
      profileFields: ['id', 'email']
    },
    verifyFBAccount
  ));
};

function verifyFBAccount(accessToken, refreshToken, fbProfile, cb) {
  let emails = extractEmails(fbProfile);

  let user = {
    loginMethod: 'facebook',
    emails: emails
  };

  passportUserUtil.handle(user, cb);
}

function extractEmails(profile) {
  if (!profile.emails) return [];
  let emails = profile.emails.map(fbEmailObject => {
    return fbEmailObject.value;
  });
  return emails;
}
