module.exports = (sequelize, Sequelize) => {
	const Settings = sequelize.define('settings', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		privateData: {
			type: Sequelize.ENUM('Y', 'N'),
			allowNull: false,
			defaultValue: 'Y',
		},
		emailAgreement: {
			type: Sequelize.ENUM('Y', 'N'),
			allowNull: false,
			defaultValue: 'N',
		},
	})

	/**
	 * Creates relations between tables.
	 * Thanks to this kind of connections between tables, sequelize provides some extra functionalities.
	 * http://docs.sequelizejs.com/manual/tutorial/associations.html#associating-objects
	 * @param {Object} model - Object of sequelize data models.
	 */
	Settings.associate = database => {
		Settings.hasMany(database.User)
	}

	return Settings
}
