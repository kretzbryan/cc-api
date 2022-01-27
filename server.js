const express = require('express');
const app = express();
const cors = require('cors');
const controllers = require('./controllers');

require('dotenv').config();

// Add MONGO_URI and PORT  in .env file to get started!
// Uncomment code below

const db = require('./models');
const connectDB = db.connectDB;

connectDB();

const PORT = process.env.PORT;

app.get('/', (req, res) => {
	res.send('API Running');
});

app.use('/api/landing', controllers.landing);

app.listen(PORT, () => {
	console.log(`Server on port ${PORT}`);
});

// making change
