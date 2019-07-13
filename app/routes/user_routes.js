const { Router } = require('express')
const userRouter = Router()

const authService = require('../services/authService')
const { login, getData, logout, register, updateData, refreshToken } = require('../controllers/user_controller')


userRouter.post('/login', login)
userRouter.get('/logout', authService, logout)
userRouter.get('/refresh', authService, refreshToken)
userRouter.post('/', register)
userRouter.put('/', authService, updateData)
userRouter.get('/', authService, getData)


module.exports = userRouter