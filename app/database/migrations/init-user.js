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
		gender: Sequelize.ENUM('M', 'F'),
		nickname: Sequelize.STRING,
		email: Sequelize.STRING,
		password: {
			type: Sequelize.STRING,
			allowNull: false,
		},
	})
}
