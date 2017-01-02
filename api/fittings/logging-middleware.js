const logger = require('../../lib/logger');

module.exports = function create() {
  return function log(context, cb) {
    logger.info(context.request.method, context.request.url);
    cb();
  };
};
