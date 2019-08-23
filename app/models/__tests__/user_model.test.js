const Sequelize = require('sequelize')
const { checkPropertyExists } = require('sequelize-test-helpers')
const { expect, ...chai } = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const db = require('..')

chai.use(sinonChai)
const Op = Sequelize.Op

describe('User database model', () => {
	const { User, Notification, Comment, Subscription } = db.models
	const UserInstance = new User()

	context('has all required params', () => {
		;['id', 'name', 'surname', 'gender', 'nickname', 'email', 'password', 'emailAgreement'].forEach(
			checkPropertyExists(UserInstance),
		)
	})

	context('has proper associations', () => {
		const ModelsToAssociate = [Notification, Comment, Subscription]

		beforeEach(() => {
			sinon.spy(User, 'hasMany')
			User.associate(db.models)
		})

		afterEach(() => {
			User.hasMany.restore()
		})

		ModelsToAssociate.forEach(model => {
			it(`with model ${model.name}`, () => {
				expect(User.hasMany).to.have.been.calledWith(model)
			})
		})
	})

	context('has proper data validation of inserction data', () => {
		beforeEach(async () => {
			await User.destroy({
				where: {
					[Op.or]: [{ email: 'sadas@op.pl' }, { nickname: 'dafasd' }],
				},
			})
		})

		const defaultMockUserData = {
			name: 'dafgdfsd',
			surname: 'dasfss',
			email: 'sadas@op.pl',
			nickname: 'dafasd',
			password: 'ssssdsfsdsdsd',
			gender: 'M',
			emailAgreement: 'Y',
		}

		const testValidationData = {
			name: new Map([
				['mock', true],
				['Name', true],
				['Ęąćźdżśńół', true],
				['mock_name', false],
				['mock-name', false],
				['mockName12', false],
				['mock name', false],
			]),

			surname: new Map([
				['mock', true],
				['Name', true],
				['Ęąćźdżśńół', true],
				['mock name', true],
				['mock-name', true],
				['mock_name', false],
				['mockName12', false],
			]),

			email: new Map([
				['mock@cos.pl', true],
				['mock_cos2@example.org', true],
				['ssfsasada', false],
				['mock name', false],
			]),

			nickname: new Map([
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

			passpord: new Map([
				['mock', true],
				['Name', true],
				['Ęąćźdżśńół', true],
				['mock-name', true],
				['mock_name', true],
				['mockName12', true],
				['mock name', true],
				['mock@name', true],
				['mock.name', true],
				['mock/name', true],
			]),

			gender: new Map([['M', true], ['F', true], ['A', false], ['Ya', false]]),

			emailAgreement: new Map([['Y', true], ['N', true], ['A', false], ['Ya', false]]),
		}

		for (const key in testValidationData) {
			const scenario = testValidationData[key]

			context(`${key} validation`, () => {
				for (const [value, expectation] of scenario) {
					it(`for value "${value}" should ${expectation ? 'pass' : 'fail'}`, async () => {
						try {
							await User.create({
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

	context('Static method - generateDataHash', () => {
		it('should return hashed passpord string', async () => {
			const passport = 'some_fake_passpoword'
			const hashedPassport = await User.generateDataHash(passport)

			expect(hashedPassport)
				.to.be.a('string')
				.and.to.not.be.empty.and.not.equal(passport)
		})
	})

	context("Created instance's method validateDataHash", () => {
		let UserInstance

		before(async () => {
			;[UserInstance] = await User.findOrCreate({
				where: {
					email: 'sada@op.pl',
				},
				defaults: {
					name: 'dafgdfsd',
					surname: 'dasfss',
					email: 'sadas@op.pl',
					nickname: 'dafasd',
					password: 'ssssdsfsdsdsd',
					gender: 'M',
				},
			})
		})

		it('should return true for correct password', async () => {
			const validityResult = await UserInstance.validateDataHash('ssssdsfsdsdsd')

			expect(validityResult).to.be.true
		})

		it('should return false for incorrect password', async () => {
			const validityResult = await UserInstance.validateDataHash('ssssdsfs')

			expect(validityResult).to.be.false
		})
	})
})
