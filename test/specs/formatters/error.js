const { expect } = require('chai')
const request = require('supertest')

const formatter = require('../../../lib/formatters/error')
const express = require('../../utils/express')

describe('Error formatter', () => {
  context('given a string as error', () => {
    it('should define error fields', done => {
      let meta
      const server = express.createServer((req, res, next) => {
        meta = formatter().format('A string')
        next()
      })

      request(server)
        .get('/test')
        .expect(200)
        .end(err => {
          if (err) return done(err)

          expect(meta).to.have.deep.property('error.name', 'Error')
          expect(meta).to.have.deep.property('error.message', 'A string')
          expect(meta).to.have.deep.property('error.stack', null)

          return done()
        })
    })
  })

  describe('given a plain object as error', () => {
    it('should define error fields', done => {
      let meta
      const server = express.createServer((req, res, next) => {
        meta = formatter().format({ foo: 'bar' })
        next()
      })

      request(server)
        .get('/test')
        .expect(200)
        .end(err => {
          if (err) return done(err)

          expect(meta).to.have.deep.property('error.name', 'Error')
          expect(meta).to.have.deep.property('error.message', '[object Object]')
          expect(meta).to.have.deep.property('error.stack', null)

          return done()
        })
    })
  })

  describe('given an Error object as error', () => {
    it('should define error fields', done => {
      let meta
      const server = express.createServer((req, res, next) => {
        const error = new Error('Test message')
        meta = formatter().format(error)
        next()
      })

      request(server)
        .get('/test')
        .expect(200)
        .end(err => {
          if (err) return done(err)

          expect(meta).to.have.deep.property('error.message', 'Test message')

          return done()
        })
    })

    context('with default configuration', () => {
      it('should pick only selected properties', done => {
        let meta
        let error

        const server = express.createServer((req, res, next) => {
          error = new Error('Test message')
          error.code = 10
          error.foo = 'bar'

          meta = formatter().format(error)
          next()
        })

        request(server)
          .get('/test')
          .expect(200)
          .end(err => {
            if (err) return done(err)

            expect(meta).to.have.deep.property('error.name', 'Error')
            expect(meta).to.have.deep.property('error.message', 'Test message')
            expect(meta).to.have.deep.property('error.stack', error.stack)
            expect(meta).to.not.have.deep.property('error.code') // not picked
            expect(meta).to.not.have.deep.property('error.foo') // not picked

            return done()
          })
      })
    })

    context('with an explicit properties whitelist', () => {
      it('should pick only selected properties', done => {
        let meta
        let error
        const server = express.createServer((req, res, next) => {
          error = new Error('Test message')
          error.code = 10
          error.foo = 'bar'

          meta = formatter({
            pickedFields: [
              // no "name"
              'message',
              'stack',
              'foo',
            ],
          }).format(error)
          next()
        })

        request(server)
          .get('/test')
          .expect(200)
          .end(err => {
            if (err) return done(err)

            expect(meta).to.not.have.deep.property('error.name') // not picked
            expect(meta).to.have.deep.property('error.message', 'Test message')
            expect(meta).to.have.deep.property('error.stack', error.stack)
            expect(meta).to.have.deep.property('error.foo', 'bar') // picked

            return done()
          })
      })
    })
  })
})
