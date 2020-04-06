const { expect, ...chai } = require('chai')
const sinonChai = require('sinon-chai')
const sinon = require('sinon')

const validator = require('express-validator')
const validationMiddleware = require('../data_validation_middleware')

chai.use(sinonChai)

describe('Data validation middleware', () => {
	const validationHander = validationMiddleware({})[1]

	const req = {}
	const res = {}

	before(() => {
		sinon.stub(validator, 'validationResult')
	})

	afterEach(() => sinon.reset())
	after(() => sinon.restore())

	it('should go to next middleware after validation without error', done => {
		validator.validationResult.returns({
			isEmpty: () => true,
		})

		const next = args => {
			try {
				expect(args).to.be.undefined
				done()
			} catch (err) {
				done(err)
			}
		}

		validationHander(req, res, next)
	})

	it('should go to next middleware after validation without error', done => {
		validator.validationResult.returns({
			isEmpty: () => false,
			array: () => [
				{
					msg: 'mock value',
				},
			],
		})

		const next = args => {
			try {
				expect(args).to.have.keys('error', 'status', 'message')
				done()
			} catch (err) {
				done(err)
			}
		}

		validationHander(req, res, next)
	})
})
