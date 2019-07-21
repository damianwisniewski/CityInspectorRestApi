// /* eslint-disable camelcase */
// const cloudinary = require('cloudinary').v2
// const envType = process.env.NODE_ENV

// module.exports.verify = () => {
// 	return new Promise((resolve, reject) => {
// 		cloudinary.config({
// 			cloud_name: process.env[`PHOTO_STORAGE_CLOUD_NAME_${envType}`],
// 			api_key: process.env[`PHOTO_STORAGE_API_KEY_${envType}`],
// 			api_secret: process.env[`PHOTO_STORAGE_API_SECRET_${envType}`],
// 		})

// 		cloudinary.api.ping((error, result) => {
// 			if (error) {
// 				reject(error)
// 			} else {
// 				resolve(result)
// 			}
// 		})
// 	})
// }
