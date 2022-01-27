const mongoose = require('mongoose');
const config = require('config');
const db = config.mongoURI;

const connectDB = async () => {
	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
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
	connectDB: connectDB,
};
