const webToken = require('./jwtService')
const { models } = require('../models')

module.exports = (req, res, next) => {
	try {
		const { authorization } = req.headers

		if (authorization && typeof authorization === 'string') {
			const token = authorization.split(' ')[1]
			const { userId, email } = webToken.validate(token)

			models.User.findByPk(userId).then(user => {
				if (user.email !== email) throw null

				req.locals = {
					user,
					authorization: {
						token,
						userId,
					}
				}

				next()
			})
				.catch(() => {
					next({ status: 403, message: 'You have no permission!' })
				})

		} else {
			next({ status: 403, message: 'You have no permission!' })
		}
	} catch (err) {
		next({ status: 401, message: err.message })
	}
}