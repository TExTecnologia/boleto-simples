'use strict'

const Router = require('@koa/router')
const bodyparser = require('koa-bodyparser')
const send = require('../lib/send')
// const debug = require('../lib/debug')

const router = new Router()

// POST /boletos
async function create(ctx) {
	const {
		headers = {},
		body
	} = ctx?.request ?? {}

	const {
		'x-boleto-app': app,
		'x-boleto-token': token
	} = headers

	if (!app || !token || !body) {
		ctx.throw(400)
	}

	const res = await send('/bank_billets', body)
	ctx.status = 201
	ctx.body = res.body
}

async function cancel(ctx) {
	const {
		headers = {}
	} = ctx?.request ?? {}

	const {
		'x-boleto-app': app
	} = headers

	const id = ctx?.params?.id ?? false

	if (!app || id === false) {
		ctx.throw(400)
	}

	await send(`/bank_billets/${id}/cancel`, '', 'put')
	ctx.status = 204
}

router
	.prefix('/boletos')
	.post('/', bodyparser(), create)
	.put('/:id/cancel', cancel)

module.exports = router
