'use strict'

const zlib = require('zlib')
const responseTime = require('koa-response-time')
const compress = require('koa-compress')
const cors = require('kcors')
const conditional = require('koa-conditional-get')
const etag = require('koa-etag')
const bodyParser = require('koa-bodyparser')
const Koa = require('koa')
const debug = require('./lib/debug')
const routing = require('./routes')

const env = process.env.NODE_ENV || 'dev'
const app = new Koa()

app
	.use(cors())
	.use(responseTime())
	.use(compress({
		threshold: 2048,
		flush: zlib.Z_SYNC_FLUSH
	}))
	.use(conditional())
	.use(etag())
	.use(bodyParser())

routing(app)

app.on('error', err => {
	/* istanbul ignore if  */
	if (env !== 'test') {
		debug.error(err.status, err.message)
	}

	/* istanbul ignore if  */
	if (env === 'dev') {
		console.log(err.status, err.message)
		console.log(err)
	}
})

module.exports = app
