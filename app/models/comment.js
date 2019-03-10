module.exports = (sequelize, Sequelize) => {
	const Comment = sequelize.define('comment', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			unique: 'compositeIndex',
			defaultValue: Sequelize.UUIDV4,
		},
		userId: {
			type: Sequelize.INTEGER,
			references: {
				model: 'users',
				key: 'id',
			},
		},
		notificationId: {
			type: Sequelize.INTEGER,
			references: {
				model: 'notifications',
				key: 'id',
			},
		},
		text: Sequelize.TEXT,
		createDate: Sequelize.DATE,
		modificationDate: Sequelize.DATE,
	})

	Comment.associate = database => {
		Comment.belongsTo(database.User)
		Comment.belongsTo(database.Notification)
		Comment.hasMany(database.Subcomment)
	}

	return Comment
}
