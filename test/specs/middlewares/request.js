const { expect } = require('chai').use(require('sinon-chai'))
const sinon = require('sinon')
const request = require('supertest')

const requestLogger = require('../../../index').request
const express = require('../../utils/express')

describe('Request middleware', () => {
  it('should log request', done => {
    const log = sinon.spy()
    const server = express.createServer(requestLogger({ log }))

    request(server)
      .get('/test')
      .expect(200)
      .expect(() => {
        expect(log).to.be.calledWith('GET 200 /test')
        expect(log.firstCall.args[1]).to.have.property('category')
        expect(log.firstCall.args[1]).to.have.property('clientRequest')
        expect(log.firstCall.args[1]).to.have.property('durationMs')
      })
      .end(done)
  })
})
