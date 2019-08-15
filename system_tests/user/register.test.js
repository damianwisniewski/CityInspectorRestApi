const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../app')
const expect = chai.expect

chai.use(chaiHttp)

describe('[ POST ] /user', () => {

	afterEach((done) => {
		/**
		 * Removing created user after each test
		 */
		chai.request(app)
			.post('/user/login')
			.send({
				email: 'fake@example.org',
				password: 'fake123',
			})
			.end((_err, res) => {
				chai.request(app)
					.delete('/user/')
					.set('authorization', 'Bearer ' + res.body.token)
					.send()
					.end((err, _res) => done(err))
			})
	})

	it('should fail and respond with status 400 for no email', (done) => {
		const registerData = {
			name: 'Janek',
			surname: 'Fake',
			gender: 'M',
			nickname: 'fake',
			password: 'fake123',
			emailAgreement: 'Y'
		}

		chai.request(app)
			.post('/user')
			.send(registerData)
			.end((err, res) => {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(400)
				expect(res.body).to.be.deep.equal({ message: 'Missing data!' })

				done(err)
			})
	})

	it('should fail and respond with status 400 for no password', (done) => {
		const registerData = {
			name: 'Janek',
			surname: 'Fake',
			gender: 'M',
			nickname: 'fake',
			email: 'fake@example.org',
			emailAgreement: 'Y'
		}

		chai.request(app)
			.post('/user')
			.send(registerData)
			.end((err, res) => {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(400)
				expect(res.body).to.be.deep.equal({ message: 'Missing data!' })

				done(err)
			})
	})

	it('should fail and respond with status 400 for no nickname', (done) => {
		const registerData = {
			name: 'Janek',
			surname: 'Fake',
			gender: 'M',
			email: 'fake@example.org',
			password: 'fake123',
			emailAgreement: 'Y'
		}

		chai.request(app)
			.post('/user')
			.send(registerData)
			.end((err, res) => {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(400)
				expect(res.body).to.be.deep.equal({ message: 'Missing data!' })

				done(err)
			})
	})

	it('should fail and respond with status 400 for no emailAgreement', (done) => {
		const registerData = {
			name: 'Janek',
			surname: 'Fake',
			gender: 'M',
			nickname: 'fake',
			email: 'fake@example.org',
		}

		chai.request(app)
			.post('/user')
			.send(registerData)
			.end((err, res) => {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(400)
				expect(res.body).to.be.deep.equal({ message: 'Missing data!' })

				done(err)
			})
	})


	it('should fail and respond with status 401 for data (email, nickname) that already exist', (done) => {
		const registerData = {
			nickname: 'fake',
			email: 'fake@example.org',
			password: 'fake123',
			emailAgreement: 'Y'
		}

		chai.request(app)
			.post('/user')
			.send(registerData)
			.end((err, res) => {

				chai.request(app)
					.post('/user')
					.send(registerData)
					.end((err, res) => {
						expect(err).not.to.exist

						expect(res.status).to.be.equal(401)
						expect(res.body).to.be.deep.equal({ message: 'Invalid data!' })

						done(err)
					})
			})
	})

	it('should succeed and respond with status 201 and empty body', (done) => {
		const registerData = {
			name: 'Janek',
			surname: 'Fake',
			gender: 'M',
			nickname: 'fake',
			email: 'fake@example.org',
			password: 'fake123',
			emailAgreement: 'Y'
		}

		chai.request(app)
			.post('/user')
			.send(registerData)
			.end((err, res) => {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(201)
				expect(res.body).to.be.empty

				done(err)
			})
	})

	it('should succeed and respond with status 201 and empty body, even if optional params: name, surename, gander will be missing', (done) => {
		const registerData = {
			nickname: 'fake',
			email: 'fake@example.org',
			password: 'fake123',
			emailAgreement: 'Y'
		}

		chai.request(app)
			.post('/user')
			.send(registerData)
			.end((err, res) => {
				expect(err).not.to.exist

				expect(res.status).to.be.equal(201)
				expect(res.body).to.be.empty

				done(err)
			})
	})
})
