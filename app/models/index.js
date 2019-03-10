const Sequelize = require('sequelize')
const sequelize = require('../services/database')

const User = require('./user')(sequelize, Sequelize)
const Settings = require('./settings')(sequelize, Sequelize)
const Subscription = require('./subscriptions')(sequelize, Sequelize)
const Notification = require('./notification')(sequelize, Sequelize)
const Photos = require('./photos')(sequelize, Sequelize)
const Comment = require('./comment')(sequelize, Sequelize)
const Subcomment = require('./subcomment')(sequelize, Sequelize)
const Localization = require('./localization')(sequelize, Sequelize)
const Category = require('./category')(sequelize, Sequelize)

Settings.hasMany(User)

User.hasMany(Subscription)
User.hasMany(Notification)
User.hasMany(Comment)
User.hasMany(Subcomment)

Subscription.belongsTo(User)
Subscription.belongsTo(Notification)

Notification.belongsTo(Photos)
Notification.belongsTo(Localization)
Category.hasMany(Notification)

Subcomment.belongsToMany(Comment)

exports.db = {
	User,
	Settings,
	Subscription,
	Notification,
	Photos,
	Comment,
	Subcomment,
	Localization,
	Category,
}
