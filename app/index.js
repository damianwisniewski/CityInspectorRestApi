require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
// TODO: morgan npm

const email = require('./services/email')
const photoStorage = require('./services/photoStorage')

const app = express()

const db = require('./database/index')

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
	db.sequelize.authenticate(),
	// photoStorage.verify(),
	// email.transporter.verify(),
])
	.then(() => {
		console.log('\nServices connections has been established successfully. \n')
		db.sequelize.sync()
		// setTimeout(() => {
		// 	db.models.User.generateHash('sssssss').then(hashed => {
		// 		console.warn(hashed)

		// 		db.models.User.create({
		// 			name: 'dom',
		// 			surname: 'test',
		// 			gender: 'M',
		// 			nickname: 'nic',
		// 			email: 'dada@ooo.pl',
		// 			password: hashed,
		// 			privateData: 'N',
		// 			emailAgreement: 'N'
		// 		})
		// 	})
		// }, 5000)

		setTimeout(() => {
			db.models.User.findByPk(1).then(user => {
				user.validPassword('sssssss').then(isValid => {
					console.log('isValid ', isValid)
				})
			})
		}, 5000)

		app.listen(process.env.PORT || 8080, () => {
			console.log('Server is listening on port: ', process.env.PORT || 8080)
		})
	})
	.catch(err => {
		console.error('Unable to connect to service:', err)
	})
