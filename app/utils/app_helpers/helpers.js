/**
 * Checks provided object to have required params.
 * @param {Object<any>} obj - Object of params do you want to check
 * @param {Array<string>} requiredParams - List of required params
 */
exports.includesParams = (obj, requiredParams) => {
	const objParams = Object.keys(obj)

	if (objParams.length) {
		for (let i = 0; i < requiredParams.length; i++) {
			if (!objParams.includes(requiredParams[i])) {
				return false
			}
		}

		return true
	} else {
		return false
	}
}

/**
 * @param {string} mimeType
 */
exports.getImageType = mimeType => (typeof mimeType === 'string' ? mimeType.split('/')[1] : null)
