var expect = require('chai').expect;
var request = require('supertest');
var message = require('../../../lib/formatters/message');
var express = require('../../utils/express');

describe('Message formatter', function () {
  describe('#format', function () {
    it('should format message', function (done) {
      var server = express.createServer(function (req, res, next) {
        expect(message.format(req, res)).to.equal('GET 200 /test');
        next();
      });

      request(server)
      .get('/test')
      .expect(200)
      .end(done);
    });
  });
});