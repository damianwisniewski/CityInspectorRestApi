const { Router } = require('express')
const subscriptionRouter = Router()

const authService = require('../services/auth_service')
const {
	get,
	add,
	remove
} = require('../controllers/subscription_controller')

/**
 * From path [/subscription]
 */
subscriptionRouter.post('/', authService, add)
subscriptionRouter.get(['/', '/:subscriptionId'], authService, get)
subscriptionRouter.delete(['/', '/:subscriptionId'], authService, remove)

module.exports = subscriptionRouter