'use strict'

const got = require('got')
const config = require('../../config/boleto.json')
const debug = require('./debug')

const boleto = config.boleto
const env = process.env.NODE_ENV || 'dev'
const baseEndpoint = boleto[env].endpoint
const auth = new Buffer(`${boleto[env].token}:x`).toString('base64')
const ua = boleto[env].ua

function send(endpoint, data = '', method = 'post', xHeaders = {}) {
	const headers = {
		Authorization: `Basic ${auth}`,
		'User-Agent': ua,
		'Content-Type': 'application/json'
	}

	Object.assign(headers, xHeaders)

	let body = null
	if (data) {
		body = JSON.stringify(data)
	}

	const url = `${baseEndpoint}${endpoint}`
	debug.log('send --> url -->', url)
	debug.log('send --> headers -->', headers)
	debug.log('send --> body -->', body)

	return got[method](url, {
		headers,
		body
	})
}

module.exports = send
