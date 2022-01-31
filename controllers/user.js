const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
	try {
		console.log(req.user);
		const user = await db.User.findById(req.user.id).select('-password');
		res.json({ user });
	} catch (err) {
		res.status(500).send({ msg: 'An error occured.' });
	}
});

module.exports = router;
