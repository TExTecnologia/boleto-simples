'use strict'

/* eslint camelcase: 0 */

import {join} from 'path'
import {encode} from 'lagden-hex'
import test from 'ava'
import superkoa from './helpers/superkoa'

const app = join(__dirname, '..', 'app')

let createdBoletoId

test.before('POST /boletos - 201', async t => {
	const r = await superkoa(app)
		.post('/boletos')
		.set('X-Boleto-App', 'Test')
		.set('X-Boleto-Token', encode(String(Date.now()), false))
		.send({
			bank_billet: {
				amount: '1.594,36',
				expire_at: '30/12/2016',
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

	createdBoletoId = JSON.parse(r.text).id
	t.is(r.status, 201)
})

test('POST /boletos - 422', async t => {
	const r = await superkoa(app)
		.post('/boletos')
		.set('X-Boleto-App', 'Test')
		.set('X-Boleto-Token', encode(String(Date.now()), false))
		.send({
			bank_billet: {
				amount: '1.594,36',
				expire_at: '30/12/2016',
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
	t.is(r.text, '{"errors":{"customer_zipcode":["precisa ser 12345678 ou 12345-123"],"amount":[]}}')
})

test('POST /boletos - 400', async t => {
	const r = await superkoa(app)
		.post('/boletos')
		// .set('X-Boleto-App', 'Test')
		.set('X-Boleto-Token', encode(String(Date.now()), false))
		.send({})

	t.is(r.status, 400)
})

// Cancel
test('PUT /boletos/:id/cancel - 204', async t => {
	const r = await superkoa(app)
		.put(`/boletos/${createdBoletoId}/cancel`)
		.set('X-Boleto-App', 'Test')
		.set('X-Boleto-Token', encode(String(Date.now()), false))
		.send()

	t.is(r.status, 204)
})

test('PUT /boletos/:id/cancel - 404', async t => {
	const r = await superkoa(app)
		.put(`/boletos/1/cancel`)
		.set('X-Boleto-App', 'Test')
		.set('X-Boleto-Token', encode(String(Date.now()), false))

	t.is(r.status, 404)
})

test('PUT /boletos/:id/cancel - 400', async t => {
	const r = await superkoa(app)
		.put(`/boletos/1/cancel`)
		.set('X-Boleto-Token', encode(String(Date.now()), false))

	t.is(r.status, 400)
})

test.after('PUT /boletos/:id/cancel - 422', async t => {
	const r = await superkoa(app)
		.put(`/boletos/${createdBoletoId}/cancel`)
		.set('X-Boleto-App', 'Test')
		.set('X-Boleto-Token', encode(String(Date.now()), false))

	t.is(r.status, 422)
	t.is(r.text, '{"errors":{"status":["cannot transition via cancel"]}}')
})
