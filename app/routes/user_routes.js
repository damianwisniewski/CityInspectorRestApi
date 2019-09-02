/* eslint-disable prettier/prettier */
const { Router } = require('express')
const userRouter = Router()

// middlewares
const authMiddleware = require('../middlewares/auth_middleware')
const validatorMiddleware = require('../middlewares/data_validation_middleware')

// controller
const userController = require('../controllers/user_controller')

/**
 * @typedef {import('express-validator').Schema} Schema
 */

/**
 * Collection of possible inputs, and its validation and sanitization rules.
 * @type {Schema}
 */
const inputRules = {
	email: {
		in: 'body',
		trim: true,
		isEmail: true,
		normalizeEmail: true,
	},
	
	password: {
		in: 'body',
		trim: true,
		isLength: { options: { min: 8 } },
	},
	
	nickname: {
		in: 'body',
		trim: true,
		matches: { options: ['^[a-ząęśćźćńółżA-ZĄĘŚĆŹĆŃÓŁŻ0-9-._]{2,}$'] },
	},
	
	emailAgreement: {
		in: 'body',
		trim: true,
		isIn: {
			options: ['Y', 'N'],
		},
	},
	
	gender: {
		in: 'body',
		trim: true,
		isIn: {
			options: ['M', 'F'],
		},
		optional: true,
	},
	
	name: {
		in: 'body',
		trim: true,
		isAlpha: { options: ['pl-PL'] },
		optional: true,
	},
	
	surname: {
		in: 'body',
		trim: true,
		matches: { options: ['^[a-ząęśćźćńółżA-ZĄĘŚĆŹĆŃÓŁŻ0-9-]{2,}$'] },
		optional: true,
	},
	
	token: {
		in: 'headers',
		exists: true,
	},
}

/**
 * Collection of schemas created from predefined input rules for each `user` endpoint.
 * @type {Object<string, Schema>}
 */
const schemas = {
	login: {
		email: inputRules.email,
		password: inputRules.password,
	},
	logout: {
		'token-refresh': inputRules.token,
	},
	refresh: {
		'token-refresh': inputRules.token,
	},

	register: {
		email: inputRules.email,
		password: inputRules.password,
		nickname: inputRules.nickname,
		emailAgreement: inputRules.emailAgreement,
		gender: inputRules.gender,
		name: inputRules.name,
		surname: inputRules.surname,
	},

	updateUser: Object.entries({
		email: inputRules.email,
		password: inputRules.password,
		nickname: inputRules.nickname,
		emailAgreement: inputRules.emailAgreement,
		gender: inputRules.gender,
		name: inputRules.name,
		surname: inputRules.surname,
	}).reduce((accumulatedRules, [param, rules]) => {
		const copiedRules = {
			[param]: Object.assign({}, { optional: true }, rules)
		}
		return Object.assign(accumulatedRules, copiedRules)
	}, {}),

	resetPassword: {
		email: inputRules.email,
		newPassword: inputRules.password,
		resetToken: {
			...inputRules.token,
			in: 'body'
		},
	},

	resetPasswordEmail: {
		email: inputRules.email,
	},
}

/**
 * From path `/user`
 */

userRouter.post('/login',
	validatorMiddleware(schemas.login),
	userController.login
)

userRouter.get('/logout',
	validatorMiddleware(schemas.logout),
	authMiddleware,
	userController.logout,
)

userRouter.get('/refresh',
	validatorMiddleware(schemas.refresh),
	authMiddleware,
	userController.refreshToken,
)

userRouter.post('/password',
	validatorMiddleware(schemas.resetPasswordEmail),
	userController.sendResetEmail,
)

userRouter.put('/password',
	validatorMiddleware(schemas.resetPassword),
	userController.resetPassword,
)

userRouter.post('/',
	validatorMiddleware(schemas.register),
	userController.register
)

userRouter.put('/',
	validatorMiddleware(schemas.updateUser),
	authMiddleware,
	userController.updateData,
)

userRouter.get('/',
	authMiddleware,
	userController.getData
)

userRouter.delete('/',
	authMiddleware,
	userController.deleteUser
)

module.exports = userRouter
