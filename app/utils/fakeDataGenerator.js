const faker = require('faker/locale/pl')
const { models } = require('../database')


models.User.createFakeData = (amount = 10) => {
	const data = []
	for (let i = 0; i < amount; i++) {
	data.push({
		models.User.create(
		{
			name: faker.name.firstName(),
			surname: faker.name.lastName(),
			nickname: faker.internet.userName(),
			email: faker.internet.email(null, null, 'example.com'),
			privateData: 'Y',
			emailAgreement: 'N',
		},
		{
			include: ['Settings'],
		}
	)})
	}
}