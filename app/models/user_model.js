const { Model } = require('sequelize')
const cryptoService = require('../services/crypto_service')
const uuid = require('uuid/v4')

module.exports = class User extends Model {
	static init(sequelize, DataTypes) {
		return super.init(
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: () => uuid(),
					allowNull: false,
					primaryKey: true,
					unique: true,
				},
				name: {
					type: DataTypes.STRING,
				},
				surname: {
					type: DataTypes.STRING,
				},
				city: {
					type: DataTypes.STRING,
				},
				gender: {
					type: DataTypes.ENUM('M', 'F'),
					validate: {
						isIn: [['M', 'F']],
					},
				},
				nickname: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true,
				},
				email: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true,
					validate: {
						isEmail: {
							msg: 'Wrong email format',
						},
					},
				},
				password: {
					type: DataTypes.STRING,
					allowNull: false,
					validate: {
						notEmpty: true,
					},
				},
				emailAgreement: {
					type: DataTypes.ENUM('Y', 'N'),
					allowNull: false,
					defaultValue: 'Y',
					validate: {
						isIn: [['Y', 'N']],
					},
				},
				resetPasswordToken: {
					type: DataTypes.STRING,
				},
			},
			{
				hooks: {
					beforeCreate: user => {
						return Promise.all([
							User.generateDataHash(user.password).then(hashedPassword => {
								user.password = hashedPassword
							}),

							User.generateDataHash(user.email + Date.now()).then(resetPasswordToken => {
								user.resetPasswordToken = resetPasswordToken
							}),
						])
					},

					beforeBulkCreate: users => {
						return Promise.all(
							users.map(user =>
								Promise.all([
									User.generateDataHash(user.password).then(hashedPassword => {
										user.password = hashedPassword
									}),

									User.generateDataHash(user.email + Date.now()).then(resetPasswordToken => {
										user.resetPasswordToken = resetPasswordToken
									}),
								]),
							),
						)
					},

					beforeUpdate: user =>
						new Promise(resolve => {
							const changes = user.changed()

							if (changes) {
								if (changes.includes('email')) {
									User.generateDataHash(user.email + Date.now()).then(resetPasswordToken => {
										user.resetPasswordToken = resetPasswordToken
										resolve()
									})
								} else if (changes.includes('password')) {
									Promise.all([
										User.generateDataHash(user.password).then(hashedPassword => {
											user.password = hashedPassword
										}),

										User.generateDataHash(user.email + Date.now()).then(resetPasswordToken => {
											user.resetPasswordToken = resetPasswordToken
										}),
									]).then(resolve)
								} else {
									resolve()
								}
							} else {
								resolve()
							}
						}),
				},
				sequelize,
				modelName: 'User',
			},
		)
	}

	static associate(model) {
		User.hasMany(model.Notification, { onDelete: 'SET NULL', onUpdate: 'NO ACTION' })
		User.hasMany(model.Comment, { onDelete: 'SET NULL', onUpdate: 'NO ACTION' })
		User.hasMany(model.Subscription, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
	}

	static generateDataHash(password) {
		return cryptoService.generateHashedValue(password)
	}

	validateDataHash(password) {
		return cryptoService.compareHashedValues(password, this.password)
	}
}
