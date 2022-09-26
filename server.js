const express = require('express');
const cors = require('cors');

const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const corsOptions = require('./config/corsOptions');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const user = require('./routes/api/user');
const login = require('./routes/login');
const post = require('./routes/api/post');
const verifyJWT = require('./middleware/verifyJWT');
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

app.use('/', login);
app.use('/refresh', require('./routes/refresh'));

app.use(verifyJWT);

app.use('/', user);
app.use('/post', post);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
