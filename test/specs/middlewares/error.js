const { expect } = require('chai').use(require('sinon-chai'))
const sinon = require('sinon')
const request = require('supertest')

const errorLogger = require('../../../index').error
const express = require('../../utils/express')

describe('Error middleware', () => {
  it('should log error', done => {
    const log = sinon.spy()
    const server = express.createServer(errorLogger({ log }), {
      err: new Error('Custom error'),
    })

    request(server)
      .get('/test')
      .expect(500)
      .expect(() => {
        expect(log).to.be.calledWith('GET 500 /test')
        expect(log.firstCall.args[1]).to.have.property('category')
        expect(log.firstCall.args[1]).to.have.property('clientRequest')
        expect(log.firstCall.args[1]).to.have.property('error')
        expect(log.firstCall.args[1]).to.have.property('durationMs')
      })
      .end(done)
  })
})
