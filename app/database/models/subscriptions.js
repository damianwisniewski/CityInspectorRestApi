module.exports = (sequelize, Sequelize) => {
	const Subscription = sequelize.define('subscription', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
	})

	/**
	 * Creates relations between tables.
	 * Thanks to this kind of connections between tables, sequelize provides some extra functionalities.
	 * http://docs.sequelizejs.com/manual/tutorial/associations.html#associating-objects
	 * @param {Object} model - Object of sequelize data models.
	 */
	Subscription.associate = model => {
		Subscription.belongsTo(model.User)
		Subscription.belongsTo(model.Notification)
	}

	return Subscription
}
