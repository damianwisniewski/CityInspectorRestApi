module.exports = (sequelize, Sequelize) => {
	const Subscription = sequelize.define('subscription', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
	})

	return Subscription
}
