const { expect, ...chai } = require('chai')
const sinonChai = require('sinon-chai')

const webtoken = require('../jwt_service')
const { models } = require('../../models')
const authService = require('../auth_service')

chai.use(sinonChai)

describe('Auth service', () => {

	let testAccountData
	let validToken
	const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbW…E5In0.AFDNfYhG83H0ns596huFjy0L6-Ki4NHTy5Y1zldeeCA'
	const invalidToken = webtoken.create({ fakeData: 'fake' })

	before(async () => {
		const testAccount = await models.User.findOne({ where: { email: 'test@example.org' } })

		testAccountData = {
			email: 'test@example.org',
			userId: testAccount.id
		}

		validToken = webtoken.create(testAccountData).token
	})

	it('should call next with error argument for MISSING token', (done) => {
		const reqWithNoToken = {
			headers: {}
		}

		const next = function () {
			expect(arguments[0])
				.to.include({ status: 403, message: 'You have no permission!' })

			done()
		}

		authService(reqWithNoToken, null, next)
	})

	it('should call next with error argument for INVALID token', (done) => {
		const reqWithNoToken = {
			headers: {
				authorization: 'Bearer ' + invalidToken,
			}
		}

		const next = function () {
			expect(arguments[0])
				.to.include({ status: 401 })
				.and.have.key('message')

			done()
		}

		authService(reqWithNoToken, null, next)
	})

	it('should call next with error argument for EXPIRED token', (done) => {
		const reqWithNoToken = {
			headers: {
				authorization: 'Bearer ' + expiredToken,
			}
		}

		const next = function () {
			expect(arguments[0]).to.have.keys('status', 'message')

			done()
		}

		authService(reqWithNoToken, null, next)
	})

	it('should call next with error argument for VALID token', (done) => {
		const reqWithNoToken = {
			headers: {
				authorization: 'Bearer ' + validToken,
			}
		}

		const next = function () {
			expect(arguments[0]).to.be.undefined
			expect(reqWithNoToken.locals)
				.to.be.an('object')
				.and.have.keys('user', 'authorization')

			done()
		}

		authService(reqWithNoToken, null, next)
	})
})