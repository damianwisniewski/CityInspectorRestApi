module.exports = (sequelize, Sequelize) => {
	return sequelize.define('subscription', {
		userId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'user',
				key: 'id',
			},
		},
		notificationId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'notification',
				key: 'id',
			},
		},
	})
}
