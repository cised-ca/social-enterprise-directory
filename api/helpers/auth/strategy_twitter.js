const passport = require('passport');
const oauthConfig = require('../../../config/oauth/oauth_config.js');
const TwitterStrategy = require('passport-twitter').Strategy;
const passportUserUtil = require('./passport_user_util');

module.exports.install = function() {
  passport.use(new TwitterStrategy(
    {
      consumerKey: oauthConfig.get('twitterConsumerKey'),
      consumerSecret: oauthConfig.get('twitterConsumerSecret'),
      // next line is needed to retrieve email address
      userProfileURL  : 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
      callbackURL: oauthConfig.get('twitterCallbackURL')
    },
    verifyTwitterAccount
  ));
};

function verifyTwitterAccount(accessToken, refreshToken, twitterProfile, cb) {
  let emails = extractEmails(twitterProfile);

  let user = {
    loginMethod: 'twitter',
    emails: emails
  };

  passportUserUtil.handle(user, cb);
}

function extractEmails(profile) {
  if (!profile.emails) return [];
  let emails = profile.emails.map(twitterEmailObject => {
    return twitterEmailObject.value;
  });
  return emails;
}
