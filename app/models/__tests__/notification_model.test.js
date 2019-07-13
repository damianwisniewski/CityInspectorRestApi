const { checkPropertyExists } = require('sequelize-test-helpers')
const { expect, ...chai } = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const db = require('..')

chai.use(sinonChai)

describe('Notification database model', () => {
	const { Notification, Photo, Localization } = db.models
	const NotificationInstance = new Notification()

	context('has all required params', () => {
		[
			'id',
			'title',
			'description',
			'StatusId',
			'CategoryId',
			'UserId',
			'PhotoId',
			'LocalizationId',
		].forEach(checkPropertyExists(NotificationInstance))
	})

	context('has proper associations', () => {
		const ModelsToAssociate = [Photo, Localization]

		beforeEach(() => {
			sinon.spy(Notification, 'belongsTo');
			Notification.associate(db.models)
		})

		afterEach(() => {
			Notification.belongsTo.restore()
		})

		ModelsToAssociate.forEach(model => {
			it(`with model ${model.name}`, () => {
				expect(Notification.belongsTo).to.have.been.calledWith(model)
			})
		})
	})
})
