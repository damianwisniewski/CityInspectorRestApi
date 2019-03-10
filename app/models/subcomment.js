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

	Subcomment.associate = database => {
		Subcomment.belongsTo(database.Comment)
		Subcomment.belongsTo(database.User)
	}

	return Subcomment
}
