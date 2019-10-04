const Sequelize = require('sequelize')
const { checkPropertyExists } = require('sequelize-test-helpers')
const { expect, ...chai } = require('chai')
const sinonChai = require('sinon-chai')
const db = require('..')

chai.use(sinonChai)
const Op = Sequelize.Op

describe('Localization database model', () => {
	const { Localization } = db.models
	const LocalizationInstance = new Localization()

	context('has all required params', () => {
		;['id', 'lat', 'lon', 'city', 'street', 'number', 'post'].forEach(
			checkPropertyExists(LocalizationInstance),
		)
	})

	context('has proper data validation of inserction data', () => {
		afterEach(async () => {
			await Localization.destroy({
				where: {
					[Op.or]: [{ city: 'Miasto' }, { street: 'Ulica' }],
				},
			})
		})

		const defaultMockUserData = {
			lat: 21.0,
			lon: 11.1,
			city: 'Miasto',
			street: 'Ulica',
			number: '11a',
			post: '00-111',
		}

		const testValidationData = {
			lat: new Map([
				[11, true],
				[12.11, true],
				[0.11, true],
				['mock_name', false],
				['mock-name', false],
				['mockName12', false],
				['mock', false],
			]),

			lon: new Map([
				[11.0, true],
				[12.11, true],
				[0.11, true],
				['mock_name', false],
				['mock-name', false],
				['mockName12', false],
				['mock', false],
			]),

			city: new Map([
				['mock-value', true],
				['ssfsasada', true],
				['Dąbrowa Górnicza', true],
				['mock name', true],
				['mock name name', true],
				['mock_coss', false],
				['mock223', false],
				['mock_coss', false],
			]),

			street: new Map([
				['mock', true],
				['Name', true],
				['Ęąćźdżśńół', true],
				['mock-name', true],
				['mock_name', true],
				['mockName12', true],
				['mock name', false],
				['mock@name', false],
				['mock.name', false],
				['mock/name', false],
			]),

			number: new Map([
				['34a', true],
				['5b', true],
				['56/4', true],
				['13-b', false],
				['45_7', false],
			]),

			post: new Map([['22-443', true], ['33-000', true], ['0-0000', false], ['00-0', false]]),
		}

		for (const key in testValidationData) {
			const scenario = testValidationData[key]

			context(`${key} validation`, () => {
				for (const [value, expectation] of scenario) {
					it(`for value "${value}" should ${expectation ? 'pass' : 'fail'}`, async () => {
						try {
							await Localization.create({
								...defaultMockUserData,
								[key]: value,
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
