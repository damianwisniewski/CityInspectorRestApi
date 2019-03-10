module.exports = (sequelize, Sequelize) => {
	return sequelize.define('subcomment', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			unique: 'compositeIndex',
			defaultValue: Sequelize.UUIDV4,
		},
		commentId: {
			type: Sequelize.INTEGER,
			references: {
				model: 'comment',
				key: 'id',
			},
		},
		text: Sequelize.TEXT,
		createDate: Sequelize.DATE,
		modificationDate: Sequelize.DATE,
	})
}
