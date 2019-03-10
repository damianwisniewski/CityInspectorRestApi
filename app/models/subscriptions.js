module.exports = (sequelize, Sequelize) => {
	const Subscription = sequelize.define('subscription', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
	})

	Subscription.associate = model => {
		Subscription.belongsTo(model.User)
		Subscription.belongsTo(model.Notification)
	}

	return Subscription
}
