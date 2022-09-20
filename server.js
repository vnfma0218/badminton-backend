const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
console.log(uri);
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

app.get('/home', (req, res) => {
  console.log('home');
  res.send({ name: 'pooreum' });
});

app.post(
  '/login', // username must be an email
  body('email').isEmail(),
  // password must be at least 5 chars long
  body('password').isLength({ min: 5 }),
  (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // email 형식 맞는지 체크?
    // 이름 유효성 검사
    // password 유효성검사
    // password 두개 일치하는지 검사
    // db 저장
    // 성공 메시지
  }
);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
