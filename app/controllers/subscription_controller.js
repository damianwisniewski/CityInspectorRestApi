const { Sequelize, models } = require('../models')
const mailClient = require('../services/email_service')

exports.get = async (req, res, next) => {
	const user = req.locals.user
	const subscriptionId = req.params.subscriptionId

	const subscriptions = subscriptionId
		? await user.getSubscriptions({ where: { id: subscriptionId } })
		: await user.getSubscriptions()

	res.status(200).json(subscriptions)
}

exports.add = async (req, res, next) => {
	const user = req.locals.user
	const NotificationId = req.query.notification

	if (NotificationId) {
		const NotificationBelongsToUser = await user.getNotifications({ where: { id: NotificationId } })
		const AlreadySubscribed = await user.getSubscriptions({ where: { NotificationId } })

		if (
			NotificationBelongsToUser.length
			|| AlreadySubscribed.length
		) {
			return next({ status: 403, message: 'It\'s your notify or you already subscribed' })
		}

		user.createSubscription({ NotificationId })
			.then(() => {
				res.status(201).send()
			})
			.catch(() => {
				next({ status: 400, message: 'Invalid data!' })
			})
	}
}

exports.remove = async (req, res, next) => {
	const user = req.locals.user
	const subscriptionId = req.params.subscriptionId
	const subscriptions = (
		subscriptionId
		&& await user.getSubscriptions({ where: { id: subscriptionId } })
	)

	if (subscriptions.length) {
		subscriptions[0].destroy()
			.then(() => {
				res.status(204).send()
			})
			.catch(() => {
				next({ status: 417, message: 'Delete request failed!' })
			})
	} else {
		next({ status: 404, message: 'Subscription not found!' })
	}
}

/**
 * Method for notify all subscribents
 */
exports.notify = async (id, changes) => {
	const notif = await models.Notification.findByPk(id)
	const subscribers = await notif.getSubscriptions({
		attributes: {
			include: [
				[Sequelize.col('User.email'), 'email'],
				[Sequelize.col('User.emailAgreement'), 'emailAgreement'],
			]
		},
		include: [models.User]
	})

	subscribers.forEach(sub => {
		if (sub.get('emailAgreement') === 'Y') {
			mailClient.sendMessage({
				to: sub.get('email'),
				subject: 'Zmiany w: ' + notif.title,
				text: '',
				html: ''
			})
		}

		subscribers.update({
			changes: sub.get('changes') + `$${changes}$`
		})
	})
}
