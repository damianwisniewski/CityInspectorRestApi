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

	/**
	 * Creates relations between tables.
	 * Thanks to this kind of connections between tables, sequelize provides some extra functionalities.
	 * http://docs.sequelizejs.com/manual/tutorial/associations.html#associating-objects
	 * @param {Object} model - Object of sequelize data models.
	 */
	Localization.associate = database => {
		Localization.hasOne(database.Notification)
	}

	return Localization
}
