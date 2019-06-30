const { Model } = require('sequelize')
module.exports = class Localization extends Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				allowNull: false,
				primaryKey: true,
			},
			lat: {
				type: DataTypes.FLOAT,
				allowNull: false,
				validate: {
					isFloat: true
				}
			},
			lan: {
				type: DataTypes.FLOAT,
				allowNull: false,
				validate: {
					isFloat: true
				}
			},
			city: {
				type: DataTypes.STRING,
				validate: {
					isAlpha: true
				}
			},
			street: {
				type: DataTypes.STRING,
				validate: {
					isAlphanumeric: true
				}
			},
			number: {
				type: DataTypes.STRING,
				validate: {
					isAlphanumeric: true
				}
			},
			post: {
				type: DataTypes.STRING,
				validate: {
					is: /\d{2}-\d{3}/g
				}
			},
		},
			{
				sequelize,
				modelName: 'Localization'
			})
	}

	static associate(models) {
		Localization.hasOne(models.Notification)
	}
}

// module.exports = (queryInterface, Sequelize) => {
// 	const Localization = queryInterface.define('Localization', {
// 		id: {
// 			type: Sequelize.INTEGER,
// 			autoIncrement: true,
// 			allowNull: false,
// 			primaryKey: true,
// 		},
// 		lat: Sequelize.FLOAT,
// 		lan: Sequelize.FLOAT,
// 		city: Sequelize.STRING,
// 		street: Sequelize.STRING,
// 		number: Sequelize.STRING,
// 		post: Sequelize.STRING,
// 	})

// 	/**
// 	 * Creates relations between tables.
// 	 * Thanks to this kind of connections between tables, sequelize provides some extra functionalities.
// 	 * http://docs.sequelizejs.com/manual/tutorial/associations.html#associating-objects
// 	 * @param {Object} model - Object of sequelize data models.
// 	 */
// 	Localization.associate = database => {
// 		Localization.hasOne(database.Notification)
// 	}

// 	return Localization
// }
