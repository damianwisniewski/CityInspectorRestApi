const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../app')
const expect = chai.expect

chai.use(chaiHttp)

describe('[ DELETE ] /subscription', () => {
	const email = 'test@example.org'
	const password = 'test123'

	let auth
	let subId

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

	beforeEach(done => {
		chai
			.request(app)
			.post('/subscription?notification=4')
			.set('authorization', 'Bearer ' + auth.token)
			.send()
			.end(function(err, res) {
				subId = res.body.subscriptionId
				done()
			})
	})

	afterEach(done => {
		chai
			.request(app)
			.delete(`/subscription/${subId}`)
			.set('authorization', 'Bearer ' + auth.token)
			.send()
			.end(() => {
				done()
			})
	})

	it('should succeed and respond with status 204, for remove subscription', done => {
		chai
			.request(app)
			.delete(`/subscription/${subId}`)
			.set('authorization', 'Bearer ' + auth.token)
			.send()
			.end(function(err, res) {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(204)
				expect(res.body).to.be.empty

				done(err)
			})
	})

	it('should fail and respond with status 403, for no authorization header in request', done => {
		chai
			.request(app)
			.delete(`/subscription/${subId}`)
			.send()
			.end(function(err, res) {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(403)
				expect(res.body).to.be.deep.equal({ message: 'You have no permission!' })
				done(err)
			})
	})

	it('should fail and respond with status 404, for not existing subscription', done => {
		chai
			.request(app)
			.delete('/subscription/99999')
			.set('authorization', 'Bearer ' + auth.token)
			.send()
			.end(function(err, res) {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(404)
				expect(res.body).to.be.deep.equal({ message: 'Subscription not found!' })
				done(err)
			})
	})
})
