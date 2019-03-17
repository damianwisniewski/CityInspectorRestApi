module.exports = (queryInterface, Sequelize) => {
	const User = require('./user')(queryInterface, Sequelize)
	const Settings = require('./settings')(queryInterface, Sequelize)
	const Category = require('./category')(queryInterface, Sequelize)
	const Status = require('./category')(queryInterface, Sequelize)
	const Localization = require('./localization')(queryInterface, Sequelize)
	const Photos = require('./photos')(queryInterface, Sequelize)
	const Notification = require('./notification')(queryInterface, Sequelize)
	const Subscription = require('./subscriptions')(queryInterface, Sequelize)
	const Comment = require('./comment')(queryInterface, Sequelize)

	const models = {
		User,
		Settings,
		Category,
		Status,
		Localization,
		Photos,
		Notification,
		Subscription,
		Comment,
	}

	for (const model in models) {
		const databaseModel = models[model]
		if (databaseModel.associate) {
			databaseModel.associate(models)
		}
	}

	return models
}
