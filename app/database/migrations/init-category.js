module.exports = {
	up: (sequelize, Sequelize) => {
		return sequelize.define('category', {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				allowNull: false,
				primaryKey: true,
			},
			name: Sequelize.STRING,
		})
	},

	down: sequelize => {
		return sequelize.dropTable('Tests')
	},
}
