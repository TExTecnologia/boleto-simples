'use strict'

const got = require('got')

async function request(endpoint, options) {
	try {
		const res = await got(endpoint, options)
		return res
	} catch (error) {
		error.expose = true
		throw error
	}
}

module.exports = request
