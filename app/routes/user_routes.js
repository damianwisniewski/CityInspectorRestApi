const { Router } = require('express')
const userRouter = Router()

const authService = require('../services/auth_service')
const {
	login,
	getData,
	logout,
	register,
	updateData,
	refreshToken,
	resetPassword
} = require('../controllers/user_controller')

/**
 * From path [/user]
 */
userRouter.post('/login', login)
userRouter.get('/logout', authService, logout)
userRouter.get('/refresh', authService, refreshToken)
userRouter.get('/reset_password', resetPassword)
userRouter.post('/', register)
userRouter.put('/', authService, updateData)
userRouter.get('/', authService, getData)

module.exports = userRouter