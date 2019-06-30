const { Model } = require('sequelize')
module.exports = class Comment extends Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				unique: 'compositeIndex',
				defaultValue: DataTypes.UUIDV4,
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
	}
}


// module.exports = (queryInterface, Sequelize) => {
// 	const Comment = queryInterface.define('Comment', {
// 		id: {
// 			type: Sequelize.INTEGER,
// 			primaryKey: true,
// 			unique: 'compositeIndex',
// 			defaultValue: Sequelize.UUIDV4,
// 		},
// 		text: Sequelize.TEXT,
// 		createDate: Sequelize.DATE,
// 		modificationDate: Sequelize.DATE,
// 	})

// 	/**
// 	 * Creates relations between tables.
// 	 * Thanks to this kind of connections between tables, sequelize provides some extra functionalities.
// 	 * http://docs.sequelizejs.com/manual/tutorial/associations.html#associating-objects
// 	 * @param {Object} model - Object of sequelize data models.
// 	 */
// 	Comment.associate = database => {
// 		Comment.hasMany(database.Comment, { as: 'Subcomment' })
// 	}

// 	return Comment
// }
