const { Router } = require('express')
const routing = Router()

const userRouter = require('./user_routes')
const notificationRouter = require('./notification_routes')
const subscriptionRouter = require('./subscription_routes')
const commentRouter = require('./comment_routes')

routing.use('/user', userRouter)
routing.use('/notification', notificationRouter)
routing.use('/subscription', subscriptionRouter)
routing.use('/notification', notificationRouter)
routing.use('/comment', commentRouter)

module.exports = routing
