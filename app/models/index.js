const Sequelize = require('sequelize')
const sequelize = require('../services/database')

/**
 * DO NOT CHANGE ORDER !!!
 * Some tabels have foreign keys with refferences to others,
 * to use those referencess correctly some tables have to be created before others.
 */
const User = require('./user')(sequelize, Sequelize)
const Settings = require('./settings')(sequelize, Sequelize)
const Category = require('./category')(sequelize, Sequelize)
const Localization = require('./localization')(sequelize, Sequelize)
const Photos = require('./photos')(sequelize, Sequelize)
const Notification = require('./notification')(sequelize, Sequelize)
const Subscription = require('./subscriptions')(sequelize, Sequelize)
const Comment = require('./comment')(sequelize, Sequelize)
const Subcomment = require('./subcomment')(sequelize, Sequelize)

const models = {
	User,
	Settings,
	Category,
	Localization,
	Photos,
	Notification,
	Subscription,
	Comment,
	Subcomment,
}

for (const model in models) {
	const databaseModel = models[model]

	if (databaseModel.associate) {
		databaseModel.associate(models)
	}
}

module.exports = models
