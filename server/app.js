'use strict'

const base = require('@tadashi/koa-base')
const debug = require('./lib/debug')
const routes = require('./routes')

const app = base({
	cors: {
		credentials: true
	}
}, ['error'])

app
	.use(async (ctx, next) => {
		try {
			await next()
		} catch (error) {
			ctx.status = error?.response?.statusCode ?? error?.status ?? 500
			ctx.statusMessage = error?.response?.statusMessage ?? error?.message ?? 'Internal Server Error'
			ctx.body = error?.response?.body ?? {code: ctx.status, message: ctx.statusMessage}
			ctx.app.emit('error', error)
		}
	})
	.use(routes)
	.on('error', debug.error)

app.proxy = true

module.exports = app
