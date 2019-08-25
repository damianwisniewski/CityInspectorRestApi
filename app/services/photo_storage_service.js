/* eslint-disable camelcase */
const cloudinary = require('cloudinary').v2
const { PHOTO_STORAGE_CONFIG } = require('../config')

module.exports = {
	/**
	 * Connects to cloudinary api and checks if connection works fine.
	 * @returns {Promise}
	 */
	connect: function() {
		return new Promise((resolve, reject) => {
			cloudinary.config(PHOTO_STORAGE_CONFIG)
			cloudinary.api.ping((error, result) => {
				if (error) {
					reject(error)
				}

				resolve(result)
			})
		})
	},

	/**
	 * Get resources from external storage
	 * @param {string} NotificationId - used to find proper resources (during save resources all are saved with tag equal NotificationId)
	 * @returns {Promise<Object>}
	 */
	get: function(NotificationId) {
		return new Promise((resolve, reject) => {
			if (NotificationId) {
				cloudinary.api.resources_by_tag(NotificationId, function(error, result) {
					if (error) {
						reject(error)
					}
					resolve(result)
				})
			} else {
				reject("You didn't pass proper NotificationId for remove method in photo storage service")
			}
		})
	},

	/**
	 * Get resources from external storage
	 * @param {string|string[]} NotificationId - used to find proper resources (during save resources all are saved with tag equal NotificationId)
	 * @returns {Promise<Object>}
	 */
	remove: function(NotificationId) {
		/**
		 * delete_resources accepts boolean value as first argument also, but true value will delete all resources in storage!
		 * That's why it's safier to prevent bool value
		 */
		return new Promise((resolve, reject) => {
			if (typeof NotificationId === 'string' || Array.isArray(NotificationId)) {
				cloudinary.api.delete_resources(NotificationId, function(error, result) {
					if (error) {
						reject(error)
					}
					resolve(result)
				})
			} else {
				reject("You didn't pass proper NotificationId for remove method in photo storage service")
			}
		})
	},

	/**
	 * Sends file to external storage
	 * @param {Object|...Object} file - data object of parsed image
	 * @param {string} NotificationId - used for tags to be able to easy find it by api request
	 * and catalog name where image should be saved (catalog will be created if doesn't exist)
	 * @returns {Promise<Object>}
	 */
	send: function(file, NotificationId) {
		if (NotificationId && Array.isArray(file) && file.length <= 5 && !file.some(Array.isArray)) {
			return Promise.all(file.map(separateFile => this.send(separateFile, NotificationId)))
		}

		return new Promise((resolve, reject) => {
			if (file && file.buffer && NotificationId) {
				const encodedImage = file.buffer.toString('base64')

				cloudinary.uploader.upload(
					`data:${file.mimetype};base64,${encodedImage}`,
					{
						public_id: Date.now(),
						tags: NotificationId,
						folder: `city_inspector/${NotificationId}`,
					},
					function(error, result) {
						if (error) {
							reject(error)
						}
						resolve(result)
					},
				)
			} else {
				reject("You didn't pass proper params")
			}
		})
	},
}
