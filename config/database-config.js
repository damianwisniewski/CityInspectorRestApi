require('dotenv').config()

module.exports = {
	development: {
		username: process.env.DATABASE_USER_NAME_PRODUCTION,
		password: process.env.DATABASE_PASSWORD_PRODUCTION,
		database: process.env.DATABASE_NAME_DEVELOPMENT,
		port: process.env.DATABASE_PORT_PRODUCTION,
		host: 'localhost',
		dialect: 'mysql',
		operatorsAliases: false,
	},
	test: {
		username: process.env.DATABASE_USER_NAME_PRODUCTION,
		password: process.env.DATABASE_PASSWORD_PRODUCTION,
		database: process.env.DATABASE_NAME_TEST,
		port: process.env.DATABASE_PORT_PRODUCTION,
		host: 'localhost',
		dialect: 'mysql',
		operatorsAliases: false,
	},
	production: {
		username: process.env.DATABASE_USER_NAME_PRODUCTION,
		password: process.env.DATABASE_PASSWORD_PRODUCTION,
		database: process.env.DATABASE_NAME_PRODUCTION,
		port: process.env.DATABASE_PORT_PRODUCTION,
		host: 'localhost',
		dialect: 'mysql',
		operatorsAliases: false,
	},
}
