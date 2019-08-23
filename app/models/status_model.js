const { Model } = require('sequelize')

module.exports = class Status extends Model {
	static get dictionaryValues() {
		return ['zgłoszone', 'zrealizowane', 'w realizacji']
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
				modelName: 'Status',
			},
		)
	}

	static associate(model) {
		Status.hasMany(model.Notification, { onDelete: 'RESTRICT', onUpdate: 'NO ACTION' })
	}

	static createDictionaryValues() {
		Status.dictionaryValues.forEach(value => {
			Status.findOrCreate({
				where: {
					name: value,
				},
			})
		})
	}
}
