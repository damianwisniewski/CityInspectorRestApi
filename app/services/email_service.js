const nodemailer = require('nodemailer')
const helpers = require('../utils/app_helpers/helpers')
const { EMAIL_CLIENT_CONFIG } = require('../config')

module.exports = {
	/**
	 * Instance of nodmailer transporter
	 */
	mailClient: null,

	/**
	 * Connects with email provider and saves email transporter instance to mailClient property.
	 * @returns {Promise<true>}
	 */
	connect: async function() {
		this.mailClient = await nodemailer.createTransport(EMAIL_CLIENT_CONFIG)
		return this.mailClient.verify()
	},

	/**
	 * Email template
	 */
	htmlTemplate: function(content) {
		return (
			// HEADER
			`<div style="
				background-color: #3a5784;
				padding: 3px;
				text-align: center;
				color: white;"
			>
				<h2>City Inspector</h2>
			</div>` +
			// BODY
			`<div style="
				background-color: #efefef;
				padding: 5px;
				font-size: 14px;
				text-align: center;
				color: black;"
			>
				${content}
			</div>`
		)
	},

	/**
	 * Sends email message
	 * @param {string} email
	 * @param {object} messageParams
	 */
	sendMessage: function(messageParams) {
		const requiredParams = ['to', 'subject', 'text', 'html']

		if (messageParams && helpers.includesParams(messageParams, requiredParams)) {
			return this.mailClient.sendMail({
				from: EMAIL_CLIENT_CONFIG.auth.user,
				to: messageParams.to,
				subject: messageParams.subject,
				text: messageParams.text,
				html: this.htmlTemplate(messageParams.html),
			})
		} else {
			return Promise.reject('ERROR: You cannot send email without to email adress')
		}
	},
}
