const { checkPropertyExists } = require('sequelize-test-helpers')
const { expect, ...chai } = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const db = require('..')

chai.use(sinonChai)

describe('Subscription database model', () => {
	const { Subscription, Notification } = db.models
	const SubscriptionInstance = new Subscription()

	context('has all required params', () => {
		[
			'id',
			'NotificationId',
			'UserId'
		].forEach(checkPropertyExists(SubscriptionInstance))
	})

	context('has proper association', () => {
		beforeEach(() => {
			sinon.spy(Subscription, 'belongsTo');
			Subscription.associate(db.models)
		})

		afterEach(() => {
			Subscription.belongsTo.restore()
		})

		it(`with model Notification`, () => {
			expect(Subscription.belongsTo).to.have.been.calledWith(Notification)
		})
	})
})
