const { Router } = require('express')
const userRouter = Router()

const { getUsers } = require('../controllers/user_controller')

userRouter.post('/get', getUsers)


module.exports = userRouter