const { Sequelize, models } = require('../models')
const photoStorage = require('../services/photo_storage_service')

const Op = Sequelize.Op

/**
 * GetMany controller
 * Fetch subscription for notification changes
 */
exports.getMany = async (req, res, next) => {
	const requestType = req.params.for
	const queriesExists = Boolean(Object.values(req.query).length)
	const options = {
		attributes: ['id', 'title', 'description', 'createdAt'],
		include: [
			{ model: models.Status, attributes: ['name'] },
			{ model: models.Category, attributes: ['name'] },
			{ model: models.Localization, attributes: ['lan', 'lat', 'city'] },
		],
	}

	let queries
	let notifications

	if (queriesExists) {
		queries = { ...req.query }

		for (const key in queries) {
			if (queries.hasOwnProperty(key) && Array.isArray(queries[key])) {
				queries[key] = { [Op.and]: queries[key] }
			}
		}
	}

	if (requestType === 'all') {
		// All notification
		try {
			notifications = queriesExists
				? await models.Notification.findAll({ where: queries, ...options })
				: await models.Notification.findAll({ ...options })
		} catch (err) {
			notifications = []
		}
	} else {
		// Notifcations of logged user
		try {
			notifications = queriesExists
				? await req.locals.user.getNotifications({ where: queries, ...options })
				: await req.locals.user.getNotifications({ ...options })
		} catch (err) {
			notifications = []
		}
	}

	notifications = notifications.map(notification => ({
		id: notification.id,
		title: notification.title,
		description: notification.description,
		createdAt: notification.createdAt,
		localization: notification.Localization,
		status: notification.Status.name,
		category: notification.Category.name,
	}))

	res.status(200).json(notifications.length ? notifications : [])
}

/**
 * GetSingle controller
 * Fetch subscription for notification changes
 */
exports.getSingle = async (req, res, next) => {
	const notificationId = req.params.notificationId

	const notification = await models.Notification.findOne({
		where: { id: notificationId },
		attributes: ['id', 'title', 'description'],
		include: [
			{
				model: models.Localization,
				attributes: ['lan', 'lat', 'city', 'street', 'number', 'post'],
			},
			{
				model: models.Photo,
				attributes: ['photo1', 'photo2', 'photo3', 'photo4', 'photo5'],
			},
			{
				model: models.Status,
				attributes: ['name'],
			},
			{
				model: models.Category,
				attributes: ['name'],
			},
			{
				model: models.User,
				attributes: ['nickname'],
			},
		],
	})

	if (notification) {
		res.status(200).json({
			id: notification.id,
			title: notification.title,
			description: notification.description,
			localization: notification.Localization,
			photos: Object.values(notification.Photo.dataValues).filter(value => value),
			status: notification.Status.name,
			category: notification.Category.name,
			user: notification.User.nickname,
		})
	} else {
		res.status(200).json([])
	}
}

exports.add = (req, res, next) => {}

exports.update = (req, res, next) => {}

exports.remove = async (req, res, next) => {
	const notificationId = req.params.notificationId

	try {
		const isDestroyed = Boolean(
			await models.Notification.destroy({
				where: {
					id: notificationId,
					UserId: req.locals.user.id,
				},
			}),
		)

		isDestroyed
			? res.status(200).send()
			: next({ status: 404, message: 'Notification does not exist or you are not the owner!' })
	} catch (err) {
		next({ status: 400, message: 'Notification delete failed!' })
	}
}
