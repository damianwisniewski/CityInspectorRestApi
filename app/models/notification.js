module.exports = (sequelize, Sequelize) => {
	const Notification = sequelize.define('notification', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		title: Sequelize.STRING,
		description: Sequelize.TEXT,
		status: Sequelize.ENUM('status-1', 'status-2', 'status-3', 'status-4'),
		category: Sequelize.ENUM('status-1', 'status-2', 'status-3', 'status-4'),
		createDate: Sequelize.DATE,
		updateDate: Sequelize.DATE,
	})

	Notification.associate = database => {
		Notification.belongsTo(database.User)
		Notification.belongsTo(database.Localization)
		Notification.belongsTo(database.Photos)
	}

	return Notification
}
