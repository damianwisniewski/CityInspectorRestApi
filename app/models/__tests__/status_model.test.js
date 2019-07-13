const { checkPropertyExists } = require('sequelize-test-helpers')
const { expect, ...chai } = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const db = require('..')

chai.use(sinonChai)

describe('Status database model', () => {
	const { Status, Notification } = db.models
	const StatusInstance = new Status()

	context('has all required params', () => {
		[
			'id',
			'name',
		].forEach(checkPropertyExists(StatusInstance))
	})

	context('has proper association', () => {

		it(`with model Notification`, () => {
			sinon.spy(Status, 'hasMany')
			Status.associate(db.models)

			expect(Status.hasMany).to.have.been.calledWith(Notification)

			Status.hasMany.restore()
		})
	})

	context('has default records', () => {
		const defaultRecors = ['zgłoszone', 'zrealizowane', 'w realizacji']

		it('should be storaged in static dictionaryValues getter', () => {
			expect(Status.dictionaryValues).to.be.deep.equal(defaultRecors)
		})

		it('should be able to insert, by call static method createDictionaryValues', () => {
			sinon.spy(Status, 'findOrCreate')
			Status.createDictionaryValues()

			expect(Status.findOrCreate).to.be.callCount(3)

			defaultRecors.forEach(record => {
				expect(Status.findOrCreate).to.be.calledWith({ where: { name: record } })
			})

			Status.findOrCreate.restore()
		})
	})
})
