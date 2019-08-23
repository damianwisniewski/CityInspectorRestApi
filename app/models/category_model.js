const { Model } = require('sequelize')
module.exports = class Category extends Model {
	static get dictionaryValues() {
		return [
			'niebezpieczne miejsca',
			'uszkodzenia',
			'zaniedbana zieleń',
			'zanieczyszczona przestrzeń',
		]
	}

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
				name: {
					type: DataTypes.STRING,
					allowNull: false,
				},
			},
			{
				sequelize,
				modelName: 'Category',
			},
		)
	}

	static associate(models) {
		Category.hasMany(models.Notification, { onDelete: 'RESTRICT', onUpdate: 'NO ACTION' })
	}

	static createDictionaryValues() {
		Category.dictionaryValues.forEach(value => {
			Category.findOrCreate({
				where: {
					name: value,
				},
			})
		})
	}
}
