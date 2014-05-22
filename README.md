# express-logger
[![Build Status](https://travis-ci.org/lemonde/express-logger.svg?branch=master)](https://travis-ci.org/lemonde/express-logger)
[![Dependency Status](https://david-dm.org/lemonde/express-logger.svg?theme=shields.io)](https://david-dm.org/lemonde/express-logger)
[![devDependency Status](https://david-dm.org/lemonde/express-logger/dev-status.svg?theme=shields.io)](https://david-dm.org/lemonde/express-logger#info=devDependencies)

Express logger middlewares.

## Install

```
npm install express-logger
```

## Usage

```js
var expressLogger = require('express-logger');

app.use(expressLogger.error({log: console.error.bind(console)}));
app.use(expressLogger.request({log: console.log.bind(console)}));
```

## License

MIT