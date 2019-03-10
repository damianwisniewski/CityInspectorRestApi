module.exports = (sequelize, Sequelize) => {
	return sequelize.define('category', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		name: Sequelize.ENUM('status-1', 'status-2', 'status-3', 'status-4'),
	})
}
