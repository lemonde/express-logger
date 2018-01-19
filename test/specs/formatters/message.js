const { expect } = require('chai')
const request = require('supertest')

const formatter = require('../../../lib/formatters/message')
const express = require('../../utils/express')

describe('Message formatter', () => {
  describe('#format', () => {
    it('should format message', done => {
      const server = express.createServer((req, res, next) => {
        expect(formatter.format(req, res)).to.equal('GET 200 /test')
        next()
      })

      request(server)
        .get('/test')
        .expect(200)
        .end(done)
    })
  })
})
