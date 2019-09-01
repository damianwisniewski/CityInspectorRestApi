/* eslint-disable prettier/prettier */
const { Router } = require('express')
const subscriptionRouter = Router()

// middlewares
const authMiddleware = require('../middlewares/auth_middleware')
const validatorMiddleware = require('../middlewares/data_validation_middleware')

const subscriptionController = require('../controllers/subscription_controller')

/**
 * @typedef {import('express-validator').Schema} Schema
 */

/**
 * Collection of possible inputs, and its validation and sanitization rules.
 * @type {Schema}
 */
const inputRules = {
	notification: {
		in: 'query',
		exists: true,
	},
}

/**
 * From path [/subscription]
 */
subscriptionRouter.post('/',
	validatorMiddleware(inputRules),
	authMiddleware,
	subscriptionController.add,
)

subscriptionRouter.get(['/', '/:subscriptionId'],
	authMiddleware,
	subscriptionController.get
)

subscriptionRouter.delete(['/', '/:subscriptionId'],
	authMiddleware,
	subscriptionController.remove
)

module.exports = subscriptionRouter
