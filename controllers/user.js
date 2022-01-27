const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const config = require('../../config/default');

router.get('/', auth, async (req, res) => {
	try {
		console.log(req.user);
		const user = await db.User.findById(req.user.id).select('-password');
		res.json({ user });
	} catch (err) {
		res.status(500).send({ msg: 'An error occured.' });
	}
});

// logs in user and creates token for logged user
router.post('/login', async function (req, res) {
	const { username, password } = req.body;
	try {
		const foundUser = await db.User.findOne({ username });
		console.log(foundUser);
		if (!foundUser) {
			return res.status(400).json({ message: 'Password or email incorrect.' });
		}
		const match = await bcrypt.compare(password, foundUser.password);
		if (!match) {
			return res.status(400).json({ message: 'Password or email incorrect.' });
		}
		const payload = {
			user: {
				id: foundUser._id,
			},
		};

		jwt.sign(payload, config.jwtSecret, { expiresIn: 36000 }, (err, token) => {
			if (err) throw err;
			console.log(token, 'token');
			res.json({ token });
		});
	} catch (err) {
		res.send({ message: 'Internal Server Error' });
	}
});

// logs out user
router.delete('/logout', (req, res) => {
	req.session.destroy();
	res.json({ msg: 'You did it!' });
});

module.exports = router;
