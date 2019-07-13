const Sequelize = require('sequelize')
const { checkPropertyExists } = require('sequelize-test-helpers')
const { expect, ...chai } = require('chai')
const sinonChai = require('sinon-chai')
const db = require('..')

chai.use(sinonChai)
const Op = Sequelize.Op;

describe('Photo database model', () => {
	const { Photo } = db.models
	const PhotoInstance = new Photo()

	context('has all required params', () => {
		[
			'id',
			'photo1',
			'photo2',
			'photo3',
			'photo4',
			'photo5',
		].forEach(checkPropertyExists(PhotoInstance))
	})

	context('has proper data validation of inserction data', () => {
		afterEach(async () => {
			await Photo.destroy({
				where: {
					[Op.or]: [{ photo1: 'http://example.com/image1' }, { photo2: 'http://example.com/image2' }]
				}
			})
		})

		const defaultMockUserData = {
			photo1: 'http://example.com/image1',
			photo2: 'http://example.com/image2',
			photo3: 'http://example.com/image3',
			photo4: 'http://example.com/image4',
			photo5: 'http://example.com/image5',
		}

		const testValidationData = new Map([
			['http://example.com/mock', true],
			['https://example.com/image', true],
			['//example.com/image', false],
			['mock_name', false],
			['mock', false],
			['/mock/mock', false],
		])

		for (let i = 0; i <= 5; i++) {
			const columnName = `photo${i}`

			context(`${columnName} validation`, () => {

				for (const [value, expectation] of testValidationData) {
					it(`for value "${value}" should ${expectation ? "pass" : "fail"}`, async () => {
						try {
							await Photo.create({
								...defaultMockUserData,
								[columnName]: value
							})
							expect(expectation).to.be.true
						} catch (err) {
							expect(!expectation).to.be.true
						}
					})
				}
			})
		}

	})

})
