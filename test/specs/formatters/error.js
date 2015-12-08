var expect = require('chai').expect;
var request = require('supertest');
var formatter = require('../../../lib/formatters/error');
var express = require('../../utils/express');

describe('Error formatter', function () {

  context('given a string as error', function () {
    it('should define error fields', function (done) {
      var meta;
      var server = express.createServer(function (req, res, next) {
        meta = formatter().format('A string');
        next();
      });

      request(server)
        .get('/test')
        .expect(200)
        .end(function(err) {
          if (err) return done(err);

          expect(meta).to.have.deep.property('error.name', 'Error');
          expect(meta).to.have.deep.property('error.message', 'A string');
          expect(meta).to.have.deep.property('error.stack', null);
          done();
        });
    });
  });

  describe('given a plain object as error', function () {
    it('should define error fields', function (done) {
      var meta;
      var server = express.createServer(function (req, res, next) {
        meta = formatter().format({foo: 'bar'});
        next();
      });

      request(server)
        .get('/test')
        .expect(200)
        .end(function(err) {
          if (err) return done(err);

          expect(meta).to.have.deep.property('error.name', 'Error');
          expect(meta).to.have.deep.property('error.message', '[object Object]');
          expect(meta).to.have.deep.property('error.stack', null);
          done();
        });
    });
  });

  describe('given an Error object as error', function () {
    it('should define error fields', function (done) {
      var meta;
      var server = express.createServer(function (req, res, next) {
        var error = new Error('Test message');
        meta = formatter().format(error);
        next();
      });

      request(server)
        .get('/test')
        .expect(200)
        .end(function(err) {
          if (err) return done(err);

          expect(meta).to.have.deep.property('error.message', 'Test message');
          done();
        });
    });

    context('with default configuration', function () {
      it('should pick only selected properties', function (done) {
        var meta, error;

        var server = express.createServer(function (req, res, next) {
          error = new Error('Test message');
          error.code = 10;
          error.foo = 'bar';

          meta = formatter().format(error);
          next();
        });

        request(server)
          .get('/test')
          .expect(200)
          .end(function (err) {
            if (err) return done(err);

            expect(meta).to.have.deep.property('error.name', 'Error');
            expect(meta).to.have.deep.property('error.message', 'Test message');
            expect(meta).to.have.deep.property('error.stack', error.stack);
            expect(meta).to.not.have.deep.property('error.code'); // not picked
            expect(meta).to.not.have.deep.property('error.foo'); // not picked
            done();
          });
      });
    });

    context('with an explicit properties whitelist', function () {
      it('should pick only selected properties', function (done) {
        var meta, error;
        var server = express.createServer(function (req, res, next) {
          error = new Error('Test message');
          error.code = 10;
          error.foo = 'bar';

          meta = formatter({
            pickedFields: [
              // no "name"
              'message',
              'stack',
              'foo'
            ]
          }).format(error);
          next();
        });

        request(server)
          .get('/test')
          .expect(200)
          .end(function(err) {
            if (err) return done(err);

            expect(meta).to.not.have.deep.property('error.name'); // not picked
            expect(meta).to.have.deep.property('error.message', 'Test message');
            expect(meta).to.have.deep.property('error.stack', error.stack);
            expect(meta).to.have.deep.property('error.foo', 'bar'); // picked
            done();
          });
      });
    });

  });
});
