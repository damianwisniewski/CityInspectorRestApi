const { Router } = require('express')
const userRouter = Router()

const authService = require('../middlewares/auth_middleware')
const {
	login,
	getData,
	logout,
	register,
	updateData,
	refreshToken,
	sendResetEmail,
	resetPassword,
	deleteUser,
} = require('../controllers/user_controller')

/**
 * From path [/user]
 */
userRouter.post('/login', login)
userRouter.get('/logout', authService, logout)
userRouter.get('/refresh', authService, refreshToken)
userRouter.get('/password', sendResetEmail)
userRouter.post('/password', resetPassword)
userRouter.post('/', register)
userRouter.put('/', authService, updateData)
userRouter.get('/', authService, getData)
userRouter.delete('/', authService, deleteUser)

module.exports = userRouter
