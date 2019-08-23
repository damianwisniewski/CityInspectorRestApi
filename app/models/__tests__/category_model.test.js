const { checkPropertyExists } = require('sequelize-test-helpers')
const { expect, ...chai } = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const db = require('..')

chai.use(sinonChai)

describe('Category database model', () => {
	const { Category, Notification } = db.models
	const CategoryInstance = new Category()

	context('has all required params', () => {
		;['id', 'name'].forEach(checkPropertyExists(CategoryInstance))
	})

	context('has proper association', () => {
		it(`with model Notification`, () => {
			sinon.spy(Category, 'hasMany')
			Category.associate(db.models)

			expect(Category.hasMany).to.have.been.calledWith(Notification)

			Category.hasMany.restore()
		})
	})

	context('has default records', () => {
		const defaultRecors = [
			'niebezpieczne miejsca',
			'uszkodzenia',
			'zaniedbana zieleń',
			'zanieczyszczona przestrzeń',
		]

		it('should be storaged in static dictionaryValues getter', () => {
			expect(Category.dictionaryValues).to.be.deep.equal(defaultRecors)
		})

		it('should be able to insert, by call static method createDictionaryValues', () => {
			sinon.spy(Category, 'findOrCreate')
			Category.createDictionaryValues()

			expect(Category.findOrCreate).to.be.callCount(4)

			defaultRecors.forEach(record => {
				expect(Category.findOrCreate).to.be.calledWith({ where: { name: record } })
			})

			Category.findOrCreate.restore()
		})
	})
})
