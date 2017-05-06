const dbUtil = require('./api/helpers/db/db_util');
const postUtil = require('./api/helpers/enterprise/post_util');
const mockAuthHandler = require('./api/helpers/auth/mock_auth_handler');

module.exports.setup = function(done) {
  postUtil.clean();
  mockAuthHandler.reset();
  // All tests run as directory admin by default
  mockAuthHandler.handler.isDirectoryAdmin = true;
  dbUtil.cleanDatabase(done);
};
