'use strict'

const request = require('./request')
// const debug = require('./debug')

const {
	ENDPOINT: baseEndpoint,
	TOKEN,
	UA
} = process.env

const auth = Buffer.from(`${TOKEN}:x`).toString('base64')

function send(endpoint, data, method = 'post', xHeaders = {}) {
	const headers = {
		Authorization: `Basic ${auth}`,
		'User-Agent': UA,
		...xHeaders
	}

	const opts = {
		throwHttpErrors: true,
		headers,
		method
	}

	if (data) {
		opts.responseType = 'json'
		opts.json = data
	}

	return request(`${baseEndpoint}${endpoint}`, opts)
}

module.exports = send
