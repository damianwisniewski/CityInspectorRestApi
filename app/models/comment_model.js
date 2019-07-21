const { Model } = require('sequelize')

module.exports = class Comment extends Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				allowNull: false,
				primaryKey: true,
				unique: true,
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
		Comment.hasMany(models.Comment, { as: 'Subcomment', onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
		Comment.belongsTo(models.Notification, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
	}
}
