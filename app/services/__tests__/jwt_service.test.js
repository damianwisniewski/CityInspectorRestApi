const { expect, ...chai } = require('chai')
const sinonChai = require('sinon-chai')
const sinon = require('sinon')

const jwt = require('jsonwebtoken')
const webTokenService = require('../jwt_service')
const { JWT_SECRET_KEY } = require('../../config')

chai.use(sinonChai)
const should = chai.should()

describe('JWT Service', () => {

	it('create - should return object with generated token, refresh token and expiresIn', async () => {
		const inputData = {
			mockValue: 'test'
		}

		const tokenOutput = await webTokenService.create(inputData)

		expect(tokenOutput)
			.to.be.an('object')
			.and.have.keys('token', 'expiresIn', 'refreshToken')

		expect(tokenOutput.token).to.be.a('string')
		expect(tokenOutput.expiresIn).to.be.a('number')
		expect(tokenOutput.refreshToken).to.be.a('string')
	})

	it('validate - should thow error for invalid token', (done) => {
		const invalidToken = 'ada34a4q29hnds-3we'

		try {
			webTokenService.validate(invalidToken)
			done(new Error('validate should throw error, but it passed'))
		} catch (err) {
			done()
		}
	})

	it('validate - should thow error for invalid token', (done) => {
		sinon.stub(jwt, 'sign').onFirstCall().callsFake(() => (
			jwt.sign.wrappedMethod({ mockPayload: 'mock' }, JWT_SECRET_KEY, { expiresIn: '1s', jwtid: 'fakeUUID' })
		))

		const tokenOutput = webTokenService.create()
		jwt.sign.restore()

		setTimeout(() => {
			try {
				webTokenService.validate(tokenOutput.token)
				done(new Error('validate should throw error, but it passed'))
			} catch (err) {
				done()
			}
		}, 1000)
	})

	it('validate - should thow error for token in blacklist', (done) => {
		const tokenOutput = webTokenService.create({ mockPayload: 'mock' })
		webTokenService.revoke(tokenOutput.token, tokenOutput.refreshToken)

		try {
			webTokenService.validate(tokenOutput.token)
			done(new Error('validate should throw error, but it passed'))
		} catch (err) {
			done()
		}
	})

	it('validate - should pass and return token decrypted payload', (done) => {
		const payload = { mockPayload: 'mock' }
		const tokenOutput = webTokenService.create(payload)

		try {
			const decryptedPayload = webTokenService.validate(tokenOutput.token)
			expect(decryptedPayload).to.contains(payload)
			done()
		} catch (err) {
			console.log(err)
			done(new Error('validate should pass, but it thows error'))
		}
	})

	it('refresh - should return new tokens with the same payload', () => {
		const payload = { mockPayload: 'mock' }
		const tokenOutput = webTokenService.create(payload)

		const newTokens = webTokenService.refresh(tokenOutput.token, tokenOutput.refreshToken)
		const decodedPayload = webTokenService.validate(newTokens.token)

		expect(tokenOutput).to.not.contains(newTokens)
		expect(decodedPayload).to.contains(payload)
	})

	it('refresh - should throw error for invalid refresh token', (done) => {
		const payload = { mockPayload: 'mock' }
		const tokenOutput = webTokenService.create(payload)
		tokenOutput.refreshToken = 'mock12token'

		try {
			webTokenService.refresh(tokenOutput.token, tokenOutput.refreshToken)
			done(new Error('refresh succeded, but it should fail'))
		} catch (err) {
			done()
		}
	})

	it('refresh - should revoke old tokens after generate the new ones', () => {
		const payload = { mockPayload: 'mock' }
		const tokenOutput = webTokenService.create(payload)

		webTokenService.refresh(tokenOutput.token, tokenOutput.refreshToken)

		expect(webTokenService.blacklist.has(tokenOutput.token)).to.be.true
		expect(webTokenService.blacklist.has(tokenOutput.refreshToken)).to.be.true
	})

	it('revoke - should add passed token to blacklist', () => {
		const payload = { mockPayload: 'mock' }
		const tokenOutput = webTokenService.create(payload)

		webTokenService.revoke(tokenOutput.token, tokenOutput.refreshToken)

		expect(webTokenService.blacklist.has(tokenOutput.token)).to.be.true
		expect(webTokenService.blacklist.has(tokenOutput.refreshToken)).to.be.true
	})

	it('revoke - should call cleanupExpired interval to clear blacklist after token expire', () => {
		sinon.spy(webTokenService, 'cleanupExpired')
		const payload = { mockPayload: 'mock' }
		const tokenOutput = webTokenService.create(payload)

		webTokenService.revoke(tokenOutput.token, tokenOutput.refreshToken)

		expect(webTokenService.cleanupExpired).to.be.called
		expect(webTokenService.loopInterval).to.not.be.null
	})
})