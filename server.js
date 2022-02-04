const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;
const controllers = require('./src/controllers');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const db = require('./src/models');
const { protect } = require('./src/middleware/auth');
const connectDB = db.connectDB;

connectDB();

app.use(express.json({ extended: false }));
// app.use(bodyParser.json());
app.use(fileUpload());
app.use(methodOverride('_method'));
app.use(cors());

app.use('/api/auth', controllers.auth);
app.use('/api/data/*', protect);
app.use('/api/data/image', controllers.image);
app.use('/api/data/comment', controllers.comment);
app.use('/api/data/connection', controllers.connection);
app.use('/api/data/event', controllers.event);
app.use('/api/data/message', controllers.message);
app.use('/api/data/locations', controllers.locations);
app.use('/api/data/tag', controllers.tag);
app.use('/api/data/user', controllers.user);
app.use('/api/data/register', controllers.register);
app.use('/api/data/profile', controllers.profile);
app.use('/api/data/people', controllers.people);
app.use('/api/data/faq', controllers.faq);
app.use('/api/data/post', controllers.post);
app.use('/api/data/gig', controllers.gig);

app.listen(PORT, () => {
	console.log(`Now on port ${PORT}`);
});
