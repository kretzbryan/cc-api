const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

router.post(
	'/register',
	[
		check('firstName', 'First Name is required').not().isEmpty(),
		check('lastName', 'Last Name is required').not().isEmpty(),
		check('email', 'Please include a valid email').isEmail(),
		check(
			'password',
			'Please enter a password with 6 or more characters'
		).isLength({ min: 6 }),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		let { email, password } = req.body;
		email = email.toLowerCase();
		try {
			let foundUser = await db.User.findOne({ email });
			if (foundUser) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'User already exists' }] });
			}
			const salt = await bcrypt.genSalt(10);
			hash = await bcrypt.hash(password, salt);
			req.body.password = hash;
			const newUser = new db.User({ ...req.body, email });
			const newPrivacy = await db.Privacy.create({});
			const newFollowing = await db.Following.create({});
			newUser.privacy = newPrivacy;
			newUser.following = newFollowing;
			await newUser.save();

			const payload = {
				user: {
					id: newUser._id,
				},
			};
			jwt.sign(
				payload,
				process.env.JWT_SECRET,
				{ expiresIn: 36000 },
				(err, token) => {
					if (err) {
						throw { message: `At jwt sign${err.message}` };
					}
					console.log(token, 'token');
					res.status(200).json({ token });
				}
			);
		} catch (err) {
			console.log(err.message), res.status(500).send('Internal Server Error');
		}
	}
);

// logs in user and creates token for logged user
router.post('/login', async function (req, res) {
	try {
		const { username, password } = req.body;
		console.log(req.body);
		const foundUser = await db.User.findOne({ username }).select('+password');
		console.log(foundUser);
		if (!foundUser) {
			return res.status(400).json({ message: 'Password or email incorrect.' });
		}
		const match = await bcrypt
			.compare(password, foundUser.password)
			.catch((err) => {
				throw {
					message: `At match${err.message}`,
				};
			});
		if (!match) {
			return res.status(400).json({ message: 'Password or email incorrect.' });
		}
		const payload = {
			user: {
				id: foundUser._id,
			},
		};

		jwt.sign(
			payload,
			process.env.JWT_SECRET,
			{ expiresIn: 36000 },
			(err, token) => {
				if (err) {
					throw { message: `At jwt sign${err.message}` };
				}
				console.log(token, 'token');
				res.json({ token });
			}
		);
	} catch (err) {
		res.send({ message: err.message });
	}
});

router.delete('/logout', (req, res) => {
	req.session.destroy();
	res.json({ msg: 'You did it!' });
});

module.exports = router;
