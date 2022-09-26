const User = require('../model/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
require('dotenv').config();

const registerUser = async (req, res) => {
  console.log(req.body);
  const { name, email, password, passwordConfirm } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  if (password !== passwordConfirm) {
    return res.status(400).json({ errors: [{ password: 'not same' }] });
  }

  // 중복되는 이메일 찾기
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'already use in email' });
  }

  // 패스워드 변환하기 (bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedPw = await bcrypt.hash(password, salt);
  const user = new User({
    name,
    email,
    password: hashedPw,
  });

  await user.save();

  //   // TODO 토큰 생성 후 토큰
  //   const token = jwt.sign({ email }, tokenKey);

  //   // jwt
  //   console.log(token);
  return res.status(200).json({ message: 'success' });
};

const getAllUsers = async (req, res) => {
  console.log('get all user');
};

module.exports = {
  registerUser,
  getAllUsers,
};
