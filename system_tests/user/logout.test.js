const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../app')
const expect = chai.expect

chai.use(chaiHttp)

describe('[ GET ] /user/logout', () => {
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

	it('should respond with auth error for request without authorization header', done => {
		chai
			.request(app)
			.get('/user/logout')
			.send()
			.end((err, res) => {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(403)
				expect(res.body).to.be.deep.equal({ message: 'You have no permission!' })

				done()
			})
	})

	it('should respond with error (status 412) for request without token-refresh header', done => {
		chai
			.request(app)
			.get('/user/logout')
			.set('authorization', 'Bearer ' + auth.token)
			.send()
			.end((err, res) => {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(412)
				expect(res.body).to.be.deep.equal({
					message: 'Refresh token header is missing, it have to be revoked also',
				})

				done()
			})
	})

	it('should respond with status 204 for successful logout', done => {
		chai
			.request(app)
			.get('/user/logout')
			.set('authorization', 'Bearer ' + auth.token)
			.set('token-refresh', auth.refreshToken)
			.send()
			.end((err, res) => {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(204)
				expect(res.body).to.be.empty

				done()
			})
	})
})
