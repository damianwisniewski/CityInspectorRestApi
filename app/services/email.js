const nodemailer = require('nodemailer')
const envType = process.env.NODE_ENV

module.exports = nodemailer.createTransport({
	pool: true,
	service: process.env[`EMAIL_SERVICE_${envType}`],
	host: process.env[`EMAIL_HOST_${envType}`],
	secure: process.env[`MAIL_SECURE_${envType}`],
	auth: {
		user: process.env[`EMAIL_USER_${envType}`],
		pass: process.env[`EMAIL_PASSWORD_${envType}`],
	},
})
