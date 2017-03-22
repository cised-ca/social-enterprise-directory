const convict = require('convict');

let oauthConfig = convict({
  redirectURLOnSuccessfulLogin: {
    doc: 'The URL to load after oauth succeeds',
    format: String,
    default: '',
    env: 'OAUTH_REDIRECT_URL'
  },
  twitterCallbackURL: {
    doc: 'The twitter callback URL after oauth succeeds',
    format: String,
    default: '',
    env: 'TWITTER_CALLBACK_URL'
  },
  facebookCallbackURL: {
    doc: 'The facebook callback URL after oauth succeeds',
    format: String,
    default: '',
    env: 'FACEBOOK_CALLBACK_URL'
  },
  instagramCallbackURL: {
    doc: 'The instagram callback URL after oauth succeeds',
    format: String,
    default: '',
    env: 'INSTAGRAM_CALLBACK_URL'
  },
  twitterConsumerKey: {
    doc: 'The twitter consumer key',
    format: String,
    default: '',
    env: 'TWITTER_CONSUMER_KEY'
  },
  twitterConsumerSecret: {
    doc: 'The twitter consumer secret',
    format: String,
    default: '',
    env: 'TWITTER_CONSUMER_SECRET'
  },
  facebookClientId: {
    doc: 'The facebook client id',
    format: String,
    default: '',
    env: 'FACEBOOK_CLIENT_ID'
  },
  facebookSecret: {
    doc: 'The facebook secret',
    format: String,
    default: '',
    env: 'FACEBOOK_SECRET'
  },
  instagramClientId: {
    doc: 'The instagram client id',
    format: String,
    default: '',
    env: 'INSTAGRAM_CLIENT_ID'
  },
  instagramSecret: {
    doc: 'The instagram secret',
    format: String,
    default: '',
    env: 'INSTAGRAM_SECRET'
  }
});

oauthConfig.loadFile('./config/oauth/oauth.json');
oauthConfig.validate({strict: true});

module.exports = oauthConfig;
