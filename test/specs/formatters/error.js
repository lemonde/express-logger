var expect = require('chai').expect;
var request = require('supertest');
var formatter = require('../../../lib/formatters/error');
var express = require('../../utils/express');

describe('Error formatter', function () {
  describe('given string as error', function () {
    it('should define error message', function (done) {
      var server = express.createServer(function (req, res, next) {
        var meta = formatter.format('A string');
        expect(meta).to.have.deep.property('error.message', 'A string');
        expect(meta).to.have.deep.property('error.stack', null);
        expect(meta).to.have.deep.property('error.code', null);
        next();
      });

      request(server)
        .get('/test')
        .expect(200)
        .end(done);
    });
  });

  describe('given plain object as error', function () {
    it('should define error message', function (done) {
      var server = express.createServer(function (req, res, next) {
        var meta = formatter.format({foo: 'bar'});
        expect(meta).to.have.deep.property('error.message', '[object Object]');
        expect(meta).to.have.deep.property('error.stack', null);
        expect(meta).to.have.deep.property('error.code', null);
        next();
      });

      request(server)
        .get('/test')
        .expect(200)
        .end(done);
    });
  });

  describe('given Error object as error', function () {
    it('should define error message', function (done) {
      var server = express.createServer(function (req, res, next) {
        var error = new Error('Test message');
        error.code = 10;
        var meta = formatter.format(error);
        expect(meta).to.have.deep.property('error.message', 'Test message');
        expect(meta).to.have.deep.property('error.stack', error.stack);
        expect(meta).to.have.deep.property('error.code', 10);
        next();
      });

      request(server)
        .get('/test')
        .expect(200)
        .end(done);
    });
  });
});