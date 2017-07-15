const should = require('should');
const postUtil = require('./post_util');
const putUtil = require('./put_util');
const deleteUtil = require('./delete_util');
const getUtil = require('./get_util');

module.exports.createAndPublishTestEnterprise1 = function() {
  return new Promise( (resolve, reject) => {
    postUtil.postTestEnterprise1()
    .then(publishTestEnterprise1)
    .then(() => resolve())
    .catch(err => reject(err));
  });
};

module.exports.createAndPublishTestEnterprise2 = function() {
  return new Promise( (resolve, reject) => {
    postUtil.postTestEnterprise2()
    .then(publishTestEnterprise2)
    .then(() => resolve())
    .catch(err => reject(err));
  });
};

module.exports.createAndPublishTestEnterprise3 = function() {
  return new Promise( (resolve, reject) => {
    postUtil.postTestEnterprise3()
    .then(publishTestEnterprise3)
    .then(() => resolve())
    .catch(err => reject(err));
  });
};

module.exports.createAndPublishAllEnterprises = function() {
  return new Promise ( resolve => {
    module.exports.createAndPublishTestEnterprise1()
    .then(module.exports.createAndPublishTestEnterprise2)
    .then(module.exports.createAndPublishTestEnterprise3)
    .then(() => resolve())
    .catch(err => should.fail(null, null, err));
  });
};

module.exports.getTestEnterprise1Id = function() {
  return postUtil.getTestEnterprise1Id();
};
module.exports.getTestEnterprise2Id = function() {
  return postUtil.getTestEnterprise2Id();
};
module.exports.getTestEnterprise3Id = function() {
  return postUtil.getTestEnterprise3Id();
};

function publishTestEnterprise1() {
  return new Promise( (resolve, reject) => {
    getUtil.getUnpublishedEnterprise1Body()
    .then(body => {
      return putUtil.putEnterprise(postUtil.getTestEnterprise1Id(), body);
    })
    .then(deleteUtil.deleteUnpublishedEnterprise1)
    .then(() => resolve())
    .catch(err => reject(err));
  });
}

function publishTestEnterprise2() {
  return new Promise( (resolve, reject) => {
    getUtil.getUnpublishedEnterprise2Body()
    .then(body => {
      return putUtil.putEnterprise(postUtil.getTestEnterprise2Id(), body);
    })
    .then(deleteUtil.deleteUnpublishedEnterprise2)
    .then(() => resolve())
    .catch(err => reject(err));
  });
}

function publishTestEnterprise3() {
  return new Promise( (resolve, reject) => {
    getUtil.getUnpublishedEnterprise3Body()
    .then(body => {
      return putUtil.putEnterprise(postUtil.getTestEnterprise3Id(), body);
    })
    .then(deleteUtil.deleteUnpublishedEnterprise3)
    .then(() => resolve())
    .catch(err => reject(err));
  });
}
