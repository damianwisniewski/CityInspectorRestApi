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