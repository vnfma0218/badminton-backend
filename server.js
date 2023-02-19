const express = require('express');
const cors = require('cors');

const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const user = require('./routes/api/user');
const auth = require('./routes/auth');
const post = require('./routes/api/post');
const club = require('./routes/api/club');
const comment = require('./routes/api/comment');
const notification = require('./routes/api/notification');
const refresh = require('./routes/refresh');

app.use(credentials);
app.use(cors(corsOptions));
// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
// 정적(static) 파일을 손쉽게 제공하기 위해 사용한다. express.static 을 사용하지 않으면,
// 정적 파일이 존재하는 path 로 접근하기 위한 코드가 번거롭고 복잡하게 된다.
app.use('/public', express.static('public'));

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

app.use('/post', post);
app.use('/', club);
app.use('/', auth);
app.use('/', refresh);

app.use('/', user);
app.use('/comment', comment);
app.use('/noti', notification);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
