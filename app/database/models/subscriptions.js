const { Model } = require('sequelize')
module.exports = class Subscriptions extends Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				allowNull: false,
				primaryKey: true,
			}
		},
			{
				sequelize,
				modelName: 'Subscriptions'
			})
	}
}
