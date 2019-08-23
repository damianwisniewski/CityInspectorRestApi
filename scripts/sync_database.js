const { sequelize } = require('../app/models')
const forced = process.argv.includes('--force')

const init = async () => {
	try {
		/**
		 * ['FOREIGN_KEY_CHECKS']
		 * [1] - Enables foreign
		 * [0] - Disables foreign
		 * Foreign key constraints (database relations - associations)
		 *
		 * It's needed to disable key constraint for sync in force mode
		 */
		await sequelize.query('SET FOREIGN_KEY_CHECKS=0;')
		await sequelize.sync({ force: forced })
		await sequelize.query('SET FOREIGN_KEY_CHECKS=1;')
	} catch (err) {
		console.log(err)
		await sequelize.query('SET FOREIGN_KEY_CHECKS=1;')
	}
}

init()
