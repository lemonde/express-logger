const _ = require('lodash')

const DEFAULT_PROPERTIES_WHITELIST = [
  // standard properties
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
  'name',
  'message',
  'stack',
]

/**
 * Module interface.
 */

module.exports = _options => {
  const options = { pickedFields: DEFAULT_PROPERTIES_WHITELIST, ..._options }

  /**
   * Format error as metadata.
   *
   * @param {*} err
   */

  return {
    format: function format(errData = {}) {
      // we are in an error handler, we must work at all cost, whatever could be in "errData"
      const err = {} // a proper object, sure to be _.pick-able
      // special fields with known default
      err.name = errData.name || 'Error'
      err.message = errData.message || errData.toString()

      // any other field
      _.forEach(options.pickedFields, key => {
        err[key] =
          err[key] || (_.isUndefined(errData[key]) ? null : errData[key])
      })

      return { error: _.pick(err, options.pickedFields) }
    },
  }
}
