const { expect, ...chai } = require('chai')
const sinonChai = require('sinon-chai')
const sinon = require('sinon')

const { modelMock, modelInstanceMock: user } = require('../../utils/test_helpers/mocks')
const webToken = require('../../services/jwt_service')
const { models } = require('../../models')
const authService = require('../auth_middleware')

chai.use(sinonChai)

describe('Auth middleware', () => {
	const fakeUserData = {
		id: 'id',
		name: 'name',
		surname: 'surname',
		gender: 'gender',
		city: 'city',
		nickname: 'nickname',
		email: 'email',
		emailAgreement: 'emailAgreement',
		resetPasswordToken: 'reset_token',
	}

	before(() => {
		sinon.stub(models, 'User').value(modelMock)
		sinon.stub(webToken, 'validate')
		Object.assign(user, fakeUserData)
	})

	afterEach(() => sinon.reset())
	after(() => sinon.restore())

	it('should call next with error argument for MISSING token', done => {
		const reqWithNoToken = {
			headers: {},
		}

		const next = function(args) {
			try {
				expect(args).to.be.deep.equal({
					status: 403,
					message: 'You have no permission!',
				})

				done()
			} catch (err) {
				done(err)
			}
		}

		authService(reqWithNoToken, null, next)
	})

	it('should call next with error argument for EXPIRED or INVALID token', done => {
		const reqWithNoToken = {
			headers: {
				authorization: 'Bearer token',
			},
		}

		webToken.validate.throws(new Error())

		const next = function(args) {
			try {
				expect(args).to.be.deep.equal({
					status: 401,
					message: 'Token expired!',
				})

				done()
			} catch (err) {
				done(err)
			}
		}

		authService(reqWithNoToken, null, next)
	})

	it('should call next with error argument for INVALID data decoded from token', done => {
		const reqWithNoToken = {
			headers: {
				authorization: 'Bearer token',
			},
		}

		webToken.validate.returns({
			userId: 'differentId',
			email: 'differentEmail',
		})

		models.User.findByPk.resolves(user)

		const next = function(args) {
			try {
				expect(args).to.be.deep.equal({
					status: 403,
					message: 'You have no permission!',
				})

				done()
			} catch (err) {
				done(err)
			}
		}

		authService(reqWithNoToken, null, next)
	})

	it('should call next with error argument for VALID token', done => {
		const token = 'token'
		const reqWithNoToken = {
			headers: {
				authorization: 'Bearer ' + token,
			},
		}

		webToken.validate.returns({
			userId: fakeUserData.id,
			email: fakeUserData.email,
		})

		models.User.findByPk.resolves(user)

		const next = function(args) {
			try {
				expect(args).to.be.undefined
				expect(reqWithNoToken.locals).to.be.deep.equal({
					user: user,
					authorization: {
						token: token,
						userId: fakeUserData.id,
					},
				})

				done()
			} catch (err) {
				done(err)
			}
		}

		authService(reqWithNoToken, null, next)
	})
})
