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
const refresh = require('./routes/refresh');

app.use(credentials);
app.use(cors(corsOptions));
// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

app.use('/', auth);
app.use('/', refresh);

app.use('/', user);
app.use('/post', post);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
