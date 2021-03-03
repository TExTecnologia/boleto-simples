/* globals window, alert, XMLHttpRequest, REQUIRESCRIPT, sforce */
/* eslint indent: ["error", 2] */
/* eslint no-lone-blocks: 0 */
/* eslint no-unused-expressions: 0 */
/* eslint new-cap: 0 */
/* eslint camelcase: 0 */
/* eslint no-alert: 0 */
/* eslint quotes: 0 */

{!REQUIRESCRIPT('/soap/ajax/32.0/connection.js')}
{!REQUIRESCRIPT('/soap/ajax/32.0/apex.js')}

var isDev = true
var endPointUrl = isDev ? 'https://boleto-simples.textecnologia.com.br/sandbox' : 'https://boleto-simples.textecnologia.com.br/v1'
var numeroBoleto = '{!caixa__Parcela__c.NumeroBoleto__c}'

function _cleanup(c) {
  return c.replace(/\D/g, '')
}

function gravaNumeroBoleto(idBoleto) {
  var updateRec = []
  var lancamento = new sforce.SObject('caixa__Parcela__c')
  lancamento.Id = '{!caixa__Parcela__c.Id}'
  lancamento.NumeroBoleto__c = idBoleto
  updateRec.push(lancamento)
  var result = sforce.connection.update(updateRec)
  console.log(result)
  if (result.length === 1 && result[0].success === 'true') {
    window.location.reload(true)
  } else {
    alert('Erro ao atualizar o número do boleto: ' + idBoleto)
    console.log('Erro ao atualizar o número do boleto:', idBoleto)
  }
}

function _ajaxSuccess(evt) {
  var t = evt.target
  console.log('_ajaxSuccess', t)
  if (t.readyState === 4) {
    if (t.status === 200 || t.status === 201) {
      t.removeEventListener('load', _ajaxSuccess)
      if (t.response && t.response.id) {
        gravaNumeroBoleto(t.response.id)
        alert('Boleto registrado com sucesso!')
      }
    } else {
      _ajaxError(evt)
    }
  }
}

function _ajaxError(evt) {
  var t = evt.target
  console.log('_ajaxError', t)
  t.removeEventListener('error', _ajaxError)
  if (t.response) {
    alert(JSON.stringify(t.response))
  }
  alert('Erro ao registrar o boleto.')
}

if (numeroBoleto) {
  alert('Cancele este boleto antes de registrar um novo')
} else {
  var q = "SELECT Name, caixa__CNPJ__c, caixa__CPF__c, BillingAddress, Bairro__c FROM Account WHERE Id = '{!caixa__Parcela__c.AccountId__c}' LIMIT 1"
  var result = sforce.connection.query(q)
  var records = result.getArray('records')

  if (records.length === 1) {
    var _amount = '{!caixa__Parcela__c.caixa__Valor_Final__c}'
    var _doc = records[0].caixa__CNPJ__c || records[0].caixa__CPF__c
    var dataBoleto = {
      bank_billet: {
        our_number: '{!caixa__Parcela__c.caixa__Nosso_n_mero__c}',
        amount: _amount.split(' ')[1],
        expire_at: '{!caixa__Parcela__c.caixa__Data_Vencimento__c}',
        payment_place: '{!caixa__Parcela__c.caixa__Local_de_pagamento__c}',
        description: 'RECIBO DO PAGADOR',
        instructions: '{!caixa__Parcela__c.caixa__Instru_o_de_Cobran_a_1__c}',
        customer_person_name: records[0].Name,
        customer_cnpj_cpf: _doc,
        customer_zipcode: _cleanup(records[0].BillingAddress.postalCode),
        customer_address: records[0].BillingAddress.street,
        customer_city_name: records[0].BillingAddress.city,
        customer_state: records[0].BillingAddress.state,
        customer_neighborhood: records[0].Bairro__c
        // Se desejar colocar o email do cliente para disparar automaticamente pelo Boleto Simples (Pago?!)
        // customer_email: '{!caixa__Parcela__c.OwnerEmail}'
      }
    }

    console.log(dataBoleto)

    var _xhr = new XMLHttpRequest()
    _xhr.addEventListener('load', _ajaxSuccess)
    _xhr.addEventListener('error', _ajaxError)
    _xhr.open('POST', endPointUrl + '/boletos')
    _xhr.setRequestHeader('Content-Type', 'application/json')
    _xhr.setRequestHeader('X-Boleto-App', 'Saleforce')
    _xhr.responseType = 'json'
    _xhr.send(JSON.stringify(dataBoleto))
  } else {
    alert('Conta não encontrada')
  }
}
