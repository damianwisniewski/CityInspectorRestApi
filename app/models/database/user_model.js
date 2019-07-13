const { Model } = require('sequelize')
const bcrypt = require('bcrypt')
const uuid = require('uuid/v4')

module.exports = class User extends Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.UUID,
				defaultValue: () => uuid(),
				allowNull: false,
				primaryKey: true,
				unique: true,
			},
			name: {
				type: DataTypes.STRING,
				validate: {
					is: /[a-zA-ZĄĆĘŁŃÓŚŹŻąćęłńóśźż]/g,
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
				unique: true,
				validate: {
					is: /[\da-zA-ZĄĆĘŁŃÓŚŹŻąćęłńóśźż\-_]/g,
					notEmpty: true
				},
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: {
						msg: 'Wrong email format'
					},
				},
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
					},

					beforeBulkCreate: users => {
						return Promise.all(
							users.map(user => {
								return User.generateHash(user.password).then(hashedPassword => {
									user.password = hashedPassword
								})
							})
						)
					}
				},
				sequelize,
				modelName: 'User'
			})
	}

	static associate(model) {
		User.hasMany(model.Notification)
		User.hasMany(model.Comment)
		User.hasMany(model.Subscription, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
	}

	static generateHash(password) {
		return bcrypt.hash(password, bcrypt.genSaltSync(8))
	}

	validatePassword(password) {
		return bcrypt.compare(password, this.password)
	}
}
