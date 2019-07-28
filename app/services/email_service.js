const nodemailer = require('nodemailer')
const { EMAIL_CLIENT_CONFIG } = require('../config')

/**
 * Email template
 */
const emailTemplate = {
	/**
	 * @param {object} messageParams
	 * @param {string} messageParams.nickname
	 * @param {string} messageParams.resetLink
	 * @returns {string}
	 */
	text: ({ nickname, resetLink }) =>
		'City Inspector\n\n' +
		`Witaj ${nickname}!\n` +
		'Wiadomość została wysłana ze względu na próbę zmiany hasła.\n' +
		'Jeśli chcesz dokonać zmiany, przejdź na podaną poniżej stronę i podaj nowe hasło:\n' +
		`${resetLink}`,

	/**
	 * @param {object} messageParams
	 * @param {string} messageParams.nickname
	 * @param {string} messageParams.resetLink
	 * @returns {string}
	 */
	html: ({ nickname, resetLink }) =>
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
			<p>Witaj ${nickname}!</p>
			<p>Wiadomość została wysłana ze względu na próbę zmiany hasła.</p>
			<p>Jeśli chcesz dokonać zmiany, przejdź na podaną poniżej stronę i podaj nowe hasło:</p>
			<a href="${resetLink}">${resetLink}</a>
		</div>`,
}

module.exports = {

	/**
	 * Instance of nodmailer transporter
	 */
	mailClient: nodemailer.createTransport(EMAIL_CLIENT_CONFIG),

	/**
	 * Creates plain text or html email message from template
	 * @param {object} templateParams 
	 * @param {('text'|'html')} type 
	 */
	fillTemplate: function (templateParams = {}, type = 'text') {
		return emailTemplate[type](templateParams)
	},

	/**
	 * Sends email message
	 * @param {string} email 
	 * @param {object} messageParams 
	 */
	sendMessage: function (to, messageParams) {
		if (to && messageParams) {
			return this.mailClient.sendMail({
				from: EMAIL_CLIENT_CONFIG.auth.user,
				to,
				subject: 'City inspector - zmiana hasła',
				text: this.fillTemplate(messageParams, 'text'),
				html: this.fillTemplate(messageParams, 'html')
			})
		} else {
			return Promise.reject('ERROR: You cannot send email without to email adress')
		}
	},

	/**
	 * Verifies connection with mail provider
	 * @returns {Promise<true>}
	 */
	verifyConnection: function () {
		return this.mailClient.verify()
	},
}
