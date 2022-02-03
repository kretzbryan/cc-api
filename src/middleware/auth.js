const jwt = require('jsonwebtoken');
// const config = require('config');

exports.protect = function (req, res, next) {
	console.log('checking token');
	const token = req.header('x-auth-token');

	if (!token) {
		return res.status(401).json({ msg: 'No token, authorization denied.' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		req.user = decoded.user;
		next();
	} catch {
		res.status(401).json({ msg: 'Token is not valid.' });
	}
};
