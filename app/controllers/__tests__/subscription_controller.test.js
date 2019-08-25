const { expect, ...chai } = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const {
	authReq: req,
	res,
	modelMock,
	modelInstanceMock: user,
	modelInstanceMock: subscription,
} = require('../../utils/test_helpers/mocks')
const { get, add, remove } = require('../subscription_controller')
const { models } = require('../../models')

chai.use(sinonChai)

describe('Subscription Controller', () => {
	before(() => {
		sinon.stub(models, 'User').value(Object.assign({}, modelMock))
		sinon.stub(models, 'Notification').value(Object.assign({}, modelMock))
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
		req.params = {}
		req.query = {}
		sinon.reset()
	})

	context('get', () => {
		it('should get all user subscriptions and send it in response', done => {
			const subscriptions = [{ test: 'mock' }]

			user.getSubscriptions.resolves(subscriptions)

			res.json.callsFake(jsonArgs => {
				try {
					expect(user.getSubscriptions).to.be.calledOnce
					expect(res.status).to.be.calledWith(200)
					expect(jsonArgs).to.be.deep.equal(subscriptions)
					done()
				} catch (err) {
					done(err)
				}
			})

			get(req, res, () => {})
		})

		it('should get subscription you requested in params, user subscriptions and send it in response', done => {
			const subscriptionId = 4
			const subscriptions = [{ subscriptionId: subscriptionId }]

			user.getSubscriptions.resolves(subscriptions)
			req.params.subscriptionId = subscriptionId

			res.json.callsFake(jsonArgs => {
				try {
					expect(user.getSubscriptions).to.be.calledWith({
						where: {
							id: subscriptionId,
						},
					})
					expect(res.status).to.be.calledWith(200)
					expect(jsonArgs).to.be.deep.equal(subscriptions)
					done()
				} catch (err) {
					done(err)
				}
			})

			get(req, res, () => {})
		})
	})

	context('add', () => {
		it('should pass error to error handler (next) if there is no notification in query params', done => {
			const next = errorObj => {
				try {
					expect(errorObj).to.be.deep.equal({ status: 400, message: 'Missing data!' })
					done()
				} catch (err) {
					done(err)
				}
			}

			add(req, res, next)
		})

		it('should pass error to error handler (next) if notification belongs to user or is already subscribed', done => {
			req.query.notification = 4
			user.getNotifications.resolves([{ mock: 'mock' }])
			user.getSubscriptions.resolves([{ mock: 'mock' }])

			const next = errorObj => {
				try {
					expect(errorObj).to.be.deep.equal({
						status: 400,
						message: "It's your notify or you already subscribed",
					})
					done()
				} catch (err) {
					done(err)
				}
			}

			add(req, res, next)
		})

		it('should send response error to error handler (next) if notification belongs to user or is already subscribed', done => {
			req.query.notification = 4
			user.getNotifications.resolves([])
			user.getSubscriptions.resolves([])

			user.createSubscription.resolves([{ mock: 'mock' }])

			res.json.callsFake(arg => {
				try {
					expect(res.status).to.have.been.calledWith(201)
					expect(arg).to.have.key('subscriptionId')
					done()
				} catch (err) {
					done(err)
				}
			})

			add(req, res, () => {})
		})
	})

	context('remove', () => {
		it("should send response error to error handler (next) if subscriptions with passed subscriptionId doesn't exist", done => {
			const next = errorObj => {
				try {
					expect(errorObj).to.be.deep.equal({ status: 404, message: 'Subscription not found!' })
					done()
				} catch (err) {
					done(err)
				}
			}

			remove(req, res, next)
		})

		it('should destroy subscription and send response with status 204', done => {
			req.params.subscriptionId = 4
			subscription.destroy.resolves()
			user.getSubscriptions.resolves([subscription])

			res.send.callsFake(arg => {
				try {
					expect(subscription.destroy).to.be.calledOnce
					expect(res.status).to.be.calledWith(204)
					expect(arg).to.be.undefined
					done()
				} catch (err) {
					done(err)
				}
			})

			const next = errorObj => {
				try {
					expect(errorObj).to.be.deep.equal({ status: 417, message: 'Delete request failed!' })
					done()
				} catch (err) {
					done(err)
				}
			}

			remove(req, res, next)
		})

		it('should send response error to error handler (next) if subscription destroy would fail for some reason', done => {
			req.params.subscriptionId = 4
			subscription.destroy.rejects()
			user.getSubscriptions.resolves([subscription])

			const next = errorObj => {
				try {
					expect(errorObj).to.be.deep.equal({ status: 417, message: 'Delete request failed!' })
					done()
				} catch (err) {
					done(err)
				}
			}

			remove(req, res, next)
		})
	})
})
