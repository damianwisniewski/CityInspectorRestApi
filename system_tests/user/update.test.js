const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../app')
const expect = chai.expect

chai.use(chaiHttp)

describe('[ PUT ] /user', () => {
	const email = 'test@example.org'
	const password = 'tester123'

	const originalData = {
		name: 'Jan',
		surname: 'Kowalski',
		gender: 'M',
		nickname: 'tester',
		email: 'test@example.org',
		password: 'tester123',
		emailAgreement: 'Y',
	}

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

	after(done => {
		chai
			.request(app)
			.put('/user/')
			.set('authorization', 'Bearer ' + auth.token)
			.send(originalData)
			.end((err, res) => {
				auth = res.body
				done()
			})
	})

	it('should fail and respond with status 403, for no authorization header in request', done => {
		chai
			.request(app)
			.put('/user/')
			.send()
			.end((err, res) => {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(403)
				expect(res.body).to.be.deep.equal({ message: 'You have no permission!' })

				done(err)
			})
	})

	it('should fail and respond with status 400, for no data to update passed', done => {
		chai
			.request(app)
			.put('/user/')
			.set('authorization', 'Bearer ' + auth.token)
			.send()
			.end((err, res) => {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(400)
				expect(res.body).to.be.deep.equal({ message: 'Missing data!' })

				done(err)
			})
	})

	context('with invalid data', () => {
		const invalidData = {
			name: 'Ja/nek',
			surname: 'Fa@ke',
			gender: 'D',
			emailAgreement: 'U',
			email: 'example.org',
		}

		Object.keys(invalidData).forEach((param, index) => {
			it(`should fail and respond with status 401, for invalid ${param} to update`, done => {
				chai
					.request(app)
					.put('/user/')
					.set('authorization', 'Bearer ' + auth.token)
					.send({
						[param]: invalidData[param],
					})
					.end((err, res) => {
						expect(err).not.to.exist

						expect(res.status).to.be.equal(401)
						expect(res.body).to.be.deep.equal({ message: 'Invalid data!' })

						done(err)
					})
			})
		})
	})

	context('with valid data', () => {
		const invalidData = {
			name: 'Joanna',
			surname: 'Kowalska',
			gender: 'F',
			emailAgreement: 'N',
			email: 'test@example.org',
		}

		Object.keys(invalidData).forEach((param, index) => {
			it(`should succeed and respond with status 200, for valid ${param} to update`, done => {
				chai
					.request(app)
					.put('/user/')
					.set('authorization', 'Bearer ' + auth.token)
					.send({
						[param]: invalidData[param],
					})
					.end((err, res) => {
						expect(err).not.to.exist

						expect(res.status).to.be.equal(200)
						expect(res.body).to.be.empty

						done(err)
					})
			})
		})
	})
})
