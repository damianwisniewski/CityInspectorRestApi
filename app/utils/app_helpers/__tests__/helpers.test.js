const { expect, ...chai } = require('chai')
const sinonChai = require('sinon-chai')

const { includesParams } = require('../helpers')

chai.use(sinonChai)

describe('Helpers', () => {
	it('includesParams - should return true for requiredParams included in passed object', () => {
		const obj = {
			test1: 'mock1',
			test2: 'mock2',
			test3: 'mock3',
			test4: 'mock4',
			test5: 'mock5',
		}

		const requiredParams = ['test1', 'test2', 'test3', 'test4']

		const result = includesParams(obj, requiredParams)
		expect(result).to.be.true
	})

	it('includesParams - should return false for requiredParams not included in passed object', () => {
		const obj = {
			test1: 'mock1',
			test2: 'mock2',
			test3: 'mock3',
			test4: 'mock4',
			test5: 'mock5',
		}

		const requiredParams = ['test1', 'test2', 'notIncluded', 'test4']

		const result = includesParams(obj, requiredParams)
		expect(result).to.be.false
	})
})
