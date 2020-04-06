const { Sequelize, models } = require('../models')
const Subscribers = require('../controllers/subscription_controller')

/**
 * Get controller
 * Fetch comments for notification
 */
exports.get = async (req, res, next) => {
	const requestType = req.params.type
	const notificaton = await models.Notification.findByPk(req.params.notificationId)
	let comments

	const options = {
		attributes: [
			'id',
			'text',
			'createdAt',
			'updatedAt',
			[Sequelize.col('User.nickname'), 'nickname'],
		],
		include: [{ model: models.User, attributes: [] }],
	}

	if (requestType === 'single') {
		comments = await notificaton.getComments({ where: { id: req.params.commentId }, ...options })
	} else if (requestType === 'all') {
		comments = await notificaton.getComments({ ...options })
	}

	res.status(200).json(comments)
}

/**
 * Create controller
 * Adds new comments for notification
 */
exports.create = async (req, res, next) => {
	try {
		await req.locals.user.createComment({
			text: req.body.text,
			NotificationId: req.params.notificationId,
		})

		Subscribers.notify(
			req.params.notificationId,
			`Dokonano nowy komentarz do zgłoszenia ${req.params.notificationId}`,
			`${req.body.text}`,
		)

		res.sendStatus(201)
	} catch (err) {
		const validationError =
			err && err.errors[0]
				? {
						info: err.errors[0].message,
						reason: 'not_unique',
						field: err.errors[0].path,
				  }
				: 'Invalid data!'

		next({
			status: 409,
			message: validationError,
			error: { ctx: err, dirname: __dirname },
		})
	}
}

/**
 * Delete controller
 * Removes comment with provided id
 */
exports.delete = async (req, res, next) => {
	try {
		const comment = await req.locals.user.getComments({ where: { id: req.params.commentId } })

		if (comment[0]) {
			await comment[0].destroy()
			res.sendStatus(200)
		} else {
			next({
				status: 401,
				message: 'There is no comment for provided commentId',
				error: { ctx: null, dirname: __dirname },
			})
		}
	} catch (err) {
		next({
			status: 409,
			message: err.message,
			error: { ctx: err, dirname: __dirname },
		})
	}
}

/**
 * Update controller
 * Updated comment with provided id
 */
exports.update = async (req, res, next) => {
	try {
		const comment = await req.locals.user.getComments({ where: { id: req.params.commentId } })

		if (comment[0]) {
			await comment[0].update({
				text: req.body.text,
			})

			res.sendStatus(200)
		} else {
			next({
				status: 401,
				message: 'There is no comment for provided commentId',
				error: { ctx: null, dirname: __dirname },
			})
		}
	} catch (err) {
		next({
			status: 409,
			message: err.message,
			error: { ctx: err, dirname: __dirname },
		})
	}
}
