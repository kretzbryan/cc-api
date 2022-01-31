const dotenv = require('dotenv');

dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;
const controllers = require('./controllers');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const db = require('./models');
const { protect } = require('./middleware/auth');
const connectDB = db.connectDB;

connectDB();

app.use(express.json({ extended: false }));
app.use(fileUpload());
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(cors());
app.set('view engine', 'ejs');

app.use('/api/auth', controllers.auth);
app.use('/api/data/*', protect);
app.use('/api/data/comment', controllers.comment);
app.use('/api/data/user', controllers.user);
app.use('/api/data/register', controllers.register);
app.use('/api/data/profile', controllers.profile);
app.use('/api/data/faq', controllers.faq);
app.use('/api/data/post', controllers.post);
app.use('/api/data/gig', controllers.gig);

app.listen(PORT, () => {
	console.log(`Now on port ${PORT}`);
});
