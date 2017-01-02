
const request = require('supertest');
const App = require('../../app_starter').App;

const URL_PREFIX = '/api/v1';

module.exports.buildGetRequest = function(url) {
  return request(App)
      .get(URL_PREFIX + url)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
};

module.exports.buildPostRequest = function(url) {
  return request(App)
      .post(URL_PREFIX + url)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);
};
