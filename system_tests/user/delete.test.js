const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../app')
const expect = chai.expect

chai.use(chaiHttp)

describe('[ DELETE ] /user', () => {
	const email = 'test@example.org'
	const password = 'tester123'

	let auth

	before(done => {
		chai
			.request(app)
			.post('/user/login')
			.send({ email, password })
			.end((err, res) => {
				auth = res.body
				done(err)
			})
	})

	after(done => {
		chai
			.request(app)
			.post('/user/')
			.send({
				name: 'Jan',
				surname: 'Kowalski',
				gender: 'M',
				nickname: 'tester',
				email: 'test@example.org',
				password: 'tester123',
				privateData: 'Y',
				emailAgreement: 'Y',
			})
			.end((err, res) => {
				done()
			})
	})

	it('should respond with status 403, for no authorization header in request', done => {
		chai
			.request(app)
			.delete('/user/')
			.send()
			.end((err, res) => {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(403)
				expect(res.body).to.be.deep.equal({ message: 'You have no permission!' })

				done(err)
			})
	})

	it('should delete respond with status 204 and no body after successful delete', done => {
		chai
			.request(app)
			.delete('/user/')
			.set('authorization', 'Bearer ' + auth.token)
			.send()
			.end((err, res) => {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(204)
				expect(res.body).to.be.empty

				done(err)
			})
	})
})
