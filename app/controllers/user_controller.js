const webTocken = require('../services/jwtService')
const { models } = require('../models')
const { includesParams } = require('../utils/data_validator')

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
				return user.validatePassword(password)
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
				next({ status: 403, message: 'Invalid auth data' })
			}
		})
		.catch(err => console.log(err))
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

exports.register = (req, res, next) => {
	const requireParams = ['email', 'password', 'nickname', 'emailAgreement']

	if (includesParams(req.body, requireParams)) {
		models.User.create(req.body).catch(err => console.log(err))
	} else {
		next({ status: 422, message: 'You missed required body data' })
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
		nickname,
		email,
		emailAgreement
	} = req.locals.user

	res.status(200).json({
		name,
		surname,
		gender,
		nickname,
		email,
		emailAgreement
	})
}

exports.updateData = (req, res, next) => {

}