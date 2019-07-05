const { Model } = require('sequelize')

module.exports = class Comment extends Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				allowNull: false,
				primaryKey: true,
			},
			text: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
		},
			{
				sequelize,
				modelName: 'Comment'
			})
	}

	static associate(models) {
		Comment.hasMany(models.Comment, { as: 'Subcomment' })
		Comment.belongsTo(models.Notification)
	}
}
