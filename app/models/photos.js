module.exports = (sequelize, Sequelize) => {
	const Photos = sequelize.define('photos', {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
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

	Photos.associate = database => {
		Photos.hasOne(database.Notification)
	}

	return Photos
}
