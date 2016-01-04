# express-logger
[![Build Status](https://travis-ci.org/lemonde/express-logger.svg?branch=master)](https://travis-ci.org/lemonde/express-logger)
[![Dependency Status](https://david-dm.org/lemonde/express-logger.svg?theme=shields.io)](https://david-dm.org/lemonde/express-logger)
[![devDependency Status](https://david-dm.org/lemonde/express-logger/dev-status.svg?theme=shields.io)](https://david-dm.org/lemonde/express-logger#info=devDependencies)

Express logger middlewares. Takes a generic "log" function, and call it with `(message, metadata)`
(which is the format used by winston)
* requests :
  * message = built from infos about the request, ex `2015-12-03T14:47:00.296Z - info: GET 304 /api/users/me category=http-request, id=1, email=foo@bar.com, browser=Chrome 47.0.2526, os=Linux, device=Other, ip=1.2.3.4, uuid=048d090c-de90-4d36-96db-8a7f105fd59f...`
  * metadatas :
```js
{
  category: 'http-request',
  user: {id: ..., email: ...},  <-- picked from req.user if present
  clientRequest: {
    ua: {             <-- taken from headers
      browser: ...,
      os: ...,
      device: ...
    },
    ip: ...,          <-- remote IP
    uuid: ...,        <-- taken from req.uuid if any
    qs: { ... },      <-- cloneDeep(req.query)
    headers: { ... }, <-- clone(req.headers)
    path:             <-- req.path,
    statusCode:       <-- res.statusCode
  },
  durationMs          <-- request handling duration
}
```

* errors :
  * message : same as request
  * metadata : same as request, with additional infos :
```js
{
  ...,
  error: {
    message: '...',         <-- err.message || err.toString()
    stack: null,
    code: null
  }
}
```


## Install

```
npm install git://github.com/lemonde/express-logger.git
```

## Usage

```js
var expressLogger = require('express-logger');

app.use(expressLogger.error({log: console.error.bind(console)}));
app.use(expressLogger.request({log: console.log.bind(console)}));
```

## License

MIT
