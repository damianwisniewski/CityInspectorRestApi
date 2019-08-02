const webToken = require('./jwt_service')
const { models } = require('../models')

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
							}
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
			message: err.message || 'Token expired!'
		})
	}
}