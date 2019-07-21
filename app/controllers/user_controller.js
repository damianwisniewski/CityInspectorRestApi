const webTocken = require('../services/jwt_service')
const { models } = require('../models')
const { includesParams } = require('../utils/helpers')

/**
 * Login controller
 * Sends auth token in response for correct validation of email and password
 */
exports.login = (req, res, next) => {
	const { email, password } = req.body
	let userId

	models.User.findOne({ where: { email: email } })
		.then(user => {
			if (user) {
				userId = user.id
				return user.validateDataHash(password)
			} else {
				next({ status: 403, message: 'Invalid auth data' })
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
				next({ status: 401, message: 'Invalid auth data' })
			}
		})
		.catch(err => {
			console.log(err)
			next({ status: 403, message: 'Invalid auth data', body: err })
		})
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

	if (includesParams(req.body, requireParams)) {
		models.User.create(req.body).catch(() => next({ status: 400, message: 'Invalid data types!' }))
	} else {
		next({ status: 400, message: 'You missed required body data' })
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
			next({ status: 403, message: err.message })
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

	if (!Object.keys(updatedData).length) {
		next({ status: 400, message: 'You did not pass any proper data to update!' })
	}

	req.locals.user.update({
		...updatedData
	})
		.then(() => {
			res.status(200).send()
		})
		.catch(() => {
			next({ status: 400, message: 'You passed invalid data type to update!' })
		})
}

/**
 * 
 * Initializes reset password process by send emial with prepared notification to reset password
 */
exports.sendResetEmail = (req, res, next) => {
	const resetEmail = req.body.email

	if (!resetEmail) {
		next({ status: 400, message: 'You did not pass email to reset password' })
	}

	// send email then resp status
}

/**
 * Changes password in database to new one
 */
exports.resetPassword = (req, res, next) => {
	const { resetToken, newPassword } = req.body

	if (!resetToken || !newPassword) {
		next({ status: 400, message: 'Missing data!' })
	}

	models.User.findOne({ where: { resetToken } })
		.then(user => {
			if (!user) {
				next({ status: 404, message: 'Not found data to update!' })
			}

			req.locals.user.update({
				password: newPassword
			})
				.then(() => {
					res.status(200).send()
				})
				.catch(() => {
					next({ status: 400, message: 'You passed invalid data type to update!' })
				})
		})
		.catch(() => next({ status: 401, message: 'Invalid token!' }))

}