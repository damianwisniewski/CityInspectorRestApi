const { Model } = require('sequelize')
module.exports = class Notification extends Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				allowNull: false,
				primaryKey: true,
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true
				}
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: false,
				validate: {
					notEmpty: true
				}
			},
		},
			{
				sequelize,
				modelName: 'Notification'
			})
	}
}

// module.exports = (queryInterface, Sequelize) => {
// 	const Notification = queryInterface.define('Notification', {
// 		id: {
// 			type: Sequelize.INTEGER,
// 			autoIncrement: true,
// 			allowNull: false,
// 			primaryKey: true,
// 		},
// 		title: Sequelize.STRING,
// 		description: Sequelize.TEXT,
// 		createDate: Sequelize.DATE,
// 		updateDate: Sequelize.DATE,
// 	})

// 	return Notification
// }
