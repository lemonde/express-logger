const { expect } = require('chai')
const request = require('supertest')
const remoteip = require('remoteip')

const formatter = require('../../../lib/formatters/metadata')
const express = require('../../utils/express')

describe('Metadata formatter', () => {
  describe('#format', () => {
    it('should define category', done => {
      const server = express.createServer((req, res, next) => {
        const meta = formatter.format(req, res)
        expect(meta).to.have.property('category', 'http-request')
        next()
      })

      request(server)
        .get('/test')
        .expect(200)
        .end(done)
    })

    it('should add user if present', done => {
      const server = express.createServer(
        (req, res, next) => {
          const meta = formatter.format(req, res)
          expect(meta).to.have.deep.property('user.id', 2)
          expect(meta).to.have.deep.property('user.email', 'hello@world.com')
          next()
        },
        {
          user: { id: 2, email: 'hello@world.com' },
        }
      )

      request(server)
        .get('/test')
        .expect(200)
        .end(done)
    })

    it('should computes the user agent', done => {
      const server = express.createServer(
        (req, res, next) => {
          const meta = formatter.format(req, res)
          expect(meta).to.have.deep.property(
            'clientRequest.ua.browser',
            'Chrome 35.0.1916'
          )
          expect(meta).to.have.deep.property(
            'clientRequest.ua.os',
            'Mac OS X 10.9.2'
          )
          expect(meta).to.have.deep.property('clientRequest.ua.device', 'Other')
          next()
        },
        {
          headers: {
            'user-agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) ' +
              'AppleWebKit/537.36 (KHTML, like Gecko) ' +
              'Chrome/35.0.1916.114 Safari/537.36',
          },
        }
      )

      request(server)
        .get('/test')
        .expect(200)
        .end(done)
    })

    it('should add the ip', done => {
      const server = express.createServer((req, res, next) => {
        const meta = formatter.format(req, res)
        expect(meta).to.have.deep.property(
          'clientRequest.ip',
          remoteip.get(req)
        )
        expect(meta)
        next()
      })

      request(server)
        .get('/test')
        .expect(200)
        .end(done)
    })

    it('should add the uuid if avalaible', done => {
      const server = express.createServer(
        (req, res, next) => {
          const meta = formatter.format(req, res)
          expect(meta).to.have.deep.property('clientRequest.uuid', 10000)
          next()
        },
        {
          uuid: 10000,
        }
      )

      request(server)
        .get('/test')
        .expect(200)
        .end(done)
    })

    it('should add qs', done => {
      const server = express.createServer((req, res, next) => {
        const meta = formatter.format(req, res)
        expect(meta).to.have.deep.property('clientRequest.qs.x', 'test')
        next()
      })

      request(server)
        .get('/test?x=test')
        .expect(200)
        .end(done)
    })

    it('should add headers', done => {
      const server = express.createServer(
        (req, res, next) => {
          const meta = formatter.format(req, res)
          expect(meta).to.have.deep.property(
            'clientRequest.headers.xtest',
            'OK'
          )
          next()
        },
        {
          headers: {
            xtest: 'OK',
          },
        }
      )

      request(server)
        .get('/test')
        .expect(200)
        .end(done)
    })

    it('should add path', done => {
      const server = express.createServer((req, res, next) => {
        const meta = formatter.format(req, res)
        expect(meta).to.have.deep.property('clientRequest.path', '/test')
        next()
      })

      request(server)
        .get('/test')
        .expect(200)
        .end(done)
    })

    it('should add status code', done => {
      const server = express.createServer((req, res, next) => {
        const meta = formatter.format(req, res)
        expect(meta).to.have.deep.property('clientRequest.statusCode', 200)
        next()
      })

      request(server)
        .get('/test')
        .expect(200)
        .end(done)
    })
  })
})
