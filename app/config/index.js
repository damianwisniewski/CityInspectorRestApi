const { join } = require('path')
const envType = process.env.NODE_ENV || 'DEVELOPMENT'
require('dotenv')
	.config({ path: join(__dirname, `/.env.${envType.toLowerCase()}`) })

/**
 * CONFIGURATIONS
 */
exports.DATABASE_CONFIG = {
	username: process.env.DATABASE_USER_NAME,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	port: process.env.DATABASE_PORT,
	host: 'localhost',
	dialect: 'mysql',
	logging: false
}

exports.EMAIL_CLIENT_CONFIG = {
	host: process.env.EMAIL_HOST,
	port: process.env.EMAIL_PORT,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD,
	}
}

exports.PHOTO_STORAGE_CONFIG = {
}

exports.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

exports.ENCRYPTION_SALT = process.env.ENCRYPTION_SALT