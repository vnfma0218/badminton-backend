const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { body, validationResult, check } = require('express-validator');
const { User } = require('./model/user');

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
// passwordConfirm
app.post(
  '/signup',
  check('email').isEmail().withMessage('올바른 이메일 형식을 입력해주세요'),
  body('password')
    .matches(
      /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/
    )
    .withMessage('password regex'),

  async (req, res) => {
    console.log(req.body);
    const { name, email, password, passwordConfirm } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (password !== passwordConfirm) {
      return res.status(400).json({ errors: [{ password: 'not same' }] });
    }

    // 패스워드 변환하기 (bcrypt)
    const user = new User({
      name,
      email,
      password,
    });

    // 중복되는 이메일 찾기
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'already use in email' });
    }

    const result = await user.save();

    // TODO 토큰 생성 후 토큰도 함께 전송
    return res.status(200).json({ message: 'success' });
  }
);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
