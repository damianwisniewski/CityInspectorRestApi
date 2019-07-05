require('dotenv').config()
const PRODUCTION = process.env.NODE_ENV === 'PRODUCTION'

const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors')

const email = require('./services/email')
const photoStorage = require('./services/photoStorage')

const routing = require('./routes')
const app = express()
// const db = require('./database/index')

const webTocken = require('./services/jwtService')

const token = webTocken.create({ a: 'siema' })
console.log(token)

setTimeout(() =>
	console.log(
		webTocken.validate(token)
	), 2000)

app.use(helmet({
	noSniff: true,
	xssFilter: false,
	noCache: true,
	hsts: { force: PRODUCTION },
	hidePoweredBy: true,
	frameguard: false,
}))

app.use(
	cors({
		origin: '*',
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Autorization'],
	})
)

app.use(bodyParser.json()) // body parser for data type "application/json"
app.use(bodyParser.urlencoded({ extended: false })) // body parser for data type "application/x-www-form-urlencoded"
app.use(routing)

/**
 * Error Handler, catches errors passed by 'next(error)'
 * and sends them in response
 */
app.use((err, req, res) => {
	res.status(err.status).json({ message: err.message })
})

/**
 * Verifies connection to all external services.
 * If all of them was correctly initialized then the server will start to listen.
 * In another case, when a connection with some service failed, the server will be closed.
 */
Promise.all([
	// db.sequelize.authenticate(),
	// photoStorage.verify(),
	// email.transporter.verify(),
])
	.then(() => {
		console.log('\nServices connections has been established successfully. \n')
		// db.sequelize.sync()

		app.listen(process.env.PORT || 8080, () => {
			console.log('Server is listening on port: ', process.env.PORT || 8080)
		})
	})
	.catch(err => {
		console.error('Unable to connect to service:', err)
	})
