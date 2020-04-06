const Sequelize = require('sequelize')
const { checkPropertyExists } = require('sequelize-test-helpers')
const { expect, ...chai } = require('chai')
const sinonChai = require('sinon-chai')
const db = require('..')

chai.use(sinonChai)
const Op = Sequelize.Op

describe('Photo database model', () => {
	const { Photo } = db.models
	const PhotoInstance = new Photo()

	context('has all required params', () => {
		;['id', 'photo1', 'photo2', 'photo3', 'photo4', 'photo5'].forEach(
			checkPropertyExists(PhotoInstance),
		)
	})
})
