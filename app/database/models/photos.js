const { Model } = require('sequelize')
module.exports = class Photos extends Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				primaryKey: true,
			},
			location: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			photo1: {
				type: DataTypes.STRING,
				validate: {
					isUrl: true,
				}
			},
			photo2: {
				type: DataTypes.STRING,
				validate: {
					isUrl: true,
				}
			},
			photo3: {
				type: DataTypes.STRING,
				validate: {
					isUrl: true,
				}
			},
			photo4: {
				type: DataTypes.STRING,
				validate: {
					isUrl: true,
				}
			},
			photo5: {
				type: DataTypes.STRING,
				validate: {
					isUrl: true,
				}
			},
		},
			{
				sequelize,
				modelName: 'Photos'
			})
	}

	static associate(model) {
		Photos.hasOne(model.Notification)
	}
}

// module.exports = (queryInterface, Sequelize) => {
// 	const Photos = queryInterface.define('Photos', {
// 		id: {
// 			type: Sequelize.UUID,
// 			defaultValue: Sequelize.UUIDV4,
// 			allowNull: false,
// 			primaryKey: true,
// 		},
// 		location: {
// 			type: Sequelize.STRING,
// 			allowNull: false,
// 		},
// 		photo1: Sequelize.STRING,
// 		photo2: Sequelize.STRING,
// 		photo3: Sequelize.STRING,
// 		photo4: Sequelize.STRING,
// 		photo5: Sequelize.STRING,
// 	})

// 	/**
// 	 * Creates relations between tables.
// 	 * Thanks to this kind of connections between tables, sequelize provides some extra functionalities.
// 	 * {@link http://docs.sequelizejs.com/manual/tutorial/associations.html#associating-objects}
// 	 * @param {Object} model - Object of sequelize data models.
// 	 */
// 	Photos.associate = database => {
// 		Photos.hasOne(database.Notification)
// 	}

// 	return Photos
// }
