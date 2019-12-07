const { Sequelize, models } = require('../models')
const mailClient = require('../services/email_service')

/**
 * Get controller
 * Fetch subscription for notification changes
 */
exports.get = async (req, res, next) => {
	const user = req.locals.user
	const subscriptionId = req.params.subscriptionId
	const queries = req.query

	const subscriptions = subscriptionId
		? await user.getSubscriptions({ where: { ...queries, id: subscriptionId } })
		: await user.getSubscriptions({ where: { ...queries } })

	res.status(200).json(subscriptions)
}

/**
 * Add controller
 * Adds subscription for notification changes
 */
exports.add = async (req, res, next) => {
	const user = req.locals.user
	const NotificationId = req.params.notificationId

	try {
		const NotificationBelongsToUser = await user.getNotifications({
			where: { id: NotificationId },
		})
		const AlreadySubscribed = await user.getSubscriptions({ where: { NotificationId } })

		if (NotificationBelongsToUser.length || AlreadySubscribed.length) {
			return next({
				status: 400,
				message: "It's your notify or you already subscribed",
				error: { dirname: __dirname },
			})
		}

		const subscription = await user.createSubscription({ NotificationId })

		res.status(201).json({
			subscriptionId: subscription.id,
		})
	} catch (err) {
		next({
			status: 401,
			message: 'Invalid data!',
			error: { ctx: err, dirname: __dirname },
		})
	}
}

/**
 * Remove controller
 * Removes subscription for notification changes
 */
exports.remove = async (req, res, next) => {
	const user = req.locals.user
	const subscriptionId = req.params.subscriptionId
	const subscriptions = subscriptionId
		? await user.getSubscriptions({ where: { id: subscriptionId } })
		: []

	if (subscriptions.length) {
		try {
			await subscriptions[0].destroy()
			res.status(204).send()
		} catch (err) {
			next({
				status: 417,
				message: 'Delete request failed!',
				error: { ctx: err, dirname: __dirname },
			})
		}
	} else {
		next({
			status: 404,
			message: 'Subscription not found!',
			error: { dirname: __dirname },
		})
	}
}

/**
 * Function for notify all subscribents
 */
exports.notify = async (id, changes) => {
	const notif = await models.Notification.findByPk(id)
	const subscribers = await notif.getSubscriptions({
		attributes: {
			include: [
				[Sequelize.col('User.email'), 'email'],
				[Sequelize.col('User.emailAgreement'), 'emailAgreement'],
			],
		},
		include: [models.User],
	})

	subscribers.forEach(sub => {
		if (sub.get('emailAgreement') === 'Y') {
			mailClient.sendMessage({
				to: sub.get('email'),
				subject: 'Zmiany w: ' + notif.title,
				text: '',
				html: '',
			})
		}

		subscribers.update({
			changes: sub.get('changes') + `${changes}$$`,
		})
	})
}
