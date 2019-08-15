const webTocken = require('../services/jwt_service')
const { Sequelize, models } = require('../models')
const helpers = require('../utils/app_helpers/helpers')
const mailClient = require('../services/email_service')

const Op = Sequelize.Op;

/**
 * Login controller
 * Sends auth token in response for correct validation of email and password
 */
exports.login = (req, res, next) => {
	const { email, password } = req.body
	let userId

	if (email && password) {
		models.User.findOne({ where: { email: email } })
			.then(user => {
				if (user) {
					userId = user.id
					return user.validateDataHash(password)
				} else {
					throw { status: 403, message: 'Invalid auth data' }
				}
			})
			.then(isValid => {
				if (isValid) {
					const authToken = webTocken.create({
						email,
						userId
					})

					res.status(200).json(authToken)
				} else {
					throw { status: 401, message: 'Invalid auth data' }
				}
			})
			.catch(err => {
				next(err)
			})
	} else {
		next({ status: 403, message: 'Invalid auth data' })
	}
}

/**
 * Logout controller
 * Invalidates auth and refresh tokens, to prevent their usage after user logout
 */
exports.logout = (req, res, next) => {
	const token = req.locals.authorization.token
	const refreshToken = req.headers['token-refresh']

	if (refreshToken) {
		webTocken.revoke(token, refreshToken)
		res.status(204).send()
	} else {
		next({ status: 412, message: 'Refresh token header is missing, it have to be revoked also' })
	}
}

/**
 * Register controller
 * Adds new user to database
 */
exports.register = (req, res, next) => {
	const requireParams = ['email', 'password', 'nickname', 'emailAgreement']

	if (helpers.includesParams(req.body, requireParams)) {
		models.User.create(req.body)
			.then(() => res.status(201).send())
			.catch(() => next({ status: 401, message: 'Invalid data!' }))
	} else {
		next({ status: 400, message: 'Missing data!' })
	}
}

/**
 * Refresh controller
 * Invalidates passed auth and refresh tokens, then sends new ones
 */
exports.refreshToken = (req, res, next) => {
	const token = req.locals.authorization.token
	const refreshToken = req.headers['token-refresh']

	if (refreshToken) {
		try {
			const newTokens = webTocken.refresh(token, refreshToken)
			res.status(200).json(newTokens)
		} catch (err) {
			next({ status: 403, message: 'Invalid or expired refresh token' })
		}
	} else {
		next({ status: 400, message: 'Missing refresh token' })
	}
}

/**
 * Get Data controller
 * Sends basic user data for authorized user
 */
exports.getData = (req, res, next) => {
	const {
		name,
		surname,
		gender,
		city,
		nickname,
		email,
		emailAgreement
	} = req.locals.user

	res.status(200).json({
		name,
		surname,
		gender,
		city,
		nickname,
		email,
		emailAgreement
	})
}

/**
 * Update controller
 * Updates user data in database
 */
exports.updateData = (req, res, next) => {
	const updatedData = {}

	for (const key in req.body) {
		const bodyParamValue = req.body[key]
		if (bodyParamValue || bodyParamValue === '') {
			updatedData[key] = bodyParamValue
		}
	}

	if (Object.keys(updatedData).length) {
		req.locals.user.update({
			...updatedData
		})
			.then(() => {
				res.status(200).send()
			})
			.catch(() => {
				next({ status: 401, message: 'Invalid data!' })
			})
	} else {
		next({ status: 400, message: 'Missing data!' })
	}
}

/**
 * Initializes reset password process by send emial with prepared notification to reset password
 */
exports.sendResetEmail = (req, res, next) => {
	const resetEmail = req.body.email

	if (resetEmail) {
		models.User.findOne({ where: { email: resetEmail } })
			.then(user => {
				if (user) {
					mailClient.sendMessage({
						to: user.email,
						subject: 'City inspector - zmiana hasła',
						text:
							'City Inspector\n\n' +
							`Witaj ${user.nickname}!\n` +
							'Wiadomość została wysłana ze względu na próbę zmiany hasła.\n' +
							'Jeśli chcesz dokonać zmiany, przejdź na podaną poniżej stronę i podaj nowe hasło:\n' +
							`https://city-inspector.herokuapp.com/reset-password/${user.email}&${user.resetPasswordToken}`,
						html:
							`<p>Witaj ${user.nickname}!</p>
							<p>Wiadomość została wysłana ze względu na próbę zmiany hasła.</p>
							<p>Jeśli chcesz dokonać zmiany, przejdź na podaną poniżej stronę i podaj nowe hasło:</p>
							<a href="https://city-inspector.herokuapp.com/reset-password/${user.email}&${user.resetPasswordToken}">
								https://city-inspector.herokuapp.com/reset-password/${user.email}&${user.resetPasswordToken}
							</a>`
					})
						.then(() => res.status(204).send())
						.catch(() => next({ status: 503 }))

				} else {
					/**
					 * We don't want to give information to potential attacker,
					 * if email that was passed, is registered in database.
					 */
					res.status(204).send()
				}
			})
			.catch(err => {
				next({ status: 503 })
			})
	} else {
		next({ status: 400, message: 'Missed data' })
	}


}

/**
 * Changes password in database to new one
 */
exports.resetPassword = (req, res, next) => {
	const { email, resetToken, newPassword } = req.body

	if (!resetToken || !newPassword || !email) {
		return next({ status: 400, message: 'Missing data!' })
	}

	models.User.findOne({
		where: {
			[Op.and]: [{ email: email }, { resetPasswordToken: resetToken }]
		}
	})
		.then(user => {
			if (user) {
				user.update({
					password: newPassword
				})
					.then(() => {
						res.status(200).send()
					})
					.catch(() => {
						throw { status: 401, message: 'Invalid data!' }
					})
			} else {
				throw { status: 401, message: 'Invalid data!' }
			}
		})
		.catch((err) => next({ status: err.status, message: err.message }))

}

/**
 * Delete user account
 */
exports.deleteUser = (req, res, next) => {
	req.locals.user.destroy()
		.then(() => {
			res.status(204).send()
		})
		.catch(err => {
			next({ status: 417, message: 'Delete request failed!' })
		})
}
