module.exports = (queryInterface, Sequelize) => {
	const Subscription = queryInterface.define('Subscription', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
	})

	return Subscription
}
