module.exports = (sequelize, Sequelize) => {
	const Localization = sequelize.define('localization', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		lat: Sequelize.FLOAT,
		lan: Sequelize.FLOAT,
		city: Sequelize.STRING,
		street: Sequelize.STRING,
		number: Sequelize.STRING,
		post: Sequelize.STRING,
	})

	return Localization
}
