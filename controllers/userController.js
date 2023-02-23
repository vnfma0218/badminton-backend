const User = require('../model/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const { RESULT_CODE } = require('../config/apiCode');
require('dotenv').config();

const registerUser = async (req, res) => {
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

  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: foundUser.id,
        role: 'user',
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { algorithm: 'HS256', expiresIn: '1d' }
  );
  const refreshToken = jwt.sign(
    {
      id: foundUser.id,
      role: 'user',
    },
    process.env.REFRESH_TOKEN_SECRET,
    { algorithm: 'HS256', expiresIn: '7d' }
  );
  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('jwt', refreshToken);
  res.cookie('userId', user._id);

  return res
    .status(200)
    .json({ message: 'success', resultCode: RESULT_CODE['success'] });
};

const getAllUsers = async (req, res) => {};

const editUser = async (req, res) => {
  const { name, level, intro } = req.body;
  const response = await User.findOneAndUpdate(
    { name },
    {
      name,
      level,
      intro,
    }
  );
  res.status(200).json({
    resultCode: RESULT_CODE['success'],
    message: 'success',
  });
};

const getUserById = async (req, res) => {
  const user = await User.findById(req.userId);
  res.status(200).json({
    resultCode: RESULT_CODE['success'],
    dataList: {
      user: {
        name: user.name,
        intro: user.intro ?? '',
        level: user.level ?? '',
      },
    },
  });
};

module.exports = {
  registerUser,
  getAllUsers,
  editUser,
  getUserById,
};
