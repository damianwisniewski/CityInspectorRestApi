const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')

const { DATABASE_CONFIG } = require('../config')
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
 * @typedef {import('sequelize/types/lib/model').Model} Model
 * @typedef {import('sequelize').Sequelize} Sequelize
 */

/**
 * @typedef {Object} Database
 * @property {Sequelize} Database.Sequelize - Sequelize class, provides many static methods and DataTypes
 * @property {Object} Database.models - Contains all created sequelize data models
 * @property {Model} Database.models.Category - Database model (SQL Table)
 * @property {Model} Database.models.Comment - Database model (SQL Table)
 * @property {Model} Database.models.Localization - Database model (SQL Table)
 * @property {Model} Database.models.Notification - Database model (SQL Table)
 * @property {Model} Database.models.Photo - Database model (SQL Table)
 * @property {Model} Database.models.Status - Database model (SQL Table)
 * @property {Model} Database.models.Subscription - Database model (SQL Table)
 * @property {Model} Database.models.User - Database model (SQL Table)
 */

/**
 * @type {Database}
 */
module.exports = {
	Sequelize,
	sequelize,
	models,
}
