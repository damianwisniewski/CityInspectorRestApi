/**
 * @param {string} queryInterface
 * @param {Sequelize} Sequelize
 * @returns {Sequelize.Model} Category
 */
module.exports = (queryInterface, Sequelize) => {
	const Category = queryInterface.define('Category', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		name: Sequelize.STRING,
	})

	/**
	 * Creates relations between tables.
	 * Thanks to this kind of connections between tables, sequelize provides some extra functionalities.
	 * http://docs.sequelizejs.com/manual/tutorial/associations.html#associating-objects
	 * @param {Object} model - Object of sequelize data models.
	 */
	Category.associate = model => {
		Category.hasMany(model.Notification)
	}

	/**
	 * "Data dictionary" tables should keep some read-only data, to describe some content in a unified way.
	 * Makes sure the table is filled with specified data, if not, those data will be created.
	 */
	Category.createDictionaryValues = () => {
		const defaultValues = ['test1', 'test2', 'test3']

		defaultValues.forEach(value => {
			Category.findOrCreate({
				where: {
					name: value,
				},
			})
		})
	}
	return Category
}
