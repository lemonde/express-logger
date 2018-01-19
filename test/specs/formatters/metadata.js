var expect = require('chai').expect;
var request = require('supertest');
var remoteip = require('remoteip');
var formatter = require('../../../lib/formatters/metadata');
var express = require('../../utils/express');

describe('Metadata formatter', function () {
  describe('#format', function () {
    it('should define category', function (done) {
      var server = express.createServer(function (req, res, next) {
        var meta = formatter.format(req, res);
        expect(meta).to.have.property('category', 'http-request');
        next();
      });

      request(server)
        .get('/test')
        .expect(200)
        .end(done);
    });

    it('should add user if present', function (done) {
      var server = express.createServer(function (req, res, next) {
        var meta = formatter.format(req, res);
        expect(meta).to.have.deep.property('user.id', 2);
        expect(meta).to.have.deep.property('user.email', 'hello@world.com');
        next();
      }, {
        user: {id: 2, email: 'hello@world.com'}
      });

      request(server)
        .get('/test')
        .expect(200)
        .end(done);
    });

    it('should computes the user agent', function (done) {
      var server = express.createServer(function (req, res, next) {
        var meta = formatter.format(req, res);
        expect(meta).to.have.deep.property('clientRequest.ua.browser', 'Chrome 35.0.1916');
        expect(meta).to.have.deep.property('clientRequest.ua.os', 'Mac OS X 10.9.2');
        expect(meta).to.have.deep.property('clientRequest.ua.device', 'Other');
        next();
      }, {
        headers: {
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) ' +
          'AppleWebKit/537.36 (KHTML, like Gecko) ' +
          'Chrome/35.0.1916.114 Safari/537.36'
        }
      });

      request(server)
        .get('/test')
        .expect(200)
        .end(done);
    });

    it('should add the ip', function (done) {
      var server = express.createServer(function (req, res, next) {
        var meta = formatter.format(req, res);
        expect(meta).to.have.deep.property('clientRequest.ip', remoteip.get(req));
        expect(meta)
        next();
      });

      request(server)
        .get('/test')
        .expect(200)
        .end(done);
    });

    it('should add the uuid if avalaible', function (done) {
      var server = express.createServer(function (req, res, next) {
        var meta = formatter.format(req, res);
        expect(meta).to.have.deep.property('clientRequest.uuid', 10000);
        next();
      }, {
        uuid: 10000
      });

      request(server)
        .get('/test')
        .expect(200)
        .end(done);
    });

    it('should add qs', function (done) {
      var server = express.createServer(function (req, res, next) {
        var meta = formatter.format(req, res);
        expect(meta).to.have.deep.property('clientRequest.qs.x', 'test');
        next();
      });

      request(server)
        .get('/test?x=test')
        .expect(200)
        .end(done);
    });

    it('should add headers', function (done) {
      var server = express.createServer(function (req, res, next) {
        var meta = formatter.format(req, res);
        expect(meta).to.have.deep.property('clientRequest.headers.xtest', 'OK');
        next();
      }, {
        headers: {
          'xtest': 'OK'
        }
      });

      request(server)
        .get('/test')
        .expect(200)
        .end(done);
    });

    it('should add path', function (done) {
      var server = express.createServer(function (req, res, next) {
        var meta = formatter.format(req, res);
        expect(meta).to.have.deep.property('clientRequest.path', '/test');
        next();
      });

      request(server)
        .get('/test')
        .expect(200)
        .end(done);
    });

    it('should add status code', function (done) {
      var server = express.createServer(function (req, res, next) {
        var meta = formatter.format(req, res);
        expect(meta).to.have.deep.property('clientRequest.statusCode', 200);
        next();
      });

      request(server)
        .get('/test')
        .expect(200)
        .end(done);
    });
  });
});