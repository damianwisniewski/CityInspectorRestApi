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

const rules = {
	title: {
		isLength: { options: { min: 2, max: 150 } },
	},
	description: {
		exists: true,
	},
	status: {
		isAlpha: { options: ['pl-PL'] },
	},
	category: {
		isAlpha: { options: ['pl-PL'] },
	},
	lon: {
		toFloat: true,
		isLatLong: true,
	},
	lat: {
		toFloat: true,
		isLatLong: true,
	},
	city: {
		matches: { options: ['^[a-ząęśćźćńółżA-ZĄĘŚĆŹĆŃÓŁŻ0-9- ]{2,}$'] },
	},
	street: {
		matches: { options: ['^[a-ząęśćźćńółżA-ZĄĘŚĆŹĆŃÓŁŻ0-9- ]{2,}$'] },
	},
	number: {
		isAlphanumeric: true,
	},
	post: {
		isPostalCode: { options: ['PL'] },
	},
}

/**
 * From path [/notification]
 */
notificationRouter.get('/:type(all)', getMany)

notificationRouter.get('/:type(own)', authService, getMany)

notificationRouter.get('/single/:notificationId', getSingle)

notificationRouter.post('/', authService, imageParserForField('photos'), add)

notificationRouter.delete('/:notificationId', authService, remove)

notificationRouter.put('/:notificationId', authService, imageParserForField('photos'), update)

module.exports = notificationRouter
