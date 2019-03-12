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
		createDate: Sequelize.DATE,
		updateDate: Sequelize.DATE,
	})

	/**
	 * Creates relations between tables.
	 * Thanks to this kind of connections between tables, sequelize provides some extra functionalities.
	 * http://docs.sequelizejs.com/manual/tutorial/associations.html#associating-objects
	 * @param {Object} model - Object of sequelize data models.
	 */
	Notification.associate = database => {
		Notification.belongsTo(database.User)
		Notification.belongsTo(database.Localization)
		Notification.belongsTo(database.Photos)
		Notification.belongsTo(database.Category)
		Notification.belongsTo(database.Status)
	}

	return Notification
}
