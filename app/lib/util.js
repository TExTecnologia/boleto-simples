'use strict'

const hex = require('lagden-hex')
// const debug = require('./debug')

function _expire(timestamp, life = 10000) {
	const now = Date.now()
	console.log(timestamp, now)
	return (now - life) < timestamp
}

function verifyToken(token) {
	const timestamp = hex.decode(token, false)
	console.log(token, timestamp)
	return _expire(Number(timestamp))
}

function getHeaders(headers) {
	const o = {}
	const hs = ['x-boleto-app', 'x-boleto-token']
	hs.forEach(h => {
		o[h.split('-')[2]] = headers[h] || false
	})
	return o
}

exports.verifyToken = verifyToken
exports.getHeaders = getHeaders
