const { expect, ...chai } = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const {
	authReq,
	nonAuthReq,
	res,
	modelMock,
	modelInstanceMock: user,
} = require('../../utils/test_helpers/mocks')
const webTocken = require('../../services/jwt_service')
const {
	login,
	register,
	logout,
	getData,
	deleteUser,
	resetPassword,
	updateData,
	refreshToken,
	sendResetEmail,
} = require('../user_controller')
const { models } = require('../../models')
const mailClient = require('../../services/email_service')
const helpers = require('../../utils/app_helpers/helpers')

chai.use(sinonChai)

describe('User Controller', () => {
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
		Object.assign(user, fakeUserData)
	})

	after(() => sinon.restore())

	beforeEach(() => {
		/**
		 * After sinon.reset, all stubs looses assigned behavior.
		 * Reset happens in afterEach, that's why it's necessary to assign new behavior again.
		 */
		res.status.returnsThis()
	})

	afterEach(() => {
		nonAuthReq.body = {}
		authReq.body = {}
		delete authReq.headers['token-refresh']

		sinon.reset()
	})

	context('login', () => {
		it('should pass correctly and send auth tokens in response', done => {
			const fakeAuthTokens = {
				token: 'fake1',
				expiresIn: 111111,
				refreshToken: 'fake2',
			}

			models.User.findOne.resolves(user)
			user.validateDataHash.resolves(true)
			sinon.stub(webTocken, 'create').returns(fakeAuthTokens)

			res.json.callsFake(jsonArgs => {
				try {
					expect(res.status).to.be.calledWith(200)
					expect(jsonArgs).to.be.deep.equal(fakeAuthTokens)
					done()
				} catch (err) {
					done(err)
				}

				webTocken.create.restore()
			})

			login(nonAuthReq, res, () => {})
		})

		it("should fail and pass error to error handler, if user with provided data, doesn't exist", done => {
			models.User.findOne.resolves(null)

			const next = errorObj => {
				try {
					expect(errorObj).to.have.all.keys('status', 'message')
					done()
				} catch (err) {
					done(err)
				}
			}

			login(nonAuthReq, res, next)
		})

		it('should fail and pass error to error handler, if provided password, is not valid', done => {
			models.User.findOne.resolves(user)
			user.validateDataHash.resolves(false)

			const next = errorObj => {
				try {
					expect(errorObj).to.have.all.keys('status', 'message')
					done()
				} catch (err) {
					done(err)
				}
			}

			login(nonAuthReq, res, next)
		})
	})

	context('logout', () => {
		it('should revoke tokens and respond with successful', done => {
			const token = authReq.locals.authorization.token
			const refreshTokenData = 'fake_refresh_token'

			authReq.headers['token-refresh'] = refreshTokenData
			sinon.stub(webTocken, 'revoke').callsFake(() => {})

			res.send.callsFake(() => {
				try {
					expect(webTocken.revoke).to.have.been.calledWith(token, refreshTokenData)
					done()
				} catch (err) {
					done(err)
				}

				webTocken.revoke.restore()
			})

			logout(authReq, res, () => {})
		})

		it('should pass error to error handler if token-refresh is missing in headers', done => {
			const next = errorObj => {
				try {
					expect(errorObj).to.have.all.keys('status', 'message')
					done()
				} catch (err) {
					done(err)
				}
			}

			logout(authReq, res, next)
		})
	})

	context('register', () => {
		it("should pass error to error handler if body doesn't contain require params", done => {
			sinon.stub(helpers, 'includesParams').returns(false)

			const next = errorObj => {
				try {
					expect(errorObj).to.have.deep.equal({ status: 400, message: 'Missing data!' })
					done()
				} catch (err) {
					done(err)
				}

				helpers.includesParams.restore()
			}

			register(authReq, res, next)
		})

		it('should pass error to error handler if model create would fail (e.g. wrong data format)', done => {
			sinon.stub(helpers, 'includesParams').returns(true)
			models.User.create.rejects()

			const next = errorObj => {
				try {
					expect(errorObj).to.have.deep.equal({ status: 400, message: 'Invalid data!' })
					done()
				} catch (err) {
					done(err)
				}

				helpers.includesParams.restore()
			}

			register(authReq, res, next)
		})

		it('should send response with 201 status to notify successful registration', done => {
			sinon.stub(helpers, 'includesParams').returns(true)
			models.User.create.resolves()

			res.send.callsFake(() => {
				try {
					expect(res.status).to.have.been.calledWith(201)
					done()
				} catch (err) {
					done(err)
				}
			})

			register(authReq, res, () => {})
		})
	})

	context('refreshToken', () => {
		it('should pass error to error handler if token-refresh is missing in headers', done => {
			const next = errorObj => {
				try {
					expect(errorObj).to.be.deep.equal({ status: 400, message: 'Missing refresh token' })
					done()
				} catch (err) {
					done(err)
				}
			}

			refreshToken(authReq, res, next)
		})

		it('should pass error to error handler, if tokens are invalid', done => {
			authReq.headers['token-refresh'] = 'fake_refresh_token'
			sinon.stub(webTocken, 'refresh').throws({ message: 'fake error' })

			const next = errorObj => {
				try {
					expect(errorObj).to.have.all.keys('status', 'message')
					done()
				} catch (err) {
					done(err)
				}

				webTocken.refresh.restore()
			}

			refreshToken(authReq, res, next)
		})

		it('should send new token in response', done => {
			const token = authReq.locals.authorization.token
			const refreshTokenData = 'fake_refresh_token'
			const newAuthData = {
				token: 'fake_token',
				expiresIn: 1234,
				refreshToken: 'fake_refresh_token',
			}

			authReq.headers['token-refresh'] = refreshTokenData
			sinon.stub(webTocken, 'refresh').returns(newAuthData)

			res.json.callsFake(payload => {
				try {
					expect(webTocken.refresh).to.have.been.calledWith(token, refreshTokenData)
					expect(payload).to.be.deep.equal(newAuthData)
					done()
				} catch (err) {
					done(err)
				}

				webTocken.refresh.restore()
			})

			refreshToken(authReq, res, () => {})
		})
	})

	context('getData', () => {
		it('should send response with founded user data', done => {
			const { id, resetPasswordToken, ...userData } = fakeUserData

			res.json.callsFake(jsonArgs => {
				try {
					expect(res.status).to.be.calledWith(200)
					expect(jsonArgs).to.be.deep.equal(userData)
					done()
				} catch (err) {
					done(err)
				}
			})

			getData(authReq, res, () => {})
		})
	})

	context('updateData', () => {
		it('should pass error to error handler if body does not contains any params', done => {
			const next = errorObj => {
				try {
					expect(errorObj).to.be.deep.equal({ status: 400, message: 'Missing data!' })
					done()
				} catch (err) {
					done(err)
				}
			}

			updateData(authReq, res, next)
		})

		it('should pass error to error handler if sequelize update fail (wrong data types)', done => {
			authReq.body = {
				email: 'some_fake_data',
			}

			user.update.rejects()

			const next = errorObj => {
				try {
					expect(errorObj).to.be.deep.equal({ status: 400, message: 'Invalid data!' })
					done()
				} catch (err) {
					done(err)
				}
			}

			updateData(authReq, res, next)
		})

		it('should send response after succeeded update', done => {
			authReq.body = {
				email: 'some_fake_data',
			}

			user.update.resolves()

			res.send.callsFake(() => {
				try {
					expect(res.status).to.be.calledWith(200)
					done()
				} catch (err) {
					done(err)
				}
			})

			updateData(authReq, res, () => {})
		})
	})

	context('sendResetEmail', () => {
		it('should pass error to error handler if body does not contains email param', done => {
			const next = errorObj => {
				try {
					expect(errorObj).to.be.deep.equal({ status: 400, message: 'Missed data' })
					done()
				} catch (err) {
					done(err)
				}
			}

			sendResetEmail(nonAuthReq, res, next)
		})

		it('should pass error to error handler if mailClient would fail for some reason', done => {
			nonAuthReq.body.email = 'example@email.org'
			models.User.findOne.resolves(user)
			sinon.stub(mailClient, 'sendMessage').rejects()

			const next = errorObj => {
				try {
					expect(errorObj).to.be.deep.equal({ status: 503 })
					done()
				} catch (err) {
					done(err)
				}

				mailClient.sendMessage.restore()
			}

			sendResetEmail(nonAuthReq, res, next)
		})

		it("should send response with status 204, even if user with provided data won't exist", done => {
			nonAuthReq.body.email = 'example@email.org'
			models.User.findOne.resolves(null)

			res.send.callsFake(() => {
				try {
					expect(res.status).to.have.been.calledWith(204)
					done()
				} catch (err) {
					done(err)
				}
			})

			sendResetEmail(nonAuthReq, res, () => {})
		})

		it('should call sendMessage on mailClient and send response with status 204', done => {
			nonAuthReq.body.email = 'example@email.org'
			models.User.findOne.resolves(user)
			sinon.stub(mailClient, 'sendMessage').resolves()

			res.send.callsFake(() => {
				try {
					expect(mailClient.sendMessage).to.have.been.calledWith(user.email, {
						nickname: user.nickname,
						resetLink: sinon.match.string,
					})
					expect(res.status).to.have.been.calledWith(204)
					done()
				} catch (err) {
					done(err)
				}

				mailClient.sendMessage.restore()
			})

			sendResetEmail(nonAuthReq, res, () => {})
		})
	})

	context('resetPassword', () => {
		it('should pass error to error handler if body does not contains needed params', done => {
			const next = errorObj => {
				try {
					expect(errorObj).to.be.deep.equal({ status: 400, message: 'Missing data!' })
					done()
				} catch (err) {
					done(err)
				}
			}

			resetPassword(nonAuthReq, res, next)
		})

		it("should pass error to error handler if user with provided data won't exist", done => {
			nonAuthReq.body = {
				email: 'example@email.org',
				resetToken: 'fake_token',
				newPassword: 'fake_password',
			}

			models.User.findOne.resolves(null)

			const next = errorObj => {
				try {
					expect(errorObj).to.be.deep.equal({ status: 401, message: 'Invalid data!' })
					done()
				} catch (err) {
					done(err)
				}
			}

			resetPassword(nonAuthReq, res, next)
		})

		it('should send response with status 200, after user update', done => {
			nonAuthReq.body = {
				email: 'example@email.org',
				resetToken: 'fake_token',
				newPassword: 'fake_password',
			}

			user.update.resolves(true)
			models.User.findOne.resolves(user)

			res.send.callsFake(() => {
				try {
					expect(res.status).to.be.calledWith(200)
					done()
				} catch (err) {
					done(err)
				}
			})

			resetPassword(nonAuthReq, res, () => {})
		})
	})

	context('deleteUser', () => {
		it('should send response to confirm succeeded deletion', done => {
			user.destroy.resolves(true)

			res.send.callsFake(() => {
				try {
					expect(res.status).to.be.calledWith(204)
					done()
				} catch (err) {
					done(err)
				}
			})

			deleteUser(authReq, res, () => {})
		})
	})
})
