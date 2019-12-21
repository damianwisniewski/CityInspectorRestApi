const { Model } = require('sequelize')
const photoStorage = require('../services/photo_storage_service')

module.exports = class Photo extends Model {
	static init(sequelize, DataTypes) {
		return super.init(
			{
				id: {
					type: DataTypes.INTEGER,
					autoIncrement: true,
					allowNull: false,
					primaryKey: true,
					unique: true,
				},
				tag: {
					type: DataTypes.UUID,
					allowNull: false,
					unique: true,
				},
				photo1: {
					type: DataTypes.STRING,
					unique: true,
					validate: {
						isUrl: true,
					},
				},
				photo2: {
					type: DataTypes.STRING,
					unique: true,
					validate: {
						isUrl: true,
					},
				},
				photo3: {
					type: DataTypes.STRING,
					unique: true,
					validate: {
						isUrl: true,
					},
				},
				photo4: {
					type: DataTypes.STRING,
					unique: true,
					validate: {
						isUrl: true,
					},
				},
				photo5: {
					type: DataTypes.STRING,
					unique: true,
					validate: {
						isUrl: true,
					},
				},
			},
			{
				hooks: {
					beforeCreate: Photo.beforeValidate,
					beforeUpdate: Photo.beforeValidate,
					afterDestroy: Photo.afterDestroy,
				},
				sequelize,
				modelName: 'Photos',
			},
		)
	}

	static associate(models) {
		Photo.hasOne(models.Notification, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
	}

	/**
	 * HOOK
	 * Prepares photo data with proper datas.
	 * Checking newPhotos, deletePhotos properties in options,
	 * then uses it to save image url in database and prepares images to be save in cloudinary.
	 */
	static async beforeValidate(photo, options) {
		const { newPhotos, deletePhotos } = options
		let availableFields = { amount: 5, free: ['photo1', 'photo2', 'photo3', 'photo4', 'photo5'] }

		if (!photo.isNewRecord) {
			if (deletePhotos) {
				const deletedPhotosData = photo.deletePhotos(deletePhotos)

				for (const [columnName, imageId] of deletedPhotosData) {
					photo.set({ [columnName]: null })
					photo.cloudinaryState.toDelete.push(imageId)
				}
			}

			availableFields = photo.getFreeSlots()
		}

		if (newPhotos) {
			if (newPhotos.length > availableFields.amount) {
				throw `There is not enougth spots to add ${newPhotos.length} photo(s)`
			}

			const photosToSave = newPhotos.map((file, index) => {
				const dbColumn = availableFields.free[index]
				const photoName = `${photo.tag}__${dbColumn}`
				const photoUrl = `https://res.cloudinary.com/dcnk17eji/image/upload/v1567580461/city_inspector/${photoName}`

				photo.set({ [dbColumn]: photoUrl })

				file.photoName = photoName
				return file
			})

			photo.cloudinaryState.toSave = photosToSave
		}
	}

	/**
	 * HOOK
	 */
	static async afterDestroy(photo) {
		try {
			await photoStorage.remove(photo.tag)
		} catch (err) {
			throw new Error('Something went wrong with coudinary api')
		}
	}

	constructor(...args) {
		super(...args)

		/**
		 * State used to easy work with SQL transactions.
		 * Cloudinary doesn't offer operation like this.
		 * The idea is to save proper data in state and then
		 * to confirm this changes, with another commit method or cancel with revert method.
		 */
		this.cloudinaryState = {
			toSave: [],
			toDelete: [],
		}
	}

	/**
	 * It's needed to know which slots are empty, before update operation,
	 * to not override photo that was already uploaded and I don't want to delete it.
	 */
	getFreeSlots() {
		const data = this.get({ plain: true })
		const emptyPhotoSlots = Object.entries(data)
			.filter(([key, value]) => /photo/.test(key) && !value)
			.map(([key]) => key)

		return {
			amount: emptyPhotoSlots.length,
			free: emptyPhotoSlots,
		}
	}

	/**
	 * Deletes photos urls from database and sets photos to delete form cloudinary storage.
	 * @param {Array<string>} photosToDelete
	 */
	deletePhotos(photosToDelete = []) {
		const photosUrls = {
			photo1: this.photo1,
			photo2: this.photo2,
			photo3: this.photo3,
			photo4: this.photo4,
			photo5: this.photo5,
		}

		const photosUrlsToDelete = Object.entries(photosUrls).filter(([, fileUrl]) => {
			if (fileUrl) {
				return photosToDelete.includes(fileUrl.split('v1567580461/')[1])
			}
		})

		const photosIdsToDelete = photosUrlsToDelete.map(([key, fileUrl]) => [
			key,
			fileUrl.split('v1567580461/')[1],
		])

		return new Map(photosIdsToDelete)
	}

	/**
	 * Method created to send to coudinary storage, photos saved in photosToSave property.
	 * Should be called after all queries in transaction will pass and we are sure to send photos.
	 */
	async commitPhotos() {
		if (this.cloudinaryState.toDelete.length) {
			await Promise.all(
				this.cloudinaryState.toDelete.map(async photoId => {
					return await photoStorage.remove([photoId])
				}),
			)
		}

		if (this.cloudinaryState.toSave.length) {
			await Promise.all(
				this.cloudinaryState.toSave.map(async file => {
					return await photoStorage.send(file, file.photoName, this.tag)
				}),
			)
		}

		return
	}

	/**
	 * Reverts all update operations (delete and save photo) in cloudinary storage.
	 * Designed to be called after update transaction fail, to revert changes in cloudinary.
	 */
	async revertPhotos() {
		if (this.cloudinaryState.toDelete.length) {
			await Promise.all(
				this.cloudinaryState.toDelete.map(async photoId => {
					return await photoStorage.restore([photoId])
				}),
			)
		}

		if (this.cloudinaryState.toSave.length) {
			await Promise.all(
				this.cloudinaryState.toSave.map(async file => {
					return await photoStorage.remove([file.photoName])
				}),
			)
		}

		return
	}
}
