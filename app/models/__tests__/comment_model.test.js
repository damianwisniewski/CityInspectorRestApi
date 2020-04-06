const { checkPropertyExists } = require('sequelize-test-helpers')
const { expect, ...chai } = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const db = require('..')

chai.use(sinonChai)

describe('Comment database model', () => {
	const { Comment, Notification } = db.models
	const CommentInstance = new Comment()

	context('has all required params', () => {
		;['id', 'text', 'NotificationId'].forEach(checkPropertyExists(CommentInstance))
	})

	context('has proper association', () => {
		before(() => {
			sinon.stub(Comment, 'hasMany').callsFake(() => {})
			sinon.stub(Comment, 'belongsTo').callsFake(() => {})
			Comment.associate({ Comment, Notification })
		})

		after(() => {
			Comment.hasMany.restore()
			Comment.belongsTo.restore()
		})

		it(`with model Notification`, () => {
			expect(Comment.belongsTo).to.have.been.calledWithExactly(Notification, {
				onDelete: 'CASCADE',
				onUpdate: 'NO ACTION',
			})
		})
	})
})
