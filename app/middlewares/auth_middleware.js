const webToken = require('../services/jwt_service')
const { models } = require('../models')

/**
 * Authorization middleware.
 * Checks if request contains authorization header and validates it.
 * Throws some auth error if validation fail or
 * creates in req locals data of authorized user, then passes request on.
 */
module.exports = (req, res, next) => {
	try {
		const { authorization } = req.headers

		if (authorization) {
			const token = authorization.split(' ')[1]
			const { userId, email } = webToken.validate(token)

			models.User.findByPk(userId)
				.then(user => {
					if (user.email === email) {
						req.locals = {
							user,
							authorization: {
								token,
								userId,
							},
						}

						next()
					} else {
						return Promise.reject()
					}
				})
				.catch(() => {
					next({ status: 403, message: 'You have no permission!' })
				})
		} else {
			throw { status: 403, message: 'You have no permission!' }
		}
	} catch (err) {
		next({
			status: err.status || 401,
			message: err.message || 'Token expired!',
		})
	}
}
