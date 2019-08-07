const chai = require('chai')
const chaiHttp = require('chai-http')
const restAPI = require('../app')

const should = chai.should()
chai.use(chaiHttp)

describe('User', () => {
	const email = 'test@example.org'
	const password = 'test123'

	let auth

	before((done) => {
		chai.request(restAPI)
			.post('/user/login')
			.send({ email, password })
			.end((err, res) => {
				auth = res.body
				done()
			})
	})

	after(() => {
		// process.exit(0)
	})

	it('"GET" /user should', (done) => {
		chai.request(restAPI)
			.get('/user')
			.set('authorization', 'Bearer ' + auth)
			.end(function (err, res) {
				should.not.exist(err)

				res.should.have.status(200)
				res.body.should.have.keys(
					'name',
					'email',
					'emailAgreement',
					'gender',
					'nickname',
					'surname'
				)
				res.body.email.should.be.string(email)

				done()
			});
	})
})