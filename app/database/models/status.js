const { Model } = require('sequelize')
module.exports = class Status extends Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				allowNull: false,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
			{
				sequelize,
				modelName: 'Status'
			})
	}

	static associate(model) {
		Status.hasMany(model.Notification)
	}
}


// module.exports = (queryInterface, Sequelize) => {
// 	const Status = queryInterface.define('Status', {
// 		id: {
// 			type: Sequelize.INTEGER,
// 			autoIncrement: true,
// 			allowNull: false,
// 			primaryKey: true,
// 		},
// 		name: Sequelize.STRING,
// 	})

// 	/**
// 	 * Creates relations between tables.
// 	 * Thanks to this kind of connections between tables, sequelize provides some extra functionalities.
// 	 * http://docs.sequelizejs.com/manual/tutorial/associations.html#associating-objects
// 	 * @param {Object} model - Object of sequelize data models.
// 	 */
// 	Status.associate = model => {
// 		Status.hasMany(model.Notification)
// 	}

// 	/**
// 	 * "Data dictionary" tables should keep some read-only data, to describe some content in a unified way.
// 	 * Makes sure the table is filled with specified data, if not, those data will be created.
// 	 */
// 	Status.createDictionaryValues = () => {
// 		const defaultValues = ['test1', 'test2', 'test3']

// 		defaultValues.forEach(value => {
// 			Status.findOrCreate({
// 				where: {
// 					name: value,
// 				},
// 			})
// 		})
// 	}

// 	return Status
// }
