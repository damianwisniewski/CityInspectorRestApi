const { expect, ...chai } = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const {
	authReq,
	nonAuthReq,
	res,
	modelMock,
	modelInstanceMock: user,
	modelInstanceMock: subscription,
} = require('../../utils/test_helpers/mocks')
const { add, getMany, getSingle, remove, update } = require('../notification_controller')
const { models } = require('../../models')

chai.use(sinonChai)

const fakeFoundedNotification = {
	id: 29,
	title: 'Iure quam quidem consequatur voluptatibus quisquam quisquam consectetur mollitia.',
	description: 'Similique provident repellendus.',
	createdAt: 'mock',
	Localization: {
		mock: 'mock',
	},
	Photo: {
		dataValues: {
			photo1: 'http://mock',
			photo2: 'http://mock2',
			photo3: null,
			photo4: null,
			photo5: null,
		},
	},
	Status: {
		name: 'mock',
	},
	Category: {
		name: 'mock',
	},
	User: {
		nickname: 'mock',
	},
}

describe('Notification Controller', () => {
	before(() => {
		// sinon.stub(models, 'User').value(Object.assign({}, modelMock))
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
		authReq.params = {}
		authReq.query = {}

		nonAuthReq.params = {}
		nonAuthReq.query = {}

		sinon.reset()
	})

	context('remove', () => {
		it('should call next with error object if destroy would fail', done => {
			models.Notification.destroy.rejects()

			const next = errorObj => {
				expect(models.Notification.destroy).to.be.calledOnce
				expect(errorObj).to.be.deep.equal({ status: 400, message: 'Notification delete failed!' })
				done()
			}

			remove(authReq, res, next)
		})

		it("should call next with error object if destroy method did't find proper notification", done => {
			models.Notification.destroy.resolves(null)

			const next = errorObj => {
				expect(models.Notification.destroy).to.be.calledOnce
				expect(errorObj).to.be.deep.equal({
					status: 404,
					message: 'Notification does not exist or you are not the owner!',
				})
				done()
			}

			remove(authReq, res, next)
		})

		it('should response with status 200 if destroy will succeed', done => {
			models.Notification.destroy.resolves([{ mock: 'mock' }])

			res.send.callsFake(() => {
				expect(res.status).to.be.have.been.calledWith(200)
				done()
			})

			remove(authReq, res, () => {})
		})
	})

	context('getSingle', () => {
		it('should response with status 200 and null if there is no notification for passed id', done => {
			models.Notification.findOne.resolves(null)

			res.json.callsFake(arg => {
				try {
					expect(res.status).to.be.have.been.calledWith(200)
					expect(arg).to.be.null
					done()
				} catch (err) {
					done(err)
				}
			})

			getSingle(nonAuthReq, res, () => {})
		})

		it('should response with status 200 and prepared notifcation data for passed id', done => {
			const notificationId = 11

			nonAuthReq.params.notificationId = notificationId
			models.Notification.findOne.resolves(fakeFoundedNotification)

			res.json.callsFake(arg => {
				try {
					expect(models.Notification.findOne).to.be.have.been.calledWithMatch({
						where: {
							id: notificationId,
						},
						attributes: sinon.match.any,
						include: sinon.match.any,
					})
					expect(res.status).to.be.have.been.calledWith(200)
					expect(arg).to.be.deep.equal({
						id: fakeFoundedNotification.id,
						title: fakeFoundedNotification.title,
						description: fakeFoundedNotification.description,
						localization: fakeFoundedNotification.Localization,
						photos: Object.values(fakeFoundedNotification.Photo.dataValues).filter(value => value),
						status: fakeFoundedNotification.Status.name,
						category: fakeFoundedNotification.Category.name,
						user: fakeFoundedNotification.User.nickname,
					})
					done()
				} catch (err) {
					done(err)
				}
			})

			getSingle(nonAuthReq, res, () => {})
		})
	})

	context('getMany', () => {
		it('should call findAll static method on model class (Notification) for param "type" equal "all"', done => {
			nonAuthReq.params.type = 'all'
			models.Notification.findAll.resolves([])

			res.json.callsFake(() => {
				try {
					expect(models.Notification.findAll).to.be.calledOnce
					done()
				} catch (err) {
					done(err)
				}
			})

			getMany(nonAuthReq, res, () => {})
		})

		it('should call getNotifications method on user instance for param "type" equal "own"', done => {
			authReq.params.type = 'own'
			user.getNotifications.resolves([])

			res.json.callsFake(() => {
				try {
					expect(user.getNotifications).to.be.calledOnce
					done()
				} catch (err) {
					done(err)
				}
			})

			getMany(authReq, res, () => {})
		})

		context('should pass to searching method, "where" param equal to passed queries', () => {
			it('Notification findAll method', done => {
				nonAuthReq.params.type = 'all'
				nonAuthReq.query = {
					id: '1c4eg',
					mock: 'mock',
				}

				models.Notification.findAll.resolves([])

				res.json.callsFake(() => {
					try {
						expect(models.Notification.findAll).to.be.calledWithMatch({
							where: nonAuthReq.query,
							attributes: sinon.match.any,
							include: sinon.match.any,
						})
						done()
					} catch (err) {
						done(err)
					}
				})

				getMany(nonAuthReq, res, () => {})
			})

			it('user getNotifications method', done => {
				authReq.params.type = 'own'
				authReq.query = {
					id: '1c4eg',
					mock: 'mock',
				}

				user.getNotifications.resolves([])

				res.json.callsFake(() => {
					try {
						expect(user.getNotifications).to.be.calledWithMatch({
							where: authReq.query,
							attributes: sinon.match.any,
							include: sinon.match.any,
						})
						done()
					} catch (err) {
						done(err)
					}
				})

				getMany(authReq, res, () => {})
			})
		})
		context(
			'should not pass to searching method, any "where" param if any queries were passed',
			() => {
				it('Notification findAll method', done => {
					nonAuthReq.params.type = 'all'
					nonAuthReq.query = {}

					models.Notification.findAll.resolves([])

					res.json.callsFake(() => {
						try {
							expect(models.Notification.findAll).to.be.calledOnce
							expect(models.Notification.findAll.args[0][0].where).to.be.undefined
							done()
						} catch (err) {
							done(err)
						}
					})

					getMany(nonAuthReq, res, () => {})
				})

				it('user getNotifications method', done => {
					authReq.params.type = 'own'
					authReq.query = {}

					user.getNotifications.resolves([])

					res.json.callsFake(() => {
						try {
							expect(user.getNotifications).to.be.calledOnce
							expect(user.getNotifications.args[0][0].where).to.be.undefined
							done()
						} catch (err) {
							done(err)
						}
					})

					getMany(authReq, res, () => {})
				})
			},
		)
		context(
			'should respond with status 200 and empty array if notifications with following params does not exist',
			done => {
				it('Notification findAll method', done => {
					nonAuthReq.params.type = 'all'
					nonAuthReq.query = {}

					models.Notification.findAll.resolves([])

					res.json.callsFake(arg => {
						try {
							expect(res.status).to.be.calledOnceWith(200)
							expect(arg)
								.to.be.an('Array')
								.with.length(0)

							done()
						} catch (err) {
							done(err)
						}
					})

					getMany(nonAuthReq, res, () => {})
				})

				it('user getNotifications method', done => {
					authReq.params.type = 'own'
					authReq.query = {}

					user.getNotifications.resolves([])

					res.json.callsFake(arg => {
						try {
							expect(res.status).to.be.calledOnceWith(200)
							expect(arg)
								.to.be.an('Array')
								.with.length(0)

							done()
						} catch (err) {
							done(err)
						}
					})

					getMany(authReq, res, () => {})
				})
			},
		)
		context(
			'should respond with status 200 and array of notifications with proper params',
			done => {
				it('Notification findAll method', done => {
					nonAuthReq.params.type = 'all'
					nonAuthReq.query = {}
					const foundedNotify = [{ ...fakeFoundedNotification }, { ...fakeFoundedNotification }]

					models.Notification.findAll.resolves(foundedNotify)

					res.json.callsFake(arg => {
						try {
							expect(res.status).to.be.calledOnceWith(200)
							expect(arg)
								.to.be.an('Array')
								.with.length(foundedNotify.length)

							expect(arg[0]).to.have.keys([
								'id',
								'createdAt',
								'title',
								'description',
								'localization',
								'status',
								'category',
							])

							done()
						} catch (err) {
							done(err)
						}
					})

					getMany(nonAuthReq, res, () => {})
				})

				it('user getNotifications method', done => {
					authReq.params.type = 'own'
					authReq.query = {}
					const foundedNotify = [{ ...fakeFoundedNotification }, { ...fakeFoundedNotification }]

					user.getNotifications.resolves(foundedNotify)

					res.json.callsFake(arg => {
						try {
							expect(res.status).to.be.calledOnceWith(200)
							expect(arg)
								.to.be.an('Array')
								.with.length(foundedNotify.length)

							expect(arg[0]).to.have.keys([
								'id',
								'createdAt',
								'title',
								'description',
								'localization',
								'status',
								'category',
							])

							done()
						} catch (err) {
							done(err)
						}
					})

					getMany(authReq, res, () => {})
				})
			},
		)
	})
})
