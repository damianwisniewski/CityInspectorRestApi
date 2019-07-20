const { expect, ...chai } = require('chai')
const sinonChai = require('sinon-chai')

const emailService = require('../email_service')

chai.use(sinonChai)

describe('Email Service', () => {

	it('fillTemplate - should return string with html', () => {
		const inputData = {
			nickname: 'testNick',
			resetLink: 'http://test.com/test'
		}

		const output = emailService.fillTemplate(inputData, 'html')
		expect(output).to.be.a('string').and.match(/<div/g)
	})


	it('fillTemplate - should return string with plain text', () => {
		const inputData = {
			nickname: 'testNick',
			resetLink: 'http://test.com/test'
		}

		const output = emailService.fillTemplate(inputData, 'text')
		expect(output).to.be.a('string').and.not.match(/<div/g)
	})

	it('fillTemplate - should return string that contains input data', () => {
		const inputData = {
			nickname: 'testNick',
			resetLink: 'http://test.com/test'
		}

		const output = emailService.fillTemplate(inputData, 'text')
		expect(output)
			.to.be.a('string')
			.that.contains(inputData.nickname)
			.and.contains(inputData.resetLink)
	})

	it('sendMessage - should reject in case of no email adress to be send to', (done) => {
		emailService.sendMessage(null, { mock: 'any' })
			.then(() => {
				done(new Error('sendMessage resolved, but it should reject because of no email adress to send'))
			})
			.catch(err => {
				expect(err).to.be.a('string')
				done()
			})
	})

	it('sendMessage - should reject in case of no messageParams in second argument', (done) => {
		emailService.sendMessage('test@test-env.com', null)
			.then(() => {
				done(new Error('sendMessage resolved, but it should reject because of no messageParams'))
			})
			.catch(err => {
				expect(err).to.be.a('string')
				done()
			})
	})

	it('sendMessage - should resolve and send email', (done) => {
		emailService.sendMessage('test@test-env.com', { mock: 'any' })
			.then(() => {
				done()
			})
			.catch(() => {
				done(new Error('sendMessage resolved, but it should reject because of no messageParams'))
			})
	})

	it('verifyConnection - should return Promise with boolean value', async () => {
		const connection = emailService.verifyConnection()

		expect(connection).to.be.a('Promise')
		expect(await connection).to.be.true
	})
})