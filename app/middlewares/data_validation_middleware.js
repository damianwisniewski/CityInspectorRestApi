const validator = require('express-validator')

/**
 * Creates validation middleware.
 * @param {import('express-validator').Schema} validationSchema
 * @return {import('express').RequestHandler[]}
 */
module.exports = validationSchema => [
	/**
	 * express-validator middleware to validate passed schemas.
	 */
	validator.checkSchema(validationSchema),
	/**
	 * Middleware to handle validation result
	 */
	(req, res, next) => {
		const errors = validator.validationResult(req)

		if (errors.isEmpty()) {
			next()
		} else {
			const firstError = errors.array({ onlyFirstError: true })[0]

			next({
				status: 422,
				message: {
					info: firstError.msg,
					field: `${firstError.location}/${firstError.param}`,
				},
				error: {
					ctx: errors.array(),
					dirname: __dirname,
				},
			})
		}
	},
]
