var expect = require('chai').use(require('sinon-chai')).expect;
var sinon = require('sinon');
var request = require('supertest');
var requestLogger = require('../../../index').request;
var express = require('../../utils/express');

describe('Request middleware', function () {
  it('should log request', function (done) {
    var log = sinon.spy();
    var server = express.createServer(requestLogger({log: log}));

    request(server)
      .get('/test')
      .expect(200)
      .expect(function () {
        expect(log).to.be.calledWith('GET 200 /test');
        expect(log.firstCall.args[1]).to.have.property('category');
        expect(log.firstCall.args[1]).to.have.property('clientRequest');
        expect(log.firstCall.args[1]).to.have.property('durationMs');
      })
      .end(done);
  });
});