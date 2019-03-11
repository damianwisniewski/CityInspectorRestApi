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

	/**
	 * Creates relations between tables.
	 * Thanks to this kind of connections between tables, sequelize provides some extra functionalities.
	 * http://docs.sequelizejs.com/manual/tutorial/associations.html#associating-objects
	 * @param {Object} model - Object of sequelize data models.
	 */
	Comment.associate = database => {
		Comment.belongsTo(database.User)
		Comment.belongsTo(database.Notification)
		Comment.hasMany(database.Comment, { as: 'Subcomment' })
		Comment.belongsTo(database.Comment)
	}

	return Comment
}
