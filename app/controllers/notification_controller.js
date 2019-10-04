const uuid = require('uuid/v4')
const { Sequelize, sequelize, models } = require('../models')
const { removeUndefinedProperties } = require('../utils/app_helpers/helpers')

const Op = Sequelize.Op

/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

/**
 *
 * @param {Request} req
 * @param {string} tag to assign in coudinary api, this will let easy find any of photos.
 * @returns {Object} Notification datas
 */
const prepareCompleteNotificationData = async (req, tag) => {
	const { category, status } = req.body

	/**
	 * Trying to get category and status ID istead of name
	 */
	const categoryData = category ? await models.Category.findOne({ where: { name: category } }) : {}
	const statusData = status ? await models.Status.findOne({ where: { name: status } }) : {}

	const notificationData = removeUndefinedProperties({
		CategoryId: categoryData.id,
		StatusId: statusData.id,
		title: req.body.title,
		description: req.body.description,
	})

	const localizationData = removeUndefinedProperties({
		lat: req.body.lat,
		lon: req.body.lon,
		city: req.body.city,
		street: req.body.street,
		number: req.body.number,
		post: req.body.post,
	})

	return {
		...(notificationData && { notification: notificationData }),
		...(localizationData && { localization: localizationData }),
		photo: { tag },
	}
}

/**
 * GetMany controller
 * Fetch many notifications.
 * Looking for param "type", if it's value equal:
 * "all" - looking for all notifications of all users
 * "own" - looking for all owned notification (created by self)
 * @type {RequestHandler}
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
			{ model: models.Localization, attributes: ['lon', 'lat', 'city'] },
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
 * @type {RequestHandler}
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
				attributes: ['lon', 'lat', 'city', 'street', 'number', 'post'],
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

/**
 * Add controller
 * Ads single notification of passed id
 * @type {RequestHandler}
 */
exports.add = async (req, res, next) => {
	const notificationUUID = uuid()
	const notificationData = await prepareCompleteNotificationData(req, notificationUUID)

	if (!notificationData.notification.CategoryId || !notificationData.notification.StatusId) {
		return next({
			status: 400,
			message: 'You have passed incorrect category or status',
			error: { ctx: null, dirname: __dirname },
		})
	}

	/**
	 * Because of complexity of query, related to a few tables there is a lot possibilities to fail.
	 * Not only type validation but also integration with cloudinary api.
	 * Transaction give as possibility to easy rollback all queries if something would fail.
	 */
	let transaction
	let notification

	try {
		transaction = await sequelize.transaction()

		notification = await req.locals.user.createNotification(
			{
				id: notificationUUID,
				...notificationData.notification,
				Photo: notificationData.photo,
				Localization: notificationData.localization,
			},
			{
				transaction,
				include: [
					'Localization',
					{
						model: models.Photo,
						newPhotos: req.files,
					},
				],
			},
		)

		/**
		 * Sends photos to coudinary storage, if all satabase queries pass, without any problem.
		 */
		await notification.Photo.commitPhotos()

		transaction.commit()
		res.status(204).json()
	} catch (err) {
		/**
		 * Transaction failed with error
		 * Reverting all changes that have been done during it
		 */
		notification && (await notification.Photo.revertPhotos())
		transaction.rollback()

		const validationError = err.errors[0]
			? {
					info: err.errors[0].message,
					reason: 'not_unique',
					field: err.errors[0].path,
			  }
			: 'Invalid data!'

		next({
			status: 409,
			message: validationError,
			error: { ctx: err.errors[0], dirname: __dirname },
		})
	}
}

/**
 * Update controller
 * Update single notification of passed id
 * @type {RequestHandler}
 */
exports.update = async (req, res, next) => {
	const notificationUUID = req.params.notificationId
	const notificationData = await prepareCompleteNotificationData(req, notificationUUID)

	/**
	 * Because of complexity of query, related to a few tables there is a lot possibilities to fail.
	 * Not only type validation but also integration with cloudinary api.
	 * Transaction give as possibility to easy rollback all queries if something would fail.
	 */
	let transaction
	let notification

	try {
		transaction = await sequelize.transaction()

		notification = await models.Notification.findByPk(notificationUUID, {
			include: ['Localization', 'Photo'],
		})

		const photos = notification.get('Photo')
		const localization = notification.get('Localization')

		if (notificationData.notification) {
			await notification.update(notificationData.notification, { transaction })
		}

		if (notificationData.photo || req.body.deletePhotos || req.files) {
			await photos.update(notificationData.photo, {
				transaction,
				newPhotos: req.files,
				deletePhotos: req.body.deletePhotos,
			})
		}

		if (notificationData.localization) {
			await localization.update(notificationData.localization, { transaction })
		}

		await notification.Photo.commitPhotos()
		transaction.commit()
		res.status(204).json()
	} catch (err) {
		/**
		 * Transaction failed with error
		 * Reverting all changes that have been done during it
		 */
		await notification.Photo.revertPhotos()
		transaction.rollback()

		const validationError = err.errors[0]
			? {
					info: err.errors[0].message,
					reason: 'not_unique',
					field: err.errors[0].path,
			  }
			: 'Invalid data!'

		next({
			status: 409,
			message: validationError,
			error: { ctx: err.errors[0], dirname: __dirname },
		})
	}
}

/**
 * Remove controller
 * Remove single notification of passed id
 * @type {RequestHandler}
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
