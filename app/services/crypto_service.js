const crypto = require('crypto')
const { ENCRYPTION_SALT } = require('../config')

module.exports = {
	// Secret key used for encryption input data
	salt: ENCRYPTION_SALT,
	// Encryption algorithm
	algorithm: 'sha256',
	/**
	 * Complexity of encription process
	 * https://support.1password.com/pbkdf2/#about-pbkdf2
	 */
	iterations: 12738,
	keyLength: 64,

	/**
	 * Generates encrypted hash value from passed string data.
	 * @param {string} value
	 * @returns {Promise<string>}
	 */
	generateHashedValue: function(value) {
		return new Promise((resolve, reject) => {
			crypto.pbkdf2(
				value,
				this.salt,
				this.iterations,
				this.keyLength,
				this.algorithm,
				(err, encryptedValue) => {
					return err ? reject(err) : resolve(encryptedValue.toString('hex'))
				},
			)
		})
	},

	/**
	 * Compares value with encrypted value
	 * @param {string} value
	 * @param {string} encryptedValue
	 * @returns {Promise<boolean>}
	 */
	compareHashedValues: function(value, encryptedValue) {
		return new Promise((resolve, reject) => {
			this.generateHashedValue(value)
				.then(encrypted => resolve(encrypted.toString('hex') === encryptedValue))
				.catch(err => reject(err))
		})
	},
}
