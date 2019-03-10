module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define('user', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		name: Sequelize.STRING,
		surname: Sequelize.STRING,
		nickname: Sequelize.STRING,
		email: Sequelize.STRING,
		createDate: Sequelize.DATE,
	})

	User.associate = model => {
		User.belongsTo(model.Settings)
		User.hasMany(model.Notification)
		User.hasMany(model.Comment)
		User.hasMany(model.Subcomment)
		User.hasMany(model.Subscription)
	}

	User.createFakeData = amount => {
		for (let i = 0; i < amount; i++) {
			// User.createDate()
		}
	}

	return User
}
