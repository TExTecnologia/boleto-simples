'use strict'

require('babel-register')({
	plugins: ['transform-async-to-generator']
})

const debug = require('./app/lib/debug')
const api = require('./app/.')

const porta = process.env.PORT || 3000

api.listen(porta, () => {
	debug.log(`running on port ${porta}`)
})
