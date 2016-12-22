'use strict'

const Router = require('koa-router')
const debug = require('../lib/debug')
const util = require('../lib/util')
const send = require('../lib/send')

const router = new Router()
const verifyToken = util.verifyToken
const getHeaders = util.getHeaders

router.prefix('/boletos')

// POST /boletos
router.post('/', async (ctx, next) => {
	debug.log('POST /boletos', 'headers', ctx.request.headers)
	debug.log('POST /boletos', 'body', ctx.request.body)
	const {app, token} = getHeaders(ctx.request.headers)
	const body = ctx.request.body
	if (app && body && verifyToken(token)) {
		try {
			const r = await send('/bank_billets', body)
			ctx.status = 201
			ctx.body = r.body
			return next()
		} catch (err) {
			debug.error('POST /boletos', 'send', err.name)
			debug.error('POST /boletos', 'send', err.message)
			if (err.response && err.response.body) {
				debug.error('POST /boletos', 'send', err.response.body)
				debug.error('POST /boletos', 'send', err.status)
				ctx.body = err.response.body
			}
			ctx.status = err.statusCode || err.status
			// ctx.throw(err)
			return next()
		}
	}
	ctx.throw(400)
})

module.exports = router
