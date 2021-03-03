'use strict'

const test = require('ava')
const app = require('./helper/server')

let boletoDate = new Intl.DateTimeFormat('pt-BR').format(new Date(Date.now() + 1000000000))
let createdBoletoId

test('POST /boletos - 201', async t => {
	const r = await app
		.post('/boletos')
		.set('X-Boleto-App', 'Test')
		.set('X-Boleto-Token', Date.now())
		.send({
			bank_billet: {
				amount: '1.594,36',
				expire_at: boletoDate,
				description: 'BOLETO DE TESTES',
				customer_person_name: 'Parvi Manaus',
				customer_cnpj_cpf: '07.514.434/0006-63',
				customer_zipcode: 69050000,
				customer_email: 'vilanova@textecnologia.com.br',
				customer_address: 'AV Constantino Nery, 2065, sala 01, São Geraldo',
				customer_city_name: 'Manaus',
				customer_state: 'AM',
				customer_neighborhood: 'São Geraldo',
				instructions: 'SR(a) CAIXA, NÃO AUTORIZAMOS RECEBER ESTE BOLETO'
			}
		})

	createdBoletoId = r.body.id
	t.is(r.status, 201)
})

test('POST /boletos - 422', async t => {
	const r = await app
		.post('/boletos')
		.set('X-Boleto-App', 'Test')
		.set('X-Boleto-Token', Date.now())
		.send({
			bank_billet: {
				amount: '1.594,36',
				expire_at: boletoDate,
				description: 'BOLETO DE TESTES',
				customer_person_name: 'Parvi Manaus',
				customer_cnpj_cpf: '07.514.434/0006-63',
				customer_zipcode: 123,
				customer_email: 'vilanova@textecnologia.com.br',
				customer_address: 'AV Constantino Nery, 2065, sala 01, São Geraldo',
				customer_city_name: 'Manaus',
				customer_state: 'AM',
				customer_neighborhood: 'São Geraldo',
				instructions: 'SR(a) CAIXA, NÃO AUTORIZAMOS RECEBER ESTE BOLETO'
			}
		})

	t.is(r.status, 422)
	t.snapshot(r.body)
})

test('POST /boletos - 400', async t => {
	const r = await app
		.post('/boletos')
		.set('X-Boleto-Token', Date.now())
		.send({})

	t.is(r.status, 400)
})

test('PUT /boletos/:id/cancel - 204', async t => {
	const r = await app
		.put(`/boletos/${createdBoletoId}/cancel`)
		.set('X-Boleto-App', 'Test')
		.set('X-Boleto-Token', Date.now())
		.send()

	t.is(r.status, 204)
})

test('PUT /boletos/:id/cancel - 404', async t => {
	const r = await app
		.put('/boletos/1/cancel')
		.set('X-Boleto-App', 'Test')
		.set('X-Boleto-Token', Date.now())

	t.is(r.status, 404)
})

test('PUT /boletos/:id/cancel - 400', async t => {
	const r = await app
		.put('/boletos/1/cancel')
		.set('X-Boleto-Token', Date.now())

	t.is(r.status, 400)
})

test('PUT /boletos/:id/cancel - 403', async t => {
	const r = await app
		.put(`/boletos/${createdBoletoId}/cancel`)
		.set('X-Boleto-App', 'Test')
		.set('X-Boleto-Token', Date.now())

	t.is(r.status, 403)
	t.snapshot(r.body)
})
