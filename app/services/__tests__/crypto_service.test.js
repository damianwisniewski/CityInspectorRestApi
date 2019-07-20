const { expect, ...chai } = require('chai')
const sinonChai = require('sinon-chai')

const cryptoService = require('../crypto_service')

chai.use(sinonChai)

describe('Crypto Service', () => {

	it('generateHashedValue - should generate hashed value for passed data', async () => {
		const hashedValue1 = await cryptoService.generateHashedValue('someMockValue')

		expect(hashedValue1).to.be.a('string')
	})

	it('compareHashedValues - should compare passed value, with passed one as VALID', async () => {
		const hashedValue = await cryptoService.generateHashedValue('someMockValue')
		const isValid = await cryptoService.compareHashedValues('someMockValue', hashedValue)

		expect(isValid).to.be.true
	})

	it('compareHashedValues - should compare passed value, with passed one as INVALID', async () => {
		const hashedValue = await cryptoService.generateHashedValue('someMockValue')
		const isValid = await cryptoService.compareHashedValues('differentValue', hashedValue)

		expect(isValid).to.be.false
	})
})