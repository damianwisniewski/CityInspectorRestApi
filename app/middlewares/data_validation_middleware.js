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

		errors.isEmpty()
			? next()
			: next({ status: 422, message: errors.array({ onlyFirstError: true })[0].msg })
	},
]
