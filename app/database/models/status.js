module.exports = (sequelize, Sequelize) => {
	const Status = sequelize.define('status', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		name: Sequelize.STRING,
	})

	/**
	 * Creates relations between tables.
	 * Thanks to this kind of connections between tables, sequelize provides some extra functionalities.
	 * http://docs.sequelizejs.com/manual/tutorial/associations.html#associating-objects
	 * @param {Object} model - Object of sequelize data models.
	 */
	Status.associate = model => {
		Status.hasMany(model.Notification)
	}

	return Status
}
