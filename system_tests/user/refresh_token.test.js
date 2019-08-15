const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../app')
const expect = chai.expect

chai.use(chaiHttp)

describe('[ GET ] /user/refresh', () => {
	const email = 'test@example.org'
	const password = 'test123'

	let auth

	before((done) => {
		chai.request(app)
			.post('/user/login')
			.send({ email, password })
			.end((err, res) => {
				auth = res.body
				done(err)
			})
	})

	it('should fail and respond with status 403, for no authorization header in request', (done) => {
		chai.request(app)
			.get('/user/refresh')
			.send()
			.end((err, res) => {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(403)
				expect(res.body).to.be.deep.equal({ message: 'You have no permission!' })

				done(err)
			})
	})

	it('should fail and respond with status 400 for missing refresh token in header', (done) => {
		chai.request(app)
			.get('/user/refresh')
			.set('authorization', 'Bearer ' + auth.token)
			.send()
			.end((err, res) => {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(400)
				expect(res.body).to.be.deep.equal({ message: 'Missing refresh token' })

				done(err)
			})
	})

	it('should fail and respond with status 403 for invalid refresh token in header', (done) => {
		chai.request(app)
			.get('/user/refresh')
			.set('authorization', 'Bearer ' + auth.token)
			.set('token-refresh', 'invalid-refresh-token')
			.send()
			.end((err, res) => {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(403)
				expect(res.body).to.be.deep.equal({ message: 'Invalid or expired refresh token' })

				done(err)
			})
	})

	it('should succeed and respond with status 200 and new tokens in body', (done) => {
		chai.request(app)
			.get('/user/refresh')
			.set('authorization', 'Bearer ' + auth.token)
			.set('token-refresh', auth.refreshToken)
			.send()
			.end((err, res) => {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(200)
				expect(res.body).to.have.keys([
					'token',
					'expiresIn',
					'refreshToken'
				])


				done(err)
			})
	})
})
