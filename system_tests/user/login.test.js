const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../app')
const expect = chai.expect

chai.use(chaiHttp)

describe('[ POST ] /user/login', () => {
	const email = 'test@example.org'
	const password = 'tester123'

	it('should send auth tokens in response', done => {
		chai
			.request(app)
			.post('/user/login')
			.send({ email, password })
			.end((err, res) => {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(200)
				expect(res.body).to.have.keys('token', 'expiresIn', 'refreshToken', 'email', 'nickname')

				done()
			})
	})

	it('should respond with 401 status and error message for incorrect data', done => {
		chai
			.request(app)
			.post('/user/login')
			.send({
				email: 'fake',
				password: 'invalid',
			})
			.end((err, res) => {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(422)
				expect(res.body).to.be.deep.equal({
					message: { info: 'Invalid value', field: 'body/email' },
				})

				done()
			})
	})

	it('should respond with 422 status and error message for no passed email and password', done => {
		chai
			.request(app)
			.post('/user/login')
			.send()
			.end((err, res) => {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(422)
				expect(res.body).to.be.deep.equal({
					message: { info: 'Invalid value', field: 'body/email' },
				})

				done()
			})
	})
})
