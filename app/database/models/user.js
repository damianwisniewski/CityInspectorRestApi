const { Model } = require('sequelize')
const bcrypt = require('bcrypt')

module.exports = class User extends Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.INTEGER(6),
				autoIncrement: true,
				allowNull: false,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				validate: {
					isAlphanumeric: true,
					min: 5,
				}
			},
			surname: {
				type: DataTypes.STRING,
				validate: {
					isAlpha: true,
					notEmpty: true
				}
			},
			gender: {
				type: DataTypes.ENUM('M', 'F'),
				validate: {
					isIn: [['M', 'F']],
				}
			},
			nickname: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					isAlphanumeric: true,
					notEmpty: true
				}
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					isEmail: true,
				}
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
				}
			},
			privateData: {
				type: DataTypes.ENUM('Y', 'N'),
				allowNull: false,
				defaultValue: 'Y',
				validate: {
					isIn: [['Y', 'N']],
				}
			},
			emailAgreement: {
				type: DataTypes.ENUM('Y', 'N'),
				allowNull: false,
				defaultValue: 'N',
				validate: {
					isIn: [['Y', 'N']],
				}
			},
		},
			{
				sequelize,
				modelName: 'User'
			})
	}

	static associate(model) {
		User.hasMany(model.Notification)
		User.hasMany(model.Comment)
		User.hasMany(model.Subscription)
	}

	static generateHash(password) {
		return bcrypt.hash(password, bcrypt.genSaltSync(8))
	}

	validPassword(password) {
		return bcrypt.compare(password, this.password)
	}
}

// module.exports = (queryInterface, Sequelize) => {
// 	/**
// 	 * @contructs User table model
// 	 */
// 	const User = queryInterface.define('User', {
// 		id: {
// 			type: Sequelize.INTEGER,
// 			autoIncrement: true,
// 			allowNull: false,
// 			primaryKey: true,
// 		},
// 		name: Sequelize.STRING,
// 		surname: Sequelize.STRING,
// 		gender: Sequelize.ENUM('M', 'F'),
// 		nickname: Sequelize.STRING,
// 		email: Sequelize.STRING,
// 		password: {
// 			type: Sequelize.INTEGER,
// 			allowNull: true,

// 		},
// 		privateData: {
// 			type: Sequelize.ENUM('Y', 'N'),
// 			allowNull: false,
// 			defaultValue: 'Y',
// 		},
// 		emailAgreement: {
// 			type: Sequelize.ENUM('Y', 'N'),
// 			allowNull: false,
// 			defaultValue: 'N',
// 		},
// 	})

// 	/**
// 	 * @static
// 	 * Creates relations between tables.
// 	 * Thanks to this kind of connections between tables, sequelize provides some extra functionalities.
// 	 * http://docs.sequelizejs.com/manual/tutorial/associations.html#associating-objects
// 	 * @param {Object} model - Object of sequelize data models.
// 	 */
// 	User.associate = model => {
// 		User.hasMany(model.Notification)
// 		User.hasMany(model.Comment)
// 		User.hasMany(model.Subscription)
// 	}

// 	/**
// 	 * 
// 	 */
// 	User.prototype.generateHash = password => bcrypt.hash(password, bcrypt.genSaltSync(8));

// 	User.prototype.validPassword = password => bcrypt.compare(password, this.password);

// 	/**
// 	 * Generates fake data
// 	 * @param {number} amount - number of fake data rows to generate
// 	 */
// 	// User.createFakeData = (amount = 10) => {
// 	// const data = []
// 	// for (let i = 0; i < amount; i++) {
// 	// data.push({
// 	// User.create(
// 	// 	{
// 	// 		name: faker.name.firstName(),
// 	// 		surname: faker.name.lastName(),
// 	// 		nickname: faker.internet.userName(),
// 	// 		email: faker.internet.email(null, null, 'example.com'),
// 	// 		Settings: {
// 	// 			privateData: 'Y',
// 	// 			emailAgreement: 'N',
// 	// 		},
// 	// 	},
// 	// 	{
// 	// 		include: ['Settings'],
// 	// 	}
// 	// )
// 	// 	.then(() => {
// 	// 		console.log('działa')
// 	// 	})
// 	// 	.catch(err => console.log(err))
// 	// }
// 	// User.bulkCreate()
// 	// 	.then(() => {
// 	// 		console.log('działa')
// 	// 	})
// 	// 	.catch(err => console.log(err))
// 	// }

// 	return User
// }
