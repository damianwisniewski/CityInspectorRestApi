module.exports = (queryInterface, Sequelize) => {
	const User = queryInterface.define('User', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		name: Sequelize.STRING,
		surname: Sequelize.STRING,
		gender: Sequelize.ENUM('M', 'F'),
		nickname: Sequelize.STRING,
		email: Sequelize.STRING,
		password: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
		privateData: {
			type: Sequelize.ENUM('Y', 'N'),
			allowNull: false,
			defaultValue: 'Y',
		},
		emailAgreement: {
			type: Sequelize.ENUM('Y', 'N'),
			allowNull: false,
			defaultValue: 'N',
		},
	})

	/**
	 * Creates relations between tables.
	 * Thanks to this kind of connections between tables, sequelize provides some extra functionalities.
	 * http://docs.sequelizejs.com/manual/tutorial/associations.html#associating-objects
	 * @param {Object} model - Object of sequelize data models.
	 */
	User.associate = model => {
		User.hasMany(model.Notification)
		User.hasMany(model.Comment)
		User.hasMany(model.Subscription)
	}

	/**
	 * Generates fake data
	 * @param {number} amount - number of fake data rows to generate
	 */
	// User.createFakeData = (amount = 10) => {
	// const data = []
	// for (let i = 0; i < amount; i++) {
	// data.push({
	// User.create(
	// 	{
	// 		name: faker.name.firstName(),
	// 		surname: faker.name.lastName(),
	// 		nickname: faker.internet.userName(),
	// 		email: faker.internet.email(null, null, 'example.com'),
	// 		Settings: {
	// 			privateData: 'Y',
	// 			emailAgreement: 'N',
	// 		},
	// 	},
	// 	{
	// 		include: ['Settings'],
	// 	}
	// )
	// 	.then(() => {
	// 		console.log('działa')
	// 	})
	// 	.catch(err => console.log(err))
	// }
	// User.bulkCreate()
	// 	.then(() => {
	// 		console.log('działa')
	// 	})
	// 	.catch(err => console.log(err))
	// }

	return User
}
