/* globals window, alert, XMLHttpRequest, REQUIRESCRIPT, sforce */
/* eslint indent: ["error", 2] */
/* eslint no-lone-blocks: 0 */
/* eslint no-unused-expressions: 0 */
/* eslint new-cap: 0 */
/* eslint camelcase: 0 */
/* eslint no-alert: 0 */

{!REQUIRESCRIPT('/soap/ajax/32.0/connection.js')}
{!REQUIRESCRIPT('/soap/ajax/32.0/apex.js')}

var isDev = true
var endPointUrl = isDev ? 'https://boleto-simples.textecnologia.com.br/sandbox' : 'https://boleto-simples.textecnologia.com.br/v1'
var numeroBoleto = '{!caixa__Parcela__c.NumeroBoleto__c}'

function cancelaNumeroBoleto() {
  var updateRec = []
  var lancamento = new sforce.SObject('caixa__Parcela__c')
  lancamento.Id = '{!caixa__Parcela__c.Id}'
  lancamento.NumeroBoleto__c = null
  updateRec.push(lancamento)
  var result = sforce.connection.update(updateRec)
  console.log(result)
  if (result.length === 1 && result[0].success === 'true') {
    window.location.reload(true)
  } else {
    alert('Erro ao atualizar o número do boleto: ' + numeroBoleto)
    console.log('Erro ao atualizar o número do boleto: ', numeroBoleto)
  }
}

function _ajaxSuccess(evt) {
  var t = evt.target
  console.log('_ajaxSuccess', t)
  if (t.readyState === 4 && (t.status === 200 || t.status === 204)) {
    t.removeEventListener('load', _ajaxSuccess)
    cancelaNumeroBoleto()
    alert('Boleto cancelado!')
  }
}

function _ajaxError(evt) {
  var t = evt.target
  console.log('_ajaxError', t)
  t.removeEventListener('error', _ajaxError)
  alert('Erro ao cancelar o boleto.')
}

if (numeroBoleto) {
  var _xhr = new XMLHttpRequest()
  _xhr.addEventListener('load', _ajaxSuccess)
  _xhr.addEventListener('error', _ajaxError)
  _xhr.open('PUT', endPointUrl + '/boletos/' + numeroBoleto + '/cancel')
  _xhr.setRequestHeader('Content-Type', 'application/json')
  _xhr.setRequestHeader('X-Boleto-App', 'Saleforce')
  _xhr.responseType = 'json'
  _xhr.send()
} else {
  alert('Você precisa registrar o boleto antes!')
}
