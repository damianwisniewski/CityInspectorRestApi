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

	return Notification
}
