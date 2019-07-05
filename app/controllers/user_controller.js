const webTocken = require('../services/jwtService')

module.exports = {
	getUsers: (req, res) => {
		const jwt = webTocken.create({
			login: 'sssss',
			id: 'UUIDv4'
		})
		// console.log(req.body)
		res.json({ token: jwt })
		// next({ a: 'err' })
	}
}