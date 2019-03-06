require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const database = require('./services/database')
const email = require('./services/email')
const photoStorage = require('./services/photoStorage')

const app = express()

app.use(bodyParser.json()) // body parser for data type "application/json"
app.use(
	cors({
		origin: '*',
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Autorization'],
	})
)

/**
 * Verifies connection to all external services.
 * If all of them was correctly initialized then the server will start to listen.
 * In another case, when a connection with some service failed, the server will be closed.
 */
Promise.all([
	database.authenticate(),
	photoStorage.verify(),
	email.transporter.verify(),
])
	.then(() => {
		console.log('\nServices connections has been established successfully. \n')

		app.listen(process.env.PORT || 8080, () => {
			console.log('Server is listening on port: ', process.env.PORT || 8080)
		})
	})
	.catch(err => {
		console.error('Unable to connect to service:', err)
	})
