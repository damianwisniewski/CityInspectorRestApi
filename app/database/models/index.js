const Sequelize = require('sequelize')
const path = require('path')
const env = process.env.NODE_ENV || 'development'
const models = require('./models')
const config = require(path.join(
	__dirname,
	'../../../config/database-config.js'
))[env.toLowerCase()]

console.log(config)
console.log(config)
const db = {}

if (env === 'PRODUCTION') {
	// prodDatabase
	// devDatabase
	db.sequelize = new Sequelize({
		...config,
		operatorsAliases: false,
	})
} else if (env === 'TEST') {
	// local development database
	db.sequelize = new Sequelize(config)
} else {
	// local test database
	db.sequelize = new Sequelize(config)
}

module.exports = {
	Sequelize,
	...db,
	models: models(db.sequelize, Sequelize),
}
