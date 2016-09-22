/* eslint-env node, mocha */
var should = require('should');
var request = require('supertest');

var mongoose = require('mongoose');
var App = require('../../../app_starter').App;

var URL_PREFIX = '/api/v1/';

describe('enterprise.controller', function() {

  beforeEach(function(done) {
    mongoose.connection.db.dropDatabase(done);
  });

  describe('GET /directory', function() {

    it('should return empty directory', function(done) {

      request(App)
          .get(URL_PREFIX + 'directory')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.should.eql([]);
            done();
          });
    });

  });

});
