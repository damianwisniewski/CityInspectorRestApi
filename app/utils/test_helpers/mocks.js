const sinon = require('sinon')

/**
 * Mock of model instance
 */
exports.modelInstanceMock = {
	update: sinon.stub(),
	save: sinon.stub(),
	destroy: sinon.stub(),

	validateDataHash: sinon.stub(),

	getNotifications: sinon.stub(),
	getSubscriptions: sinon.stub(),
	createSubscription: sinon.stub(),
}

/**
 * Mock of model class
 */
exports.modelMock = {
	create: sinon.stub(),
	findOne: sinon.stub(),
	findAll: sinon.stub(),
	findByPk: sinon.stub(),
}

/**
 * Mock of response
 */
exports.res = {
	send: sinon.stub(),
	json: sinon.stub(),
	status: sinon.stub().returnsThis()
}

/**
 * Mock of authorized request
 */
exports.authReq = {
	headers: {
		authorization: 'Bearer fake_token',
	},
	locals: {
		user: this.modelInstanceMock,
		authorization: {
			token: 'fake_token',
			email: 'test@example.org',
			userId: '7de45b63-a6f4-4f1c-8095-a036bc24c265',
		}
	},
	body: {},
	query: {},
	params: {},
}

/**
 * Mock of non-authorized request
 */
exports.nonAuthReq = {
	headers: {},
	locals: {},
	body: {},
	query: {},
	params: {},
}