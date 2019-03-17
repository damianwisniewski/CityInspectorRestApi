// const fs = require('fs')
// const path = require('path')
const Sequelize = require('sequelize')

const env = process.env.NODE_ENV || 'development'
const config = require('../../config/database-config.js')[env]

/**
 * @typedef {Object} Database
 * @property {Sequelize} Database.Sequelize - Sequelize class, provides many static methods and DataTypes
 * @property {Sequelize.Instance} Database.sequelize - Created instance of Sequelize class and connects to database.
 * @property {Object} Database.models - Contains all created sequelize data models
 * @property {Sequelize.Model} Database.models.Category - Database model (SQL Table)
 * @property {Sequelize.Model} Database.models.Comment - Database model (SQL Table)
 * @property {Sequelize.Model} Database.models.Localization - Database model (SQL Table)
 * @property {Sequelize.Model} Database.models.Notification - Database model (SQL Table)
 * @property {Sequelize.Model} Database.models.Photos - Database model (SQL Table)
 * @property {Sequelize.Model} Database.models.Status - Database model (SQL Table)
 * @property {Sequelize.Model} Database.models.Subscription - Database model (SQL Table)
 * @property {Sequelize.Model} Database.models.User - Database model (SQL Table)
 */

/**
 * @type {Database}
 */
const db = {
	Sequelize,
	sequelize: new Sequelize(config),
	models: {
		Category: db.sequelize.import('./models/Category'),
		Comment: db.sequelize.import('./models/Comment'),
		Localization: db.sequelize.import('./models/Localization'),
		Notification: db.sequelize.import('./models/Notification'),
		Photos: db.sequelize.import('./models/Photos'),
		Status: db.sequelize.import('./models/Status'),
		Subscription: db.sequelize.import('./models/Subscription'),
		User: db.sequelize.import('./models/User'),
	},
}

// /**
//  * Gets all model files names from model directory.
//  *
//  */
// fs.readdirSync(`${__dirname}/models`).forEach(file => {
// 	const model = db.sequelize['import'](path.join(`${__dirname}/models`, file))
// 	db.models[model.name] = model
// })

/**
 * Creates associations between models and fills dictionary tables with proper values
 */
db.models.forEach(model => {
	if (model.associate) {
		model.associate(db)
	}
	if (model.createDefaultValues) {
		model.createDictionaryValues()
	}
})

module.exports = db
