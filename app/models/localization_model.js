const { Model } = require('sequelize')
module.exports = class Localization extends Model {
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
				lat: {
					type: DataTypes.FLOAT,
					allowNull: false,
					validate: {
						isFloat: true,
					},
				},
				lan: {
					type: DataTypes.FLOAT,
					allowNull: false,
					validate: {
						isFloat: true,
					},
				},
				city: {
					type: DataTypes.STRING,
					validate: {
						is: /[\da-zA-ZĄĆĘŁŃÓŚŹŻąćęłńóśźż-]/g,
					},
				},
				street: {
					type: DataTypes.STRING,
					validate: {
						is: /[-/\da-zA-ZĄĆĘŁŃÓŚŹŻąćęłńóśźż]/g,
					},
				},
				number: {
					type: DataTypes.STRING,
					validate: {
						is: /[-/\da-zA-ZĄĆĘŁŃÓŚŹŻąćęłńóśźż]/g,
					},
				},
				post: {
					type: DataTypes.STRING,
					validate: {
						is: /\d{2}-\d{3}/g,
					},
				},
			},
			{
				sequelize,
				modelName: 'Localization',
			},
		)
	}
}
