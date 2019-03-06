const Sequelize = require('sequelize')
const envType = process.env.NODE_ENV

module.exports = new Sequelize({
	database: process.env[`DATABASE_NAME_${envType}`],
	username: process.env[`DATABASE_USER_NAME_${envType}`],
	password: process.env[`DATABASE_PASSWORD_${envType}`],
	host: process.env[`DATABASE_HOST_${envType}`],
	port: process.env[`DATABASE_PORT_${envType}`],
	dialect: 'mysql',
	operatorsAliases: false,
})
