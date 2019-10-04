/* eslint-disable prettier/prettier */
const { Router } = require('express')
const notificationRouter = Router()

// middlewares
const authMiddleware = require('../middlewares/auth_middleware')
const imageParserForField = require('../middlewares/image_parser_middleware')
const validatorMiddleware = require('../middlewares/data_validation_middleware')

// controller
const notificationController = require('../controllers/notification_controller')

//helpers
const helpers = require('../utils/app_helpers/helpers')

/**
 * @typedef {import('express-validator').Schema} Schema
 */

/**
 * Collection of possible inputs, and its validation and sanitization rules.
 * @type {Schema}
 */
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
		isFloat: true,
		toFloat: true,
	},
	lat: {
		isFloat: true,
		toFloat: true,
	},
	city: {
		matches: { options: ['^[a-ząęśćźćńółżA-ZĄĘŚĆŹĆŃÓŁŻ0-9- ]{2,}$'] },
		optional: true,
	},
	street: {
		matches: { options: ['^[a-ząęśćźćńółżA-ZĄĘŚĆŹĆŃÓŁŻ0-9- ]{2,}$'] },
		optional: true,
	},
	number: {
		isAlphanumeric: true,
		optional: true,
	},
	post: {
		isPostalCode: { options: ['PL'] },
		optional: true,
	},
}

/**
 * Collection of schemas created from predefined input rules for each `notification` endpoint.
 * @type {Object<string, Schema>}
 */
const schemas = {
	add: rules,
	update: helpers.extendNestedObjectsBy(
		rules,
		{
			optional: true
		}
	),
}

/**
 * From path [/notification]
 */

notificationRouter.get('/:type(all)',
	notificationController.getMany
)

notificationRouter.get('/:type(own)',
	authMiddleware,
	notificationController.getMany
)

notificationRouter.get('/single/:notificationId',
	notificationController.getSingle
)

notificationRouter.post('/',
	authMiddleware,
	imageParserForField('photos'), 
	validatorMiddleware(schemas.add),
	notificationController.add
)

notificationRouter.put('/:notificationId',
	authMiddleware,
	imageParserForField('photos'),
	validatorMiddleware(schemas.update),
	notificationController.update
)

notificationRouter.delete('/:notificationId',
	authMiddleware,
	notificationController.remove
)

module.exports = notificationRouter
