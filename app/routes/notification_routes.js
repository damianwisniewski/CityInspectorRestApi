const { Router } = require('express')
const notificationRouter = Router()

const authService = require('../services/auth_service')
const {
	add,
	get,
	remove,
	update
} = require('../controllers/notification_controller')

/**
 * From path [/notification]
 */
notificationRouter.get(['/', '/:notificationId'], get)
notificationRouter.post('/', authService, add)
notificationRouter.delete('/:notificationId', authService, remove)
notificationRouter.put('/:notificationId', authService, update)

module.exports = notificationRouter