const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors')

const routing = require('./routes')

const db = require('./models')

const photoStorage = require('./services/photo_storage_service')
const emailClient = require('./services/email_service')

const app = express()

app.use(
	helmet({
		noSniff: true,
		xssFilter: true,
		noCache: true,
		hsts: true,
		hidePoweredBy: true,
		frameguard: false,
	}),
)

app.use(
	cors({
		origin: ['http://localhost:8888', 'http://127.0.0.1:5500'],
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Autorization', 'Token-Refresh'],
	}),
)

app.use(bodyParser.json()) // body parser for data type "application/json"
app.use(bodyParser.urlencoded({ extended: false })) // body parser for data type "application/x-www-form-urlencoded"
app.use(routing)

/**
 * Error Handler, catches errors passed by 'next(error)'
 * and sends them in response
 */
app.use((err, req, res, next) => {
	res.status(err.status).json({ message: err.message })
})

/**
 * Verifies connection to all external services.
 * If all of them was correctly initialized then the server will start to listen.
 * In another case, when a connection with some service failed, the server will be closed.
 */
Promise.all([db.sequelize.authenticate(), photoStorage.connect(), emailClient.connect()])
	.then(() => {
		console.log('\nServices connections has been established successfully. \n')
		db.sequelize.sync()

		app.listen(process.env.PORT || 8080, () => {
			console.log('Server is listening on port: ', process.env.PORT || 8080)
		})
	})
	.catch(err => {
		console.error('Unable to connect to service:', err)
	})

/**
 * exports for test purposes
 */
module.exports = app
