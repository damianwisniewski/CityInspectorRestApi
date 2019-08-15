const faker = require('faker/locale/pl')
const { models } = require('../app/models')

/**
* Pushes users data to database
* @param {number} amount 
* @returns {Promise<Sequelize.Model>} users
*/
const createUserData = (amount = 10) => {
	const usersDataArr = [{
		name: 'Jan',
		surname: 'Kowalski',
		gender: 'M',
		nickname: 'tester',
		email: 'test@example.org',
		password: 'test123',
		emailAgreement: 'Y'
	}]

	for (let i = 0; i < amount; i++) {
		usersDataArr.push(
			{
				name: faker.name.firstName(),
				surname: faker.name.lastName(),
				gender: faker.random.arrayElement(['M', 'F']),
				nickname: faker.name.firstName() + faker.random.alphaNumeric(3).toUpperCase(),
				email: faker.internet.email(null, null, 'example.com'),
				password: faker.internet.password(),
				privateData: faker.random.arrayElement(['Y', 'N']),
				emailAgreement: faker.random.arrayElement(['Y', 'N']),
			},
		)
	}

	return models.User.bulkCreate(usersDataArr)
}

/**
 * Pushes notifications, localizations and photos data to database
 * @param {number} userId
 * @param {number} amount
 * @returns {Promise<Instance[]>} notifications
 */
const createNotificationsData = (userId, amount = 10) => {
	const createPromisesArr = []

	for (let i = 0; i < amount; i++) {
		const creationPromise = models.Notification.create(
			{
				title: faker.lorem.sentence(),
				description: faker.lorem.text(),
				CategoryId: faker.random.arrayElement([1, 2, 3, 4]),
				StatusId: faker.random.arrayElement([1, 2, 3]),
				UserId: userId,
				Localization: {
					lat: faker.address.latitude(),
					lan: faker.address.longitude(),
					city: faker.address.city(),
					street: faker.address.streetName(),
					number: faker.random.number(),
					post: 11 + '-' + 111
				},
				Photo: {
					location: '/aa'
				}
			},
			{
				include: [
					{
						model: models.Localization
					},
					{
						model: models.Photo
					}
				]
			}
		)

		createPromisesArr.push(creationPromise)
	}

	return Promise.all(createPromisesArr)
}

/**
 * Pushes subspriptions data to database
 * @param {Instance[]} subscribers 
 * @param {Instance[]} notificationsToSubscribe
 * @returns {Promise<Instance[]>} subscriptions
 */
const createSubscriptionsData = (subscribers, notificationsToSubscribe) => {
	let subscriptionsArr = []

	subscribers.forEach(user => {
		const subscriptions = notificationsToSubscribe.map(notification => ({
			NotificationId: notification.id,
			UserId: user.id
		}))

		subscriptionsArr = [
			...subscriptionsArr,
			...subscriptions
		]
	})

	return models.Subscription.bulkCreate(subscriptionsArr)
}

/**
 * Pushes comments data to database
 * @param {Instance[]} usersWithComments 
 * @param {Instance[]} notificationsWithComments
 * @returns {Promise<Instance[]>} comments
 */
const createCommentsData = (usersWithComments, notificationsWithComments) => {
	let commentsArr = []

	usersWithComments.forEach(user => {
		const comments = notificationsWithComments.map(notification => ({
			text: faker.lorem.paragraph(),
			NotificationId: notification.id,
			UserId: user.id
		}))

		commentsArr = [
			...commentsArr,
			...comments
		]
	})

	return models.Comment.bulkCreate(commentsArr)
}


/**
 * Fill database with fake data
 */
(async () => {
	try {
		const users = await createUserData()

		users.forEach(async (user) => {
			const notification = await createNotificationsData(user.id)

			const subscribers = users.filter(filteredUser => user.id !== filteredUser.id && Math.round(Math.random() * 100) > 80)
			const notificationsToSubscribe = notification.filter(() => Math.round(Math.random() * 100) > 80)
			await createSubscriptionsData(subscribers, notificationsToSubscribe)

			const usersWithComments = users.filter(() => Math.round(Math.random() * 100) > 85)
			const notificationsWithComments = notification.filter(() => Math.round(Math.random() * 100) > 85)
			await createCommentsData(usersWithComments, notificationsWithComments)
		})

	} catch (err) {
		console.log(err)
	}
})()