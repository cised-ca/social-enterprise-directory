const dbUtil = require('./api/helpers/db/db_util');
const postUtil = require('./api/helpers/enterprise/post_util');
const mockAuthHandler = require('./api/helpers/auth/mock_auth_handler');

module.exports.setup = function(done) {
  postUtil.clean();
  mockAuthHandler.reset();
  dbUtil.cleanDatabase(done);
};
