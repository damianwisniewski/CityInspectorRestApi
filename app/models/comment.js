module.exports = (sequelize, Sequelize) => {
	return sequelize.define('comment', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			unique: 'compositeIndex',
			defaultValue: Sequelize.UUIDV4,
		},
		userId: {
			type: Sequelize.INTEGER,
			references: {
				model: 'user',
				key: 'id',
			},
		},
		notificationId: {
			type: Sequelize.INTEGER,
			references: {
				model: 'notification',
				key: 'id',
			},
		},
		text: Sequelize.TEXT,
		createDate: Sequelize.DATE,
		modificationDate: Sequelize.DATE,
	})
}
