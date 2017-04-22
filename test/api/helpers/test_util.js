module.exports.failTest = function(cb) {
  return function(err) {
    cb(err);
  };
};
