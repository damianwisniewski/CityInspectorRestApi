const { Router } = require('express')
const notificationRouter = Router()
const imageParserForField = require('../middlewares/image_parser_middleware')

const authService = require('../middlewares/auth_middleware')
const {
	add,
	getMany,
	getSingle,
	remove,
	update,
} = require('../controllers/notification_controller')

/**
 * From path [/notification]
 */
notificationRouter.get('/:for(all)', getMany)

notificationRouter.get('/:for(own)', authService, getMany)

notificationRouter.get('/single/:notificationId', getSingle)

notificationRouter.post('/', authService, imageParserForField('photos'), add)

notificationRouter.delete('/:notificationId', authService, remove)

notificationRouter.put('/:notificationId', authService, imageParserForField('photos'), update)

module.exports = notificationRouter
