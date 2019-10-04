/* eslint-disable prettier/prettier */
const { Router } = require('express')
const commentRouter = Router()

const { models } = require('../models')

// middlewares
const authMiddleware = require('../middlewares/auth_middleware')
const validatorMiddleware = require('../middlewares/data_validation_middleware')

// controller
const commentController = require('../controllers/comment_controller')

/**
 * @typedef {import('express-validator').Schema} Schema
 */

/**
 * Collection of possible inputs, and its validation and sanitization rules.
 * @type {Schema}
 */
const inputRules = {
	text: {
		in: 'body',
		exists: true,
	},
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
 * From path [/comment]
 */

/**
 * Get all comments for notification
 */
commentRouter.get('/:notificationId/:type(all)',
	validatorMiddleware({ notificationId: inputRules.notificationId }),
	commentController.get,
)

/**
 * Get single comment for provided id
 */
commentRouter.get('/:notificationId/:type(single)/:commentId',
	validatorMiddleware({ notificationId: inputRules.notificationId }),
	commentController.get
)

/**
 * Creates new comment for notification
 */
commentRouter.post('/:notificationId/',
	authMiddleware,
	validatorMiddleware(inputRules),
	commentController.create
)

/**
 * Deletes single comment for provided id
 */
commentRouter.delete('/:commentId',
	authMiddleware,
	commentController.delete
)

/**
 * Updates comment for provided id
 */
commentRouter.put('/:commentId',
	authMiddleware,
	validatorMiddleware({ text: inputRules.text }),
	commentController.update
)

module.exports = commentRouter
