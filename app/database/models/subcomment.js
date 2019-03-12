module.exports = (sequelize, Sequelize) => {
	const Subcomment = sequelize.define('subcomment', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			unique: 'compositeIndex',
			defaultValue: Sequelize.UUIDV4,
		},
		text: Sequelize.TEXT,
		createDate: Sequelize.DATE,
		modificationDate: Sequelize.DATE,
	})

	/**
	 * Creates relations between tables.
	 * Thanks to this kind of connections between tables, sequelize provides some extra functionalities.
	 * http://docs.sequelizejs.com/manual/tutorial/associations.html#associating-objects
	 * @param {Object} model - Object of sequelize data models.
	 */
	Subcomment.associate = database => {
		Subcomment.belongsTo(database.Comment)
		Subcomment.belongsTo(database.User)
	}

	return Subcomment
}
