const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../app')
const sinon = require('sinon')
const expect = chai.expect

chai.use(chaiHttp)

describe('[ GET ] /subscription', () => {
	const email = 'test@example.org'
	const password = 'test123'

	let auth
	let subId

	before((done) => {
		chai.request(app)
			.post('/user/login')
			.send({ email, password })
			.end((err, res) => {
				auth = res.body

				chai.request(app)
					.post('/subscription?notification=4')
					.set('authorization', 'Bearer ' + auth.token)
					.send()
					.end(function (err, res) {
						subId = res.body.subscriptionId

						done()
					});
			})
	})

	after((done) => {
		chai.request(app)
			.delete(`/subscription/${subId}`)
			.set('authorization', 'Bearer ' + auth.token)
			.send()
			.end(() => {
				done()
			})
	})

	it('should fail and respond with status 403, for no authorization header in request', (done) => {
		chai.request(app)
			.get('/subscription')
			.send()
			.end(function (err, res) {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(403)
				expect(res.body).to.be.deep.equal({ message: 'You have no permission!' })
				done(err)
			});
	})

	it('should succeed and respond with status 200, and array that will contain proper subscription in response body', (done) => {
		chai.request(app)
			.get(`/subscription/${subId}`)
			.set('authorization', 'Bearer ' + auth.token)
			.send()
			.end(function (err, res) {
				expect(err).not.to.exist

				console.log(res.body)
				expect(res.status).to.be.equal(200)
				expect(res.body).to.be.an('Array')
				expect(res.body[0]).to.contains({ 'id': subId })

				done(err)
			});
	})

	it('should succeed and respond with status 200, and empty array in response body for not existing subscription ID', (done) => {
		chai.request(app)
			.get('/subscription/9999999999')
			.set('authorization', 'Bearer ' + auth.token)
			.send()
			.end(function (err, res) {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(200)
				expect(res.body)
					.to.be.an('Array')
					.and.to.be.empty

				done(err)
			});
	})
})
