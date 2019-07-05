const { Model } = require('sequelize')
const bcrypt = require('bcrypt')

module.exports = class User extends Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				allowNull: false,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				validate: {
					is: /[a-zA-ZĄĆĘŁŃÓŚŹŻąćęłńóśźż]/g,
					min: 5,
				}
			},
			surname: {
				type: DataTypes.STRING,
				validate: {
					is: /[a-zA-ZĄĆĘŁŃÓŚŹŻąćęłńóśźż-]/g,
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
					is: /[\da-zA-ZĄĆĘŁŃÓŚŹŻąćęłńóśźż\-_]/g,
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
				hooks: {
					beforeCreate: user => {
						return User.generateHash(user.password).then(hashedPassword => {
							user.password = hashedPassword
						})
					}
					// before bluk
				},
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
