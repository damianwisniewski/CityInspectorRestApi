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

	/**
	 * Creates relations between tables.
	 * Thanks to this kind of connections between tables, sequelize provides some extra functionalities.
	 * http://docs.sequelizejs.com/manual/tutorial/associations.html#associating-objects
	 * @param {Object} model - Object of sequelize data models.
	 */
	Photos.associate = database => {
		Photos.hasOne(database.Notification)
	}

	return Photos
}
