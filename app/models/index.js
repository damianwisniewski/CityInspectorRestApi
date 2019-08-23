const fs = require('fs')
const path = require('path')
const { DATABASE_CONFIG } = require('../config')

const Sequelize = require('sequelize')
const sequelize = new Sequelize(DATABASE_CONFIG)

const models = {}

/**
 * Gets all model files names from model directory and inits them
 */
fs.readdirSync(__dirname).forEach(file => {
	if (file === 'index.js' || file === '__tests__') {
		return
	}

	const model = require(path.join(`${__dirname}/${file}`))
	models[model.name] = model.init(sequelize, Sequelize)
})

/**
 * Creates associations between models
 */
Object.keys(models).forEach(model => {
	const dbModel = models[model]

	if (dbModel.associate) {
		dbModel.associate(models)
	}
})

/**
 * After connection fills dictionary tables with proper values
 */
sequelize.afterConnect(() => {
	Object.keys(models).forEach(model => {
		const dbModel = models[model]

		if (dbModel.createDictionaryValues) {
			dbModel.createDictionaryValues()
		}
	})
})

/**
 * @typedef {Object} Database
 * @property {Sequelize} Database.Sequelize - Sequelize class, provides many static methods and DataTypes
 * @property {Sequelize.Instance} Database.sequelize - Created instance of Sequelize class and connects to database.
 * @property {Object} Database.models - Contains all created sequelize data models
 * @property {Sequelize.Model} Database.models.Category - Database model (SQL Table)
 * @property {Sequelize.Model} Database.models.Comment - Database model (SQL Table)
 * @property {Sequelize.Model} Database.models.Localization - Database model (SQL Table)
 * @property {Sequelize.Model} Database.models.Notification - Database model (SQL Table)
 * @property {Sequelize.Model} Database.models.Photo - Database model (SQL Table)
 * @property {Sequelize.Model} Database.models.Status - Database model (SQL Table)
 * @property {Sequelize.Model} Database.models.Subscription - Database model (SQL Table)
 * @property {Sequelize.Model} Database.models.User - Database model (SQL Table)
 */

/**
 * @type {Database}
 */
module.exports = {
	Sequelize,
	sequelize,
	models,
}
