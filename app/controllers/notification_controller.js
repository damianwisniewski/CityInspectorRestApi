const { Sequelize, models } = require('../models')
const helper = require('../utils/app_helpers/helpers')

const photoStorage = require('../services/photo_storage_service')

// const multer = require('multer')
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage }).array('photos', 2);

module.exports = {
	/**
	 * Get controller
	 * Fetch subscription for notification changes
	 */
	get: async (req, res, next) => {
		const subscriptionId = req.params.notificationId

		const siema = await models.Notification.findAll()
		console.warn(siema.length)
		res.json(siema)
		// const subscriptions = subscriptionId
		// 	? await user.getSubscriptions({ where: { id: subscriptionId } })
		// 	: await user.getSubscriptions()

		// res.status(200).json(subscriptions)
	},

	add: (req, res, next) => {
		const user = req.locals.user
		console.warn(req.files)
		// console.warn(req)

		// upload(req, res, function (err) {
		// 	if (err instanceof multer.MulterError) {
		// 		// A Multer error occurred when uploading.
		// 		console.error(err)
		// 	} else if (err) {
		// 		// An unknown error occurred when uploading.
		// 		console.error(err)
		// 	}
		// 	console.warn('HEJ')
		// 	const subscriptionId = req.params.notificationId

		// 	// const siema = await models.Notification.findAll()
		// 	// console.warn(siema.length)
		// 	res.send()
		// 	// Everything went fine.
		// })
		// user.createNotification({

		// })

		// upload(req, res, function (err) {
		// 	console.log(req.body);
		// 	if (err) {
		// 		return res.end("Error uploading file.");
		// 	}

		// photoStorage.send(req.files[0], 'ddd')
		photoStorage.get('sss').then(err => console.warn(err))
		// 	res.end("File is uploaded");
		// });
		// upload.single('one')
		// res.status(200).send()
	},

	update: (req, res, next) => {},

	remove: (req, res, next) => {},
}
