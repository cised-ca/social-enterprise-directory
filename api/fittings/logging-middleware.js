var winston = require('winston');

module.exports = function create(fittingDef, bagpipes) {
  return function log(context, cb) {
    winston.info(context.request.method, context.request.url);
    cb();
  };
};
