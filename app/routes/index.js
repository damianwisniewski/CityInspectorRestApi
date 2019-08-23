const { Router } = require('express')
const routing = Router()

const userRouter = require('./user_routes')
const notificationRouter = require('./notification_routes')
const subscriptionRouter = require('./subscription_routes')

routing.use('/user', userRouter)
routing.use('/notification', notificationRouter)
routing.use('/subscription', subscriptionRouter)

module.exports = routing
