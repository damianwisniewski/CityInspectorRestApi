const jwt = require('jsonwebtoken')
const uuid = require('uuid/v1')

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

module.exports = {
	/**
	 * Blacklist for valid, but revoked tokens
	 */
	blacklist: new Map(),

	/**
	 * Interval timer, to keep blacklist clear from expired tokens
	 */
	loopInterval: null,

	/**
	 * Creates JWT for auth and refresh token to be able to refresh the auth one
	 * @param {Object} payload - to pass to encode in JWT
	 * @returns {{
	 * 	token: string,
	 * 	expiresIn: number,
	 * 	refreshToken: string,
	 * }}
	 */
	create: function (payload) {
		const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1h', jwtid: uuid() })
		const { exp, jti } = jwt.decode(token)
		const refreshToken = jwt.sign({ tokenId: jti }, JWT_SECRET_KEY, { expiresIn: '2h' })

		return {
			token,
			expiresIn: exp,
			refreshToken
		}
	},

	/**
	 * Validates passed token and returns it's payload,
	 * for case of invalid, it throws error
	 * @param {string} token
	 * @returns payload decoded from JWT
	 */
	validate: function (token) {
		if (this.blacklist.has(token)) {
			throw { message: 'token expired' }
		}

		return jwt.verify(token, JWT_SECRET_KEY)
	},

	/**
	 * Refreshes tokens.
	 * It starts from validates tokens, if they are correct, revokes them and creates new one.
	 * In other case, for invalid tokens it will trhow error 
	 * @param {string} token 
	 * @param {string} refreshToken 
	 */
	refresh: function (token, refreshToken) {
		let tokenPayload

		try {
			const refresh = this.validate(refreshToken)
			// eslint-disable-next-line no-unused-vars
			const { iat, exp, jti, ...payload } = jwt.decode(token)

			tokenPayload = payload

			if (jti !== refresh.tokenId) throw { message: 'invalid token' }

		} catch (err) {
			throw { status: 401, message: err.message }
		}

		this.revoke(token, refreshToken)

		return this.create(tokenPayload)
	},

	/**
	 * Revokes passed tockens, by pass them to blacklist
	 * @param  {...string} tokens 
	 */
	revoke: function (...tokens) {
		tokens.forEach(token => {
			const { exp: expiresIn } = jwt.decode(token)
			this.blacklist.set(token, expiresIn)
		})

		this.cleanupExpired()
	},

	/**
	 * Creates interval to remove exired tokens from blacklist
	 */
	cleanupExpired: function () {
		if (this.loopInterval) return

		this.loopInterval = setInterval(() => {
			const actualDate = new Date().valueOf()

			if (this.blacklist.size) {
				for (const [token, expiresIn] of this.blacklist.entries()) {
					if (actualDate > expiresIn) {
						this.blacklist.delete(token)
					}
				}
			} else {
				clearInterval(this.loopInterval)
			}
		}, 1000 * 60 * 3)
	},
}