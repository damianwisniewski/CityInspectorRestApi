module.exports = (sequelize, Sequelize) => {
	return sequelize.define('photos', {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV1,
			allowNull: false,
			primaryKey: true,
		},
		location: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		photo1: Sequelize.STRING,
		photo2: Sequelize.STRING,
		photo3: Sequelize.STRING,
		photo4: Sequelize.STRING,
		photo5: Sequelize.STRING,
	})
}
