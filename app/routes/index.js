const fs = require('fs')
const path = require('path')
const { Router } = require('express')
const routing = Router()

/**
 * Gets all routers files names from this directory and use them to main routing
 */
fs.readdirSync(__dirname).forEach(file => {
	if (file !== 'index.js') {
		const router = require(path.join(`${__dirname}/${file}`))

		routing.use(router)
	}
})

module.exports = routing