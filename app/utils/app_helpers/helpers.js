/**
 * Checks provided object to have required params.
 * @param {Object} obj - Object of params do you want to check
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
 * Extends every nested objects by provided param
 * @param {Object} obj - Object with nested objects to extend
 * @param {Object} additionalParam - object with param to add
 * @returns {Object} object extended by passed param
 */
exports.extendNestedObjectsBy = (obj = {}, additionalParam = {}) => {
	const entries = Object.entries(obj)
	const everyNestedIsObject = entries.every(([, value]) => value.toString() === '[object Object]')

	if (everyNestedIsObject) {
		return entries.reduce((accumulatedRules, [param, rules]) => {
			const copiedRules = {
				[param]: Object.assign({}, rules, additionalParam),
			}
			return Object.assign(accumulatedRules, copiedRules)
		}, {})
	}

	return obj
}

exports.removeUndefinedProperties = obj => {
	const entries = Object.entries(obj)
	const preparedEntries = entries.filter(([, value]) => value)

	if (preparedEntries) {
		return preparedEntries.reduce((accumulatedRules, [key, value]) => {
			accumulatedRules[key] = value
			return accumulatedRules
		}, {})
	}

	return null
}
