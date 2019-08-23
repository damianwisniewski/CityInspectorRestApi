const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../app')
const expect = chai.expect

chai.use(chaiHttp)

describe('[ GET ] /user', () => {
	const email = 'test@example.org'
	const password = 'test123'

	let auth

	before(done => {
		chai
			.request(app)
			.post('/user/login')
			.send({ email, password })
			.end((err, res) => {
				auth = res.body
				done()
			})
	})

	it('should respond with status 403, for no authorization header in request', done => {
		chai
			.request(app)
			.get('/user')
			.end(function(err, res) {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(403)
				expect(res.body).to.be.deep.equal({ message: 'You have no permission!' })

				done(err)
			})
	})

	it('should respond with status 200 and user data in body', done => {
		chai
			.request(app)
			.get('/user')
			.set('authorization', 'Bearer ' + auth.token)
			.end(function(err, res) {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(200)
				expect(res.body).to.have.keys(
					'name',
					'email',
					'emailAgreement',
					'gender',
					'nickname',
					'surname',
				)

				done(err)
			})
	})
})
