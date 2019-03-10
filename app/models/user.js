module.exports = (sequelize, Sequelize) => {
	return sequelize.define('user', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		name: Sequelize.STRING,
		surname: Sequelize.STRING,
		nickname: Sequelize.STRING,
		email: Sequelize.STRING,
		password: {},
		settingsId: {
			type: Sequelize.INTEGER,
			references: {
				model: 'settings',
				key: 'id',
			},
		},
		createDate: Sequelize.DATE,
	})
}
