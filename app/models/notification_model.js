const { Model } = require('sequelize')

module.exports = class Notification extends Model {
	static init(sequelize, DataTypes) {
		return super.init(
			{
				id: {
					type: DataTypes.UUID,
					allowNull: false,
					primaryKey: true,
					unique: true,
				},
				title: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: {
						msg: 'This title already exist',
					},
					validate: {
						notEmpty: true,
					},
				},
				description: {
					type: DataTypes.TEXT,
					allowNull: false,
					validate: {
						notEmpty: true,
					},
				},
			},
			{
				sequelize,
				modelName: 'Notification',
			},
		)
	}

	static associate(models) {
		Notification.belongsTo(models.Photo, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
		Notification.belongsTo(models.Localization, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
		Notification.belongsTo(models.Status, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
		Notification.belongsTo(models.Category, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
		Notification.belongsTo(models.User, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
		Notification.hasMany(models.Subscription, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
		Notification.hasMany(models.Comment, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
	}

	/**
	 * Get free photo slots for notification with provided id
	 * @param {import('sequelize').FindOptions} options
	 * @returns {Promise<Object>}
	 */
	static async getFreePhotoSlots(options) {
		const notificationInstance = await Notification.findOne(options)

		if (!notificationInstance) {
			return null
		}

		const photoInstance = await notificationInstance.getPhoto()
		return await photoInstance.getFreeSlots()
	}
}
