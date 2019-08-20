const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../app')
const expect = chai.expect

chai.use(chaiHttp)

describe('[ POST ] /subscription', () => {
	const email = 'test@example.org'
	const password = 'test123'

	let auth
	let lastSubId

	before((done) => {
		chai.request(app)
			.post('/user/login')
			.send({ email, password })
			.end((err, res) => {
				auth = res.body
				done()
			})
	})

	afterEach((done) => {
		chai.request(app)
			.delete(`/subscription/${lastSubId}`)
			.set('authorization', 'Bearer ' + auth.token)
			.send()
			.end(() => {
				done()
			})
	})

	it('should succeed and respond with status 201, for add new subscription', (done) => {
		chai.request(app)
			.post('/subscription?notification=7')
			.set('authorization', 'Bearer ' + auth.token)
			.send()
			.end(function (err, res) {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(201)
				expect(res.body).to.have.keys('subscriptionId')

				done(err)
			});
	})

	it('should fail and respond with status 403, for no authorization header in request', (done) => {
		chai.request(app)
			.post('/subscription?notification=7')
			.send()
			.end(function (err, res) {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(403)
				expect(res.body).to.be.deep.equal({ message: 'You have no permission!' })
				done(err)
			});
	})

	it('should fail and respond with status 400, for already subscribed notification', (done) => {
		chai.request(app)
			.post('/subscription?notification=7')
			.set('authorization', 'Bearer ' + auth.token)
			.send()
			.end(function (err, res) {

				chai.request(app)
					.post('/subscription?notification=7')
					.set('authorization', 'Bearer ' + auth.token)
					.send()
					.end(function (err, res) {
						expect(err).not.to.exist

						expect(res.status).to.be.equal(400)
						expect(res.body).to.be.deep.equal({ message: 'It\'s your notify or you already subscribed' })
						done(err)
					});

			});
	})
})
