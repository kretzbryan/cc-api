const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;
const controllers = require('./controllers');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const db = require('./models');
const connectDB = db.connectDB;

connectDB();

app.use(express.json({extended:false}))
app.use(fileUpload());
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(cors());
app.set('view engine', 'ejs');



app.use('/api/comment', controllers.comment);
app.use('/api/user', controllers.user);
app.use('/api/register', controllers.register);
app.use('/api/profile', controllers.profile);
app.use('/api/faq', controllers.faq);
app.use('/api/post', controllers.post);
app.use('/api/gig', controllers.gig);


app.listen( PORT, () => {
    console.log(`Now on port ${PORT}`)
})

