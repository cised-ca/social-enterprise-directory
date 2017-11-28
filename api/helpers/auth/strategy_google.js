const passport = require('passport');
const oauthConfig = require('../../../config/oauth/oauth_config.js');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passportUserUtil = require('./passport_user_util');

module.exports.install = function() {
  passport.use(new GoogleStrategy(
    {
      clientID: oauthConfig.get('googleClientId'),
      clientSecret: oauthConfig.get('googleSecret'),
      callbackURL: oauthConfig.get('googleCallbackURL')
    },
    verifyGoogleAccount
  ));
};

function verifyGoogleAccount(accessToken, refreshToken, googleProfile, cb) {
  let emails = extractEmails(googleProfile);

  let user = {
    loginMethod: 'google',
    emails: emails
  };

  passportUserUtil.handle(user, cb);
}

function extractEmails(profile) {
  if (!profile.emails) return [];
  let emails = profile.emails.map(googleEmailObject => {
    return googleEmailObject.value;
  });
  return emails;
}
