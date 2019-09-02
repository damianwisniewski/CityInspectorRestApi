const uuid = require('uuid/v1')
const { Sequelize, models } = require('../models')
const photoStorage = require('../services/photo_storage_service')

const Op = Sequelize.Op

/**
 * GetMany controller
 * Fetch many notifications.
 * Looking for param "type", if it's value equal:
 * "all" - looking for all notifications of all users
 * "own" - looking for all owned notification (created by self)
 */
exports.getMany = async (req, res, next) => {
	const requestType = req.params.type
	const queriesExists = Boolean(Object.values(req.query).length)
	const options = {
		attributes: [
			'id',
			'title',
			'description',
			'createdAt',
			[Sequelize.col('Status.name'), 'status'],
			[Sequelize.col('Category.name'), 'category'],
		],
		include: [
			'Status',
			'Category',
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
		status: notification.status,
		category: notification.category,
		localization: notification.Localization,
	}))

	res.status(200).json(notifications)
}

/**
 * GetSingle controller
 * Get single notification of passed id
 */
exports.getSingle = async (req, res, next) => {
	const notificationId = req.params.notificationId

	const notification = await models.Notification.findOne({
		where: { id: notificationId },
		attributes: [
			'id',
			'title',
			'description',
			[Sequelize.col('Status.name'), 'status'],
			[Sequelize.col('Category.name'), 'category'],
			[Sequelize.col('User.nickname'), 'user'],
		],
		include: [
			{
				model: models.Localization,
				attributes: ['lan', 'lat', 'city', 'street', 'number', 'post'],
			},
			{
				model: models.Photo,
				attributes: ['photo1', 'photo2', 'photo3', 'photo4', 'photo5'],
			},
			'Status',
			'Category',
			'User',
		],
	})

	if (notification) {
		res.status(200).json({
			id: notification.id,
			title: notification.title,
			description: notification.description,
			localization: notification.Localization,
			photos: Object.values(notification.Photo.dataValues).filter(value => value),
			status: notification.status,
			category: notification.category,
			user: notification.user,
		})
	} else {
		res.status(200).json(null)
	}
}

exports.add = async (req, res, next) => {
	const { category, status, title, description, ...localization } = req.body

	const notificationUUID = uuid()
	let categoryId
	let statusId
	let photos

	try {
		categoryId = await models.Category.findOne({ where: { name: category } })
		statusId = await models.Status.findOne({ where: { name: status } })
		const dbPhotoObj = await photoStorage.send(req.files, notificationUUID)

		photos = dbPhotoObj.reduce((accumulator, currentValue, currentIndex) => {
			accumulator[`photo${currentIndex + 1}`] = currentValue.secure_url
		}, {})
	} catch (err) {
		next({
			status: 400,
			message: 'Invalid data!',
			error: { ctx: err, dirname: __dirname },
		})
	}

	console.warn(typeof localization.lan)

	const cos = await req.locals.user.createNotification(
		{
			id: notificationUUID,
			title,
			description,
			CategoryId: categoryId,
			StatusId: statusId,
			Localization: localization,
			Photo: photos,
		},
		{
			include: ['Localization', 'Photo'],
		},
	)

	res.status(200).json(cos)
}

exports.update = async (req, res, next) => {
	const notificationId = req.params.notificationId
}

/**
 * Remove controller
 * Remove single notification of passed id
 */
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
			: next({
					status: 404,
					message: 'Notification does not exist or you are not the owner!',
					error: {
						dirname: __dirname,
					},
			  })
	} catch (err) {
		next({
			status: 400,
			message: 'Notification delete failed!',
			error: { ctx: err, path: __dirname },
		})
	}
}
