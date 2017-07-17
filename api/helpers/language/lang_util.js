const SUPPORTED_LANGUAGES = require('./constants').SUPPORTED_LANGUAGES;
const DEFAULT_LANGUAGE = require('./constants').DEFAULT_LANGUAGE;

module.exports.getLanguage = function(req) {
  let lang = DEFAULT_LANGUAGE;
  if (req.swagger.params.lang &&
      req.swagger.params.lang.value &&
      SUPPORTED_LANGUAGES.indexOf(req.swagger.params.lang.value) > -1) {
    lang = req.swagger.params.lang.value;
  }
  return lang;
};
