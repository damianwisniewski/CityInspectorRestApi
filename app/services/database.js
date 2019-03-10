const Sequelize = require('sequelize')
const envType = process.env.NODE_ENV

const database = new Sequelize({
	database: process.env[`DATABASE_NAME_${envType}`],
	username: process.env[`DATABASE_USER_NAME_${envType}`],
	password: process.env[`DATABASE_PASSWORD_${envType}`],
	host: process.env[`DATABASE_HOST_${envType}`],
	port: process.env[`DATABASE_PORT_${envType}`],
	dialect: process.env[`DATABASE_DIALECT_${envType}`],
	operatorsAliases: false,
})

/**
 * Synchronise database.
 * For PRODUCTION and DEVELOPMENT - Synchronisation will create tables that not exist in database.
 * For TEST - Synchronisation will re-create tables all that in database, no matter if they exist or no.
 */
switch (process.env.NODE_ENV) {
	case 'PRODUCTION':
		database.sync()
		break
	case 'DEVELOPMENT':
		database.sync()
		break
	case 'TEST':
		database.sync({ force: true })
		break
}

module.exports = database
