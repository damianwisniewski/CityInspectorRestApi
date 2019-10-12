/* eslint-disable prettier/prettier */
const { Router } = require('express')
const subscriptionRouter = Router()

// middlewares
const authMiddleware = require('../middlewares/auth_middleware')
const validatorMiddleware = require('../middlewares/data_validation_middleware')

// controller
const subscriptionController = require('../controllers/subscription_controller')

/**
 * From path [/subscription]
 */
subscriptionRouter.post('/:notificationId',
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
