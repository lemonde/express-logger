var expect = require('chai').use(require('sinon-chai')).expect;
var sinon = require('sinon');
var request = require('supertest');
var errorLogger = require('../../../index').error;
var express = require('../../utils/express');

describe('Error middleware', function () {
  it('should log error', function (done) {
    var log = sinon.spy();
    var server = express.createServer(errorLogger({log: log}), {
      err: new Error('Custom error')
    });

    request(server)
      .get('/test')
      .expect(500)
      .expect(function () {
        expect(log).to.be.calledWith('GET 500 /test');
        expect(log.firstCall.args[1]).to.have.property('category');
        expect(log.firstCall.args[1]).to.have.property('clientRequest');
        expect(log.firstCall.args[1]).to.have.property('error');
        expect(log.firstCall.args[1]).to.have.property('durationMs');
      })
      .end(done);
  });
});