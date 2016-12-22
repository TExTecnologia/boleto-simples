'use strict'

const boletos = require('./boletos')

const routes = [
	boletos
]

function routing(app) {
	routes.forEach(route => {
		app
			.use(route.routes())
			.use(route.allowedMethods({
				throw: true
			}))
	})
}

module.exports = routing
