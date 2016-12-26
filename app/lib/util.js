'use strict'

// const hex = require('lagden-hex')
// const debug = require('./debug')

// function _expire(timestamp, life = 30000) {
// 	const now = Date.now()
// 	debug.log('_expire ---> ', timestamp, now)
// 	debug.log('_expire ---> ', now - life)
// 	debug.log('_expire ---> ', (now - life) < timestamp)
// 	debug.log('_expire diff ---> ', timestamp - now)
// 	return (now - life) < timestamp
// }

// function verifyToken(token) {
// 	const timestamp = hex.decode(token, false)
// 	debug.log('verifyToken ---> ', token, timestamp)
// 	return _expire(Number(timestamp))
// }

function getHeaders(headers) {
	const o = {}
	const hs = ['x-boleto-app', 'x-boleto-token']
	hs.forEach(h => {
		o[h.split('-')[2]] = headers[h] || false
	})
	return o
}

// exports.verifyToken = verifyToken
exports.getHeaders = getHeaders
