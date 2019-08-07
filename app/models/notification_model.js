const { Model } = require('sequelize')
module.exports = class Notification extends Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				allowNull: false,
				primaryKey: true,
				unique: true,
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
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

	static associate(models) {
		Notification.belongsTo(models.Photo, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
		Notification.belongsTo(models.Localization, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
		Notification.hasMany(models.Subscription, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
	}
}
