/* eslint-disable camelcase */
const { join } = require('path')
const envType = process.env.NODE_ENV || 'DEVELOPMENT'
require('dotenv').config({ path: join(__dirname, `/.env.${envType.toLowerCase()}`) })

/**
 * CONFIGURATIONS
 */
exports.DATABASE_CONFIG = {
	username: process.env.DATABASE_USER_NAME,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	host: process.env.DATABASE_HOST,
	dialect: process.env.DATABASE_DIALECT,
	loggin: false,
}

exports.EMAIL_CLIENT_CONFIG = {
	host: process.env.EMAIL_HOST,
	port: process.env.EMAIL_PORT,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD,
	},
}

exports.PHOTO_STORAGE_CONFIG = {
	cloud_name: process.env.PHOTO_STORAGE_CLOUD_NAME,
	api_key: process.env.PHOTO_STORAGE_API_KEY,
	api_secret: process.env.PHOTO_STORAGE_API_SECRET,
}

exports.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

exports.ENCRYPTION_SALT = process.env.ENCRYPTION_SALT
