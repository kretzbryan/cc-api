const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
	try {
		console.log(req.user);
		const user = await db.User.findById(req.user.id)
			.select('-password')
			.populate({
				path: 'posts',
				populate: [
					{
						path: 'createdBy',
						model: 'User',
					},
					{
						path: 'comments',
						model: 'Comment',
						populate: [
							{
								path: 'createdBy',
								model: 'User',
							},
							{
								path: 'comments',
								model: 'Comment',
								populate: {
									path: 'createdBy',
									model: 'User',
								},
							},
						],
					},
				],
			});
		res.json({ user });
	} catch (err) {
		res.status(500).send({ msg: err.message });
	}
});

module.exports = router;
