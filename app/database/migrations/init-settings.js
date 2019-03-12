module.exports = (sequelize, Sequelize) => {
	const Settings = sequelize.define('settings', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
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

	return Settings
}
