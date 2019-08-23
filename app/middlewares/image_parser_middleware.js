const multer = require('multer')

/**
 * Filters files with sets
 * @param {Request} req
 * @param {Response} file
 * @param {Function} cb
 */
const fileFilter = (req, file, cb) => {
	if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
		return cb(new Error('Invalid file format!'), false)
	}
	cb(null, true)
}

/**
 * Configuration of multer uploader
 */
const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 6e6, // 6MB
	},
	fileFilter,
})

/**
 * body-parser doesn't handle multipart bodies, due to their complex.
 * That's why I had to create, multipart body parser using multer.
 */
module.exports = (fieldName, maxAmount = 5) => (req, res, next) => {
	upload.array(fieldName, maxAmount)(req, res, function(err) {
		if (err) {
			if (err.code === 'LIMIT_FILE_SIZE') {
				next({ status: 413, message: err.message })
			} else {
				next({ status: 417, message: err.message })
			}
		}

		next()
	})
}
