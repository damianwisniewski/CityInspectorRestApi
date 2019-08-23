const { Model } = require('sequelize')

module.exports = class Photo extends Model {
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
				photo1: {
					type: DataTypes.STRING,
					unique: true,
					validate: {
						isUrl: true,
					},
				},
				photo2: {
					type: DataTypes.STRING,
					unique: true,
					validate: {
						isUrl: true,
					},
				},
				photo3: {
					type: DataTypes.STRING,
					unique: true,
					validate: {
						isUrl: true,
					},
				},
				photo4: {
					type: DataTypes.STRING,
					unique: true,
					validate: {
						isUrl: true,
					},
				},
				photo5: {
					type: DataTypes.STRING,
					unique: true,
					validate: {
						isUrl: true,
					},
				},
			},
			{
				sequelize,
				modelName: 'Photos',
			},
		)
	}
}
