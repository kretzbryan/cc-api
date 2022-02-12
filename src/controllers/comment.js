const express = require('express');
const router = express.Router();
const db = require('../models');

router.post('/', async (req, res) => {
	const { itemType, itemId, text } = req.body;
	try {
		let item;
		const user = await db.User.findById(req.user.id);
		const newComment = new db.Comment({
			text,
			createdBy: user,
			commentLocation: itemType,
			locationId: itemId,
		});

		await newComment.save();
		if (itemType === 'post') {
			item = await db.Post.findById(itemId)
				.populate('createdBy')
				.populate({
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
				});
		}
		if (itemType === 'comment') {
			item = await db.Comment.findById(itemId).populate('comments createdBy');
		}
		await item.comments.push(newComment);

		const savedItem = await item.save();

		if (item.createdBy !== user) {
			const newNotification = await db.Notification.create({
				notificationType: 'comment',
				data: savedItem,
			});
			const recipient = await db.User.findById(item.createdBy._id);
			recipient.notifications.new.push(newNotification);
			await recipient.save();
		}
		res.json({ item: savedItem, newComment });
	} catch (err) {
		console.log(err);
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const comment = await db.Comment.findById(req.params.id);
		const post = await db.Post.findById(comment.post);
		await post.comments.remove(comment);
		await post.save();
		await comment.remove();
		const posts = db.Post.find({});

		res.json(posts);
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
