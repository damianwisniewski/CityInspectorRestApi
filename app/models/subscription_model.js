const { Model } = require('sequelize')

module.exports = class Subscription extends Model {
	static init(sequelize, DataTypes) {
		return super.init(
			{
				id: {
					type: DataTypes.INTEGER,
					autoIncrement: true,
					allowNull: false,
					primaryKey: true,
					unique: true,
				},
				changes: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
			},
			{
				sequelize,
				modelName: 'Subscription',
			},
		)
	}

	static associate(models) {
		Subscription.belongsTo(models.Notification, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
		Subscription.belongsTo(models.User, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
	}
}
