/* eslint-disable prettier/prettier */
const { Router } = require('express')
const subscriptionRouter = Router()
// middlewares
const authMiddleware = require('../middlewares/auth_middleware')
const validatorMiddleware = require('../middlewares/data_validation_middleware')
// models
const { models } = require('../models')
// controller
const subscriptionController = require('../controllers/subscription_controller')

/**
 * Collection of possible inputs, and its validation and sanitization rules.
 * @type {Schema}
 */
const inputRules = {
	notificationId: {
		in: 'params',
		custom: {
			options: async value => {
				const notificationExist = Boolean(await models.Notification.findByPk(value))
				
				if (!notificationExist) {
					throw new Error('Provided notificationId is incorrect, notification does not exist for this number!!')
				}
				
				return notificationExist
			}
		}
	}
}

/**
 * From path [/subscription]
 */
subscriptionRouter.post('/:notificationId',
	authMiddleware,
	validatorMiddleware(inputRules),
	subscriptionController.add,
)

subscriptionRouter.get(['/', '/:subscriptionId'],
	authMiddleware,
	validatorMiddleware(inputRules),
	subscriptionController.get
)

subscriptionRouter.delete(['/', '/:subscriptionId'],
	authMiddleware,
	validatorMiddleware(inputRules),
	subscriptionController.remove
)

module.exports = subscriptionRouter
