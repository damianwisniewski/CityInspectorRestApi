const {
	sequelize,
	dataTypes,
	checkModelName,
	checkPropertyExists,
} = require('sequelize-test-helpers')

const db = require('../')

describe('User database model', () => {
	const { User } = db.models

	it('sss', () => {
		checkModelName(User)('s')
		// context('properties', () => {
		// 	['name', 'email'].forEach(checkPropertyExists(User))
		// })
	})
})