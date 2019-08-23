const { expect, ...chai } = require('chai')
const sinonChai = require('sinon-chai')
const sinon = require('sinon')

const cloudinary = require('cloudinary').v2
const photoStorageService = require('../photo_storage_service')

chai.use(sinonChai)

describe('Photo storage service', () => {
	before(() => {
		sinon.stub(cloudinary.api, 'resources_by_tag').callsFake(() => {})
		sinon.stub(cloudinary.api, 'delete_resources').callsFake(() => {})
		sinon.stub(cloudinary.uploader, 'upload').callsFake(() => {})
	})

	afterEach(() => {
		sinon.reset()
	})

	after(() => {
		sinon.restore()
	})

	context('get', () => {
		it('should succeed for string parameter and returns array of images data', done => {
			const notificationId = '2Dud-023es'

			photoStorageService
				.get(notificationId)
				.then(() => {
					expect(cloudinary.api.resources_by_tag).to.have.been.calledOnceWith(notificationId)
					done()
				})
				.catch(err => {
					done(err)
				})
		})

		it('should fail without pass any param', done => {
			photoStorageService
				.get()
				.then(() => {
					done(new Error('get method should be failed without any param passed'))
				})
				.catch(() => {
					expect(cloudinary.api.resources_by_tag).to.not.have.been.called
					done()
				})
		})
	})

	context('remove', () => {
		it('should succeed for string parameter', done => {
			const notificationId = '2Dud-023es'

			photoStorageService
				.remove(notificationId)
				.then(() => {
					expect(cloudinary.api.delete_resources).to.have.been.calledWith(notificationId)
					done()
				})
				.catch(err => {
					done(err)
				})
		})

		it('should succeed for Array full of strings', done => {
			const notificationIds = ['2Dud-123es', '2Dud-223es', '2Dud-323es']

			photoStorageService
				.remove(notificationIds)
				.then(() => {
					expect(cloudinary.api.delete_resources).to.have.been.calledWith(notificationIds)
					done()
				})
				.catch(err => {
					done(err)
				})
		})

		it('should fail for boolean value as param', done => {
			const booleanValue = true

			photoStorageService
				.remove(booleanValue)
				.then(() => {
					done(new Error('remove method should fail, but it succeeded'))
				})
				.catch(() => {
					expect(cloudinary.api.delete_resources).to.not.have.been.called
					done()
				})
		})

		it('should fail without pass any param', done => {
			const booleanValue = true

			photoStorageService
				.remove(booleanValue)
				.then(() => {
					done(new Error('remove method should fail, but it succeeded'))
				})
				.catch(() => {
					expect(cloudinary.api.delete_resources).to.not.have.been.called
					done()
				})
		})
	})

	context('send', () => {
		it('should succeed', done => {
			const notificationId = '2Dud-023es'
			const file = {
				mock: 'sss',
				mimetype: '',
				buffer: [],
			}

			const encodedFile = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`

			photoStorageService
				.send(file, notificationId)
				.then(() => {
					expect(cloudinary.uploader.upload).to.have.been.calledOnceWith(encodedFile)
					done()
				})
				.catch(err => {
					done(err)
				})
		})

		it('should fail without file (first) param', done => {
			photoStorageService
				.send()
				.then(() => {
					done(new Error('remove method should fail, but it succeeded'))
				})
				.catch(() => {
					expect(cloudinary.uploader.upload).to.not.have.been.called
					done()
				})
		})

		it('should fail without NotificationId (second) param', done => {
			const file = {
				mock: 'sss',
				mimetype: '',
				buffer: [],
			}

			photoStorageService
				.send(file)
				.then(() => {
					done(new Error('remove method should fail, but it succeeded'))
				})
				.catch(() => {
					expect(cloudinary.uploader.upload).to.not.have.been.called
					done()
				})
		})

		it("should fail if first param won't contain buffer param", done => {
			const notificationId = '2Dud-023es'
			const file = {
				mock: 'sss',
				mimetype: '',
			}

			photoStorageService
				.send(file, notificationId)
				.then(() => {
					done(new Error('remove method should fail, but it succeeded'))
				})
				.catch(() => {
					expect(cloudinary.uploader.upload).to.not.have.been.called
					done()
				})
		})
	})
})
