module.exports = (sequelize, Sequelize) => {
	return sequelize.define('notification', {
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
		userId: {
			type: Sequelize.INTEGER,
			references: {
				model: 'user',
				key: 'id',
			},
		},
		photosId: {
			type: Sequelize.INTEGER,
			references: {
				model: 'photos',
				key: 'id',
			},
		},
		localizationId: {
			type: Sequelize.INTEGER,
			references: {
				model: 'localozation',
				key: 'id',
			},
		},
		createDate: Sequelize.DATE,
		updateDate: Sequelize.DATE,
	})
}
