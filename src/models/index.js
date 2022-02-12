const mongoose = require('mongoose');
// const config = require('config');
const db = process.env.MONGO_URI;

const connectDB = async () => {
	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		console.log('mongodb connected!!');
	} catch (err) {
		console.log(err.message);
		// exit process with failure
		process.exit(1);
	}
};

module.exports = module.exports = {
	Gig: require('./Gig'),
	Post: require('./Post'),
	User: require('./User'),
	Comment: require('./Comment'),
	Tag: require('./Tag'),
	Privacy: require('./Privacy'),
	Following: require('./Following'),
	PendingRequest: require('./PendingRequest'),
	Notification: require('./Notification'),
	Event: require('./Event'),
	Message: require('./Message'),
	MessageThread: require('./MessageThread'),
	RSVP: require('./RSVP'),
	UserReaction: require('./UserReaction'),
	connectDB: connectDB,
};
