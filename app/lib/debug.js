'use strict'

const debug = require('debug')

const log = debug('webhook:log')
const error = debug('webhook:error')

exports.log = log
exports.error = error
